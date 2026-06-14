import type { AnalysisResult, UserProfile } from '../types';

interface UserAccount extends UserProfile {
  fullName: string;
  email: string;
  passwordHash: string; // Simulated simple hash
}

// Fetch all registered accounts from localStorage
const getAccounts = (): UserAccount[] => {
  const data = localStorage.getItem('meditrack_accounts');
  return data ? JSON.parse(data) : [];
};

// Save accounts to localStorage
const saveAccounts = (accounts: UserAccount[]) => {
  localStorage.setItem('meditrack_accounts', JSON.stringify(accounts));
};

// Simulated signup
export async function signUpMock(email: string, password: string, fullName: string) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const accounts = getAccounts();
  const exists = accounts.some((acc) => acc.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser: UserAccount = {
    fullName,
    email: email.toLowerCase(),
    passwordHash: password, // simple storage for mock
    age: undefined,
    sex: undefined,
    conditions: [],
  };

  accounts.push(newUser);
  saveAccounts(accounts);

  const mockToken = 'mock_jwt_' + Math.random().toString(36).substring(2);
  return {
    user: {
      fullName: newUser.fullName,
      email: newUser.email,
      age: newUser.age,
      sex: newUser.sex,
      conditions: newUser.conditions,
    },
    token: mockToken,
  };
}

// Simulated signin
export async function signInMock(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const accounts = getAccounts();
  const user = accounts.find(
    (acc) =>
      acc.email.toLowerCase() === email.toLowerCase() &&
      acc.passwordHash === password
  );

  if (!user) {
    throw new Error('Invalid email or password. Please try again.');
  }

  const mockToken = 'mock_jwt_' + Math.random().toString(36).substring(2);
  return {
    user: {
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      sex: user.sex,
      conditions: user.conditions,
    },
    token: mockToken,
  };
}

// Save profile updates
export async function updateProfileMock(email: string, updates: Partial<UserProfile>) {
  const accounts = getAccounts();
  const index = accounts.findIndex((acc) => acc.email.toLowerCase() === email.toLowerCase());

  if (index === -1) {
    throw new Error('User account not found.');
  }

  accounts[index] = {
    ...accounts[index],
    ...updates,
  };
  saveAccounts(accounts);

  return {
    fullName: accounts[index].fullName,
    email: accounts[index].email,
    age: accounts[index].age,
    sex: accounts[index].sex,
    conditions: accounts[index].conditions,
  };
}

// Session (Triage Results) Mock Tables
interface SessionRecord {
  id: string;
  email: string; // 'guest' or active user email
  result: AnalysisResult;
  createdAt: string;
}

const getSessionsFromStorage = (): SessionRecord[] => {
  const data = localStorage.getItem('meditrack_db_sessions');
  return data ? JSON.parse(data) : [];
};

const saveSessionsToStorage = (sessions: SessionRecord[]) => {
  localStorage.setItem('meditrack_db_sessions', JSON.stringify(sessions));
};

// Save a completed analysis session
export async function saveSessionMock(email: string, result: AnalysisResult) {
  const sessions = getSessionsFromStorage();
  
  const newRecord: SessionRecord = {
    id: result.sessionId,
    email: email.toLowerCase(),
    result,
    createdAt: new Date().toISOString(),
  };

  sessions.unshift(newRecord); // newest first
  saveSessionsToStorage(sessions);
  return newRecord;
}

// Retrieve saved sessions for an account
export async function getSessionsMock(email: string) {
  const sessions = getSessionsFromStorage();
  return sessions.filter((s) => s.email.toLowerCase() === email.toLowerCase());
}

// Delete session
export async function deleteSessionMock(sessionId: string) {
  const sessions = getSessionsFromStorage();
  const updated = sessions.filter((s) => s.id !== sessionId);
  saveSessionsToStorage(updated);
}
