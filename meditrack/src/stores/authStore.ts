import { create } from 'zustand';
import type { UserProfile } from '../types';

interface ExtendedUserProfile extends UserProfile {
  fullName?: string;
  email?: string;
}

interface AuthState {
  user: ExtendedUserProfile | null;
  token: string | null;
  isGuest: boolean;
  signInUser: (user: ExtendedUserProfile, token: string) => void;
  signOutUser: () => void;
  setGuest: (status: boolean) => void;
  updateUserProfile: (updates: Partial<ExtendedUserProfile>) => void;
}

// Read initial state from localStorage for persistence on refresh
const cachedToken = localStorage.getItem('meditrack_token');
const cachedUser = localStorage.getItem('meditrack_user');
const cachedIsGuest = localStorage.getItem('meditrack_is_guest') === 'true';

export const useAuthStore = create<AuthState>((set) => ({
  user: cachedUser ? JSON.parse(cachedUser) : null,
  token: cachedToken || null,
  isGuest: cachedIsGuest,

  signInUser: (user, token) => {
    localStorage.setItem('meditrack_token', token);
    localStorage.setItem('meditrack_user', JSON.stringify(user));
    localStorage.removeItem('meditrack_is_guest');
    set({ user, token, isGuest: false });
  },

  signOutUser: () => {
    localStorage.removeItem('meditrack_token');
    localStorage.removeItem('meditrack_user');
    localStorage.removeItem('meditrack_is_guest');
    set({ user: null, token: null, isGuest: false });
  },

  setGuest: (status) => {
    if (status) {
      localStorage.setItem('meditrack_is_guest', 'true');
      localStorage.removeItem('meditrack_token');
      localStorage.removeItem('meditrack_user');
      set({ user: null, token: null, isGuest: true });
    } else {
      localStorage.removeItem('meditrack_is_guest');
      set({ isGuest: false });
    }
  },

  updateUserProfile: (updates) =>
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('meditrack_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
}));
