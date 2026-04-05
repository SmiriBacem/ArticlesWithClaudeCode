import { User, UserRole } from '../types/User';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators';

const USERS_STORAGE_KEY = 'comment_system_users';
const TOKEN_STORAGE_KEY = 'comment_system_token';

// Demo users
const DEMO_USERS: User[] = [
  {
    id: 'user-1',
    email: 'user@example.com',
    username: 'john_doe',
    displayName: 'John Doe',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    username: 'admin_user',
    displayName: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: 'moderator-1',
    email: 'moderator@example.com',
    username: 'moderator_user',
    displayName: 'Moderator User',
    role: 'moderator',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderator',
  },
];

interface StoredUser extends User {
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  user?: User;
  error?: string;
}

const generateId = (): string => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getStoredUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with demo users (no passwords stored directly in demo)
  const usersWithPasswords: StoredUser[] = DEMO_USERS.map((user) => ({
    ...user,
    password: 'password123',
  }));
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersWithPasswords));
  return usersWithPasswords;
};

const saveUsers = (users: StoredUser[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const authService = {
  register: (email: string, password: string, username: string): RegisterResponse => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return { success: false, error: usernameValidation.error };
    }

    const users = getStoredUsers();

    // Check if email or username already exists
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    if (users.find((u) => u.username === username)) {
      return { success: false, error: 'Username already taken' };
    }

    const newUser: StoredUser = {
      id: generateId(),
      email,
      username,
      displayName: username,
      role: 'user' as UserRole,
      status: 'active',
      createdAt: new Date(),
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  },

  login: (email: string, password: string): LoginResponse => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { success: false, error: 'Invalid credentials' };
    }

    const users = getStoredUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (user.status === 'banned') {
      return { success: false, error: 'This account has been banned' };
    }

    // Create token
    const token = {
      userId: user.id,
      email: user.email,
      role: user.role,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;

    try {
      const parsed = JSON.parse(token);
      if (parsed.expiresAt < Date.now()) {
        authService.logout();
        return null;
      }

      const users = getStoredUsers();
      const user = users.find((u) => u.id === parsed.userId);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    } catch {
      authService.logout();
    }

    return null;
  },

  getUserById: (userId: string): User | null => {
    const users = getStoredUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },
};
