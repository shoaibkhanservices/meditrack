import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, CheckCircle, Save } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { updateProfile } from '../../services/supabaseService';
import { preExistingConditions } from '../../constants/symptoms';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isGuest, signOutUser, updateUserProfile } = useAuthStore();

  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [sex, setSex] = useState(user?.sex || '');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    user?.conditions || []
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync state if store user changes
  useEffect(() => {
    if (user) {
      setAge(user.age ? String(user.age) : '');
      setSex(user.sex || '');
      setSelectedConditions(user.conditions || []);
    }
  }, [user]);

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const numericAge = age ? Number(age) : undefined;
    const profileUpdates = {
      age: numericAge,
      sex: sex as any,
      conditions: selectedConditions,
    };

    try {
      if (!isGuest && user?.email) {
        // Persist to database
        await updateProfile(user.email, profileUpdates);
      }
      // Update Zustand store (which also caches in localStorage)
      updateUserProfile(profileUpdates);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      signOutUser();
      navigate('/auth', { replace: true });
    }
  };

  return (
    <div className="profile-screen">
      {/* Top Header */}
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <span className="profile-subtitle">Personalize your medical details</span>
      </div>

      <div className="profile-container">
        <form className="profile-form" onSubmit={handleSave}>
          {/* Success toast */}
          {saveSuccess && (
            <div className="profile-toast">
              <CheckCircle size={16} />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Account Card */}
          <div className="profile-card profile-card--account">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <div className="profile-account-info">
              {isGuest ? (
                <>
                  <h3>Guest User</h3>
                  <p>Assessments are stored locally on this device.</p>
                  <button
                    type="button"
                    className="profile-upgrade-btn"
                    onClick={() => {
                      signOutUser();
                      navigate('/register');
                    }}
                  >
                    Create Account to Sync Data
                  </button>
                </>
              ) : (
                <>
                  <h3>{user?.fullName || 'User Name'}</h3>
                  <p>{user?.email || 'email@example.com'}</p>
                </>
              )}
            </div>
          </div>

          {/* Demographics Card */}
          <div className="profile-card">
            <h3 className="profile-card-title">Demographics</h3>
            
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-age">Age</label>
              <input
                id="profile-age"
                type="number"
                className="profile-input"
                placeholder="e.g. 28"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Sex</label>
              <div className="profile-radio-group">
                {([
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                ] as const).map((opt) => (
                  <label
                    key={opt.value}
                    className={`profile-radio ${sex === opt.value ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="sex"
                      value={opt.value}
                      checked={sex === opt.value}
                      onChange={() => setSex(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pre-existing Conditions */}
          <div className="profile-card">
            <h3 className="profile-card-title">Pre-existing Conditions</h3>
            <p className="profile-card-desc">
              Checking these will help our health assistant tailor diagnostic confidence levels.
            </p>
            <div className="profile-conditions-grid">
              {preExistingConditions.map((cond) => {
                const isChecked = selectedConditions.includes(cond);
                return (
                  <div
                    key={cond}
                    className={`profile-condition-checkbox ${isChecked ? 'active' : ''}`}
                    onClick={() => handleConditionToggle(cond)}
                  >
                    <div className="profile-checkbox-box">
                      {isChecked && <div className="profile-checkbox-inner" />}
                    </div>
                    <span>{cond}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="btn-primary profile-save-btn"
            disabled={saving}
          >
            <Save size={18} />
            <span>{saving ? 'Saving changes...' : 'Save Profile Details'}</span>
          </button>

          {/* Sign Out Action */}
          <button
            type="button"
            className="profile-signout-btn"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
