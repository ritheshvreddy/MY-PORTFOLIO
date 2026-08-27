import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    session,
    loading,
  } = useAuth();

  if (loading)
    return <div>Loading...</div>;

  if (!session)
    return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}