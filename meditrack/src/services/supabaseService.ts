import { supabase, isSupabaseConfigured } from './supabase';
import {
  signUpMock,
  signInMock,
  updateProfileMock,
  saveSessionMock,
  getSessionsMock,
  deleteSessionMock,
} from './supabaseMock';
import type { AnalysisResult, UserProfile, SymptomEntry } from '../types';

interface ExtendedUserProfile extends UserProfile {
  fullName?: string;
  email?: string;
}

export async function signUp(email: string, password: string, fullName: string) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign up failed: no user data returned.');

    // Manually insert initial profile mapping in case schema trigger is disabled
    try {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        age: null,
        sex: null,
        pre_conditions: [],
      });
    } catch (profileErr) {
      console.warn('Profile auto-insert warning (might already be handled by trigger):', profileErr);
    }

    return {
      user: {
        fullName,
        email: data.user.email || email,
        age: undefined,
        sex: undefined,
        conditions: [],
      },
      token: data.session?.access_token || null,
      requiresConfirmation: !data.session,
    };
  } else {
    return signUpMock(email, password, fullName);
  }
}

export async function signIn(email: string, password: string) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed: no user data returned.');

    // Retrieve profile details
    let profileData: any = null;
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (!profileError) {
        profileData = profile;
      }
    } catch (profileErr) {
      console.warn('Failed to retrieve profile table, using user metadata:', profileErr);
    }

    return {
      user: {
        fullName: profileData?.full_name || data.user.user_metadata?.full_name || '',
        email: data.user.email || email,
        age: profileData?.age || undefined,
        sex: profileData?.sex || undefined,
        conditions: profileData?.pre_conditions || [],
      },
      token: data.session?.access_token || 'supabase_token_placeholder',
    };
  } else {
    return signInMock(email, password);
  }
}

export async function updateProfile(email: string, updates: Partial<ExtendedUserProfile>) {
  if (isSupabaseConfigured() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication session not found.');

    const dbUpdates: any = {};
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.age !== undefined) dbUpdates.age = updates.age;
    if (updates.sex !== undefined) dbUpdates.sex = updates.sex;
    if (updates.conditions !== undefined) dbUpdates.pre_conditions = updates.conditions;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      fullName: profile.full_name || updates.fullName || '',
      email: user.email || email,
      age: profile.age || undefined,
      sex: profile.sex || undefined,
      conditions: profile.pre_conditions || [],
    };
  } else {
    return updateProfileMock(email, updates);
  }
}

export async function saveSession(
  email: string,
  result: AnalysisResult,
  symptomsList?: SymptomEntry[]
) {
  if (isSupabaseConfigured() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // If no active user session, save as guest in mock local storage
      return saveSessionMock(email, result);
    }

    // Insert top-level session record
    const { error: sessionError } = await supabase.from('sessions').insert({
      id: result.sessionId,
      user_id: user.id,
      urgency_level: result.urgencyLevel,
      urgency_color: result.urgencyColor,
      top_condition: result.conditions[0]?.name || 'Unknown Condition',
      raw_ai_response: result,
      symptoms_summary: { symptoms: result.keySymptoms || [] },
      is_offline: false,
    });

    if (sessionError) throw sessionError;

    // Bulk save conditions (staggered mapping list)
    if (result.conditions && result.conditions.length > 0) {
      const conditionRows = result.conditions.map((c, index) => ({
        session_id: result.sessionId,
        condition_name: c.name,
        confidence_pct: c.confidence,
        description: c.description,
        learn_more_url: c.learnMoreUrl || null,
        rank: index,
      }));

      const { error: condError } = await supabase.from('conditions').insert(conditionRows);
      if (condError) console.error('Failed to save conditions metadata:', condError);
    }

    // Bulk save symptoms details
    if (symptomsList && symptomsList.length > 0) {
      const symptomRows = symptomsList.map((s) => ({
        session_id: result.sessionId,
        body_region: s.region,
        symptom_name: s.symptomName,
        severity: s.severity,
        duration_label: s.duration,
        free_text: s.freeText || null,
      }));

      const { error: sympError } = await supabase.from('symptoms').insert(symptomRows);
      if (sympError) console.error('Failed to save symptoms metadata:', sympError);
    }

    return {
      id: result.sessionId,
      email,
      result,
      createdAt: new Date().toISOString(),
    };
  } else {
    return saveSessionMock(email, result);
  }
}

export async function getSessions(email: string) {
  if (isSupabaseConfigured() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return sessions.map((s) => ({
      id: s.id,
      email: email,
      result: s.raw_ai_response as AnalysisResult,
      createdAt: s.created_at,
    }));
  } else {
    return getSessionsMock(email);
  }
}

export async function deleteSession(sessionId: string) {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('sessions').delete().eq('id', sessionId);
    if (error) throw error;
  } else {
    return deleteSessionMock(sessionId);
  }
}
