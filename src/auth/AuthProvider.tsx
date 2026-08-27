import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "../lib/supabase";

import type { Session } from "@supabase/supabase-js";


/* =========================================================
   AUTH CONTEXT TYPE
========================================================= */

interface AuthContextType {
  session: Session | null;

  loading: boolean;
}


/* =========================================================
   AUTH CONTEXT
========================================================= */

export const AuthContext =
  createContext<AuthContextType>({
    session: null,

    loading: true,
  });


/* =========================================================
   AUTH PROVIDER
========================================================= */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    session,
    setSession,
  ] =
    useState<Session | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  /* =======================================================
     LOAD / WATCH SESSION
  ======================================================= */

  useEffect(() => {

    async function loadSession() {

      const {
        data: {
          session,
        },
      } =
        await supabase.auth.getSession();


      setSession(
        session
      );


      setLoading(
        false
      );

    }


    void loadSession();


    /* =====================================================
       AUTH STATE LISTENER
    ===================================================== */

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          session
        ) => {

          setSession(
            session
          );

        }
      );


    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {

      subscription.unsubscribe();

    };

  }, []);


  /* =======================================================
     PROVIDER
  ======================================================= */

  return (

    <AuthContext.Provider
      value={{
        session,

        loading,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


/* =========================================================
   USE AUTH
========================================================= */

export function useAuth() {

  return useContext(
    AuthContext
  );

}