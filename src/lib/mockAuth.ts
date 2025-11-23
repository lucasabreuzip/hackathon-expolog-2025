import { User, UserRole } from '@/types';

// Simple mock authentication
const MOCK_USERS = [
  {
    email: 'joao.santos@email.com',
    password: 'senha123',
    role: 'candidate' as UserRole,
    id: 'c001',
    name: 'João da Silva Santos'
  },
  {
    email: 'maria.costa@email.com',
    password: 'senha123',
    role: 'candidate' as UserRole,
    id: 'c002',
    name: 'Maria Oliveira Costa'
  },
  {
    email: 'empresa@logistica.com',
    password: 'senha123',
    role: 'company' as UserRole,
    id: 'comp001',
    name: 'Logística Porto S.A.'
  }
];

export const mockLogin = (email: string, password: string): User | null => {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const mockSignup = (
  email: string,
  password: string,
  name: string,
  role: UserRole
): User => {
  const newUser = {
    id: `${role}_${Date.now()}`,
    email,
    name,
    role
  };
  
  // In a real app, this would save to a database
  return newUser;
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};
