import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const cookie = Cookies.get('authenticatedUser');
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);
  const signIn = async (credentials) => {
    const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);

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
        Cookies.set('authenticatedUser', JSON.stringify({ ...user, credentials }), { expires: 1 });
        return user;
      } 
      if (response.status === 401) {
        return null;
      } 

      if (response.status === 500) {
      navigate('/error');
      return null;
      }

      throw new Error();
    } catch (error) {
      console.error(error);
      navigate('/error'); 
      return null;
    }
  };

  const signOut = () => {
    setAuthUser(null);
    Cookies.remove('authenticatedUser');
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
