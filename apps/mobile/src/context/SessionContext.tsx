import { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';

type SessionContextType = {
  session: Session | null;
  userId: string | undefined;
  email: string | undefined;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  userId: undefined,
  email: undefined,
});

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const value = {
    session,
    userId: session?.user?.id,
    email: session?.user?.email,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
