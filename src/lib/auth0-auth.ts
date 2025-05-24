
import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthState, User, UserRole } from '@/types';

interface Auth0Store extends AuthState {
  initializeAuth: () => void;
  loginWithRedirect: (connection?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

// Helper function to map Auth0 user to our User type
const mapAuth0UserToUser = (auth0User: any): User => {
  // Extract role from user metadata or app_metadata
  const role: UserRole = auth0User['https://nextera.com/role'] || 
                         auth0User.app_metadata?.role || 
                         'employee';
  
  return {
    id: auth0User.sub,
    email: auth0User.email,
    firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
    lastName: auth0User.family_name || auth0User.name?.split(' ')[1] || '',
    role,
    department: auth0User['https://nextera.com/department'] || auth0User.app_metadata?.department,
    skills: auth0User['https://nextera.com/skills'] || auth0User.app_metadata?.skills || [],
    phoneNumber: auth0User['https://nextera.com/phone'] || auth0User.app_metadata?.phone,
    emergencyContact: auth0User['https://nextera.com/emergency_contact'] || auth0User.app_metadata?.emergency_contact,
    isActive: true,
    createdAt: auth0User.created_at || new Date().toISOString(),
    updatedAt: auth0User.updated_at || new Date().toISOString(),
    lastLogin: auth0User.last_login,
    availability: auth0User['https://nextera.com/availability'] || auth0User.app_metadata?.availability || []
  };
};

export const useAuth0Store = create<Auth0Store>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      initializeAuth: () => {
        // This will be called from a component that has access to Auth0 context
      },

      loginWithRedirect: async (connection?: string) => {
        // This will be handled by Auth0 directly
        throw new Error('Use Auth0 loginWithRedirect directly');
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      setUser: (user: User) => {
        set({ 
          user, 
          isAuthenticated: true 
        });
      },

      updateProfile: async (profileData: Partial<User>) => {
        // This would need to be implemented with Auth0 Management API
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...profileData } 
          });
        }
      },
    }),
    {
      name: 'auth0-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Custom hook to bridge Auth0 with our store
export const useAuth0Bridge = () => {
  const { 
    user: auth0User, 
    isAuthenticated: auth0IsAuthenticated, 
    isLoading: auth0IsLoading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0Logout
  } = useAuth0();
  
  const { user, isAuthenticated, setUser, logout: storeLogout } = useAuth0Store();

  // Sync Auth0 state with our store
  React.useEffect(() => {
    if (auth0IsAuthenticated && auth0User && !isAuthenticated) {
      const mappedUser = mapAuth0UserToUser(auth0User);
      setUser(mappedUser);
    } else if (!auth0IsAuthenticated && isAuthenticated) {
      storeLogout();
    }
  }, [auth0IsAuthenticated, auth0User, isAuthenticated, setUser, storeLogout]);

  const handleLogout = () => {
    storeLogout();
    auth0Logout({ 
      logoutParams: { returnTo: window.location.origin } 
    });
  };

  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2'
      }
    });
  };

  const handleMicrosoftLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'windowslive'
      }
    });
  };

  const handleEmailLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'Username-Password-Authentication'
      }
    });
  };

  return {
    user,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: handleLogout,
    googleLogin: handleGoogleLogin,
    microsoftLogin: handleMicrosoftLogin,
    emailLogin: handleEmailLogin
  };
};
