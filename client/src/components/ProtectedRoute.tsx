import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

interface Props {
  children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }: Props) => {
  const { user } = useUserAuth();

  console.log("Check user in Private: ", user);
  if (!user) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;