import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
  UserCredential,
  User,updateProfile
} from "firebase/auth";
import { auth } from "../firebase";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserAuthContextProps {
  user: User | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName:string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  googleSignIn: () => Promise<UserCredential>;
}

const userAuthContext = createContext<UserAuthContextProps>({
  user: null,
  logIn: () => Promise.reject(),
  signUp: () => Promise.reject(),
  logOut: () => Promise.reject(),
  googleSignIn: () => Promise.reject(),
});

export function UserAuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function logIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  function signUp(email: string, password: string, displayName: string) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return updateProfile(user, { displayName: displayName }).then(() => {
            return userCredential;
          });
        }
        return userCredential;
      });
  }
  
  function logOut() {
    return signOut(auth);
  }
  
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    
    return <LoadingSpinner />;
  }
  

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}