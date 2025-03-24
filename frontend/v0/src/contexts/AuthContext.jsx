import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  const login = (credentials) => {
    // Mock login - in a real app, this would call an API
    const mockUsers = {
      'admin@example.com': { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      'teacher@example.com': { id: 2, name: 'Teacher User', email: 'teacher@example.com', role: 'teacher' },
      'student@example.com': { id: 3, name: 'Student User', email: 'student@example.com', role: 'student' },
    };
    
    const user = mockUsers[credentials.email];
    if (user && credentials.password === 'password') {
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return Promise.resolve(user);
    }
    
    return Promise.reject(new Error('Invalid credentials'));
  };
  
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}
