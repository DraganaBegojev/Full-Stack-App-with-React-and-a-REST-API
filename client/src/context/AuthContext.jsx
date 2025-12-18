import { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  const signIn = async (credentials) => {
    const encodedCredentials = btoa(
      `${credentials.emailAddress}:${credentials.password}`
    );

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      });

      if (response.status === 200) {
        const user = await response.json();
        setAuthUser({ ...user, credentials });
        return user;
      } else if (response.status === 401) {
        return null;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = () => {
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
