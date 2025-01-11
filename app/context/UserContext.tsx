  'use client';

  import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

  interface UserData {
    user_id: string;
    user_name: string;
    user_num: number;
    user_email: string;
    user_prodi: number;
    user_job: string;
  }

  interface UserContextProps {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
    isLoading: boolean;
  }

  const UserContext = createContext<UserContextProps | undefined>(undefined);

  export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setInternalUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/user');
          const data = await response.json();
          setInternalUser(data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
          setInternalUser(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }, []);

    const setUser = async (newUser: UserData | null) => {
      setInternalUser(newUser);
    };

    return (
      <UserContext.Provider value={{ user, setUser, isLoading }}>
        {children}
      </UserContext.Provider>
    );
  }

  export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  }