import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Organization } from '../types';
import { mockDbService } from '../services/mockDbService';

interface SignupData {
  email: string;
  password_input: string;
  firstName: string;
  middleName: string;
  lastName: string;
  // For joining an existing org
  role?: UserRole;
  orgCode?: string;
  // For creating a new org
  orgName?: string;
  orgWebsite?: string;
  orgMobile?: string;
  orgAddress?: string;
  orgCountry?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_input: string) => boolean;
  signup: (data: SignupData) => { user: User | null, error?: string };
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem('gestures_quiz_userId');
      if (storedUserId) {
        const currentUser = mockDbService.getUserById(storedUserId);
        if (currentUser) {
            setUser(currentUser);
        }
      }
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = (email: string, password_input: string): boolean => {
    const foundUser = mockDbService.verifyUser(email, password_input);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('gestures_quiz_userId', foundUser.id);
      return true;
    }
    return false;
  };

  const signup = (data: SignupData): { user: User | null, error?: string } => {
    const { email, password_input, firstName, middleName, lastName, role, orgCode, orgName, orgWebsite, orgMobile, orgAddress, orgCountry } = data;
    
    if (mockDbService.getUserByEmail(email)) {
      return { user: null, error: 'A user with this email already exists.' };
    }

    let newUser: User;

    if (orgCode) { // Joining an existing organization
      const org = mockDbService.getOrganizationByCode(orgCode);
      if (!org) {
        return { user: null, error: 'Invalid or unapproved Organization Code.' };
      }
      if (!role) {
         return { user: null, error: 'A role must be selected.' };
      }
      newUser = mockDbService.createUser({
        email, role, firstName, middleName, lastName, organizationId: org.id,
        classIds: role === UserRole.STUDENT ? [] : undefined,
        points: role === UserRole.STUDENT ? 0 : undefined,
        lastActivity: role !== UserRole.STUDENT ? Date.now() : undefined,
      }, password_input);

    } else if (orgName && orgWebsite && orgMobile && orgAddress && orgCountry) { // Creating a new organization
      const org = mockDbService.createOrganization({
          name: orgName, website: orgWebsite, mobile: orgMobile, address: orgAddress, country: orgCountry
      });
      newUser = mockDbService.createUser({
        email, role: UserRole.ADMIN, firstName, middleName, lastName, organizationId: org.id,
        lastActivity: Date.now(),
      }, password_input);
    } else {
      return { user: null, error: 'Organization details are missing.' };
    }

    setUser(newUser);
    localStorage.setItem('gestures_quiz_userId', newUser.id);
    return { user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gestures_quiz_userId');
  };

  const value = { user, isLoading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
