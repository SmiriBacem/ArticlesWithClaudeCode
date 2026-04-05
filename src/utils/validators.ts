export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, error: 'Email is required' };
  if (!emailRegex.test(email)) return { valid: false, error: 'Invalid email format' };
  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 6) return { valid: false, error: 'Password must be at least 6 characters' };
  return { valid: true };
};

export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username) return { valid: false, error: 'Username is required' };
  if (username.length < 3) return { valid: false, error: 'Username must be at least 3 characters' };
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  return { valid: true };
};

export const validateComment = (content: string): { valid: boolean; error?: string } => {
  if (!content) return { valid: false, error: 'Comment cannot be empty' };
  if (content.trim().length < 2) return { valid: false, error: 'Comment must be at least 2 characters' };
  if (content.length > 5000) return { valid: false, error: 'Comment cannot exceed 5000 characters' };
  return { valid: true };
};

export const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    'temp-mail.org',
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
  ];
  const domain = email.split('@')[1];
  return disposableDomains.includes(domain?.toLowerCase() || '');
};
