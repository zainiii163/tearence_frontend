import React, { createContext, useContext, useState } from 'react';

// Create a simple auth context for now
const AuthContext = createContext();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // For now, return a simple auth context
  // This can be expanded later with actual authentication logic
  return {
    user,
    setUser,
    loading,
    setLoading
  };
};

export { AuthContext };
