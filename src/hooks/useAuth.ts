import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Simple user storage in localStorage (for demo purposes)
const USERS_STORAGE_KEY = 'tap_n_take_users';

// Clear all users on initialization (for demo reset)
if (typeof window !== 'undefined') {
  localStorage.removeItem(USERS_STORAGE_KEY);
  localStorage.removeItem('tap_n_take_auth');
}

const getStoredUsers = (): Array<{ email: string; password: string; name: string; id: string }> => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUser = (name: string, email: string, password: string, id: string) => {
  const users = getStoredUsers();
  users.push({ name, email, password, id });
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const AUTH_STORAGE_KEY = 'tap_n_take_auth';

// Load auth from localStorage
const loadAuth = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user,
        isAuthenticated: parsed.isAuthenticated && !!parsed.user,
      };
    }
  } catch (error) {
    console.error('Error loading auth:', error);
  }
  return { user: null, isAuthenticated: false };
};

// Save auth to localStorage
const saveAuth = (user: User | null, isAuthenticated: boolean) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, isAuthenticated }));
  } catch (error) {
    console.error('Error saving auth:', error);
  }
};

export const useAuth = create<AuthStore>((set) => {
  // Initialize state safely
  let initialState = { user: null, isAuthenticated: false };
  try {
    if (typeof window !== 'undefined') {
      initialState = loadAuth();
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }

  return {
    user: initialState.user,
    isAuthenticated: initialState.isAuthenticated,

  login: async (email: string, password: string) => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = { id: user.id, name: user.name, email: user.email };
      set({
        user: userData,
        isAuthenticated: true,
      });
      saveAuth(userData, true);
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  },

  register: async (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Generate user ID
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save user
    saveUser(name, email, password, id);
    
    // Auto login after registration
    const userData = { id, name, email };
    set({
      user: userData,
      isAuthenticated: true,
    });
    saveAuth(userData, true);
    
    return { success: true };
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
    saveAuth(null, false);
  },
  };
});

