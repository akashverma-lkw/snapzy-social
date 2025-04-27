import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const ProtectedRoute = ({ children }) => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });

  if (isLoading) {
    return null; // Or show spinner if you want
  }

  // If user not authenticated, redirect to "/"
  if (!authUser) {
    return <Navigate to="/" />;
  }

  // Else, show the protected page
  return children;
};

export default ProtectedRoute;
