import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// component to protect routes that require authentication
const PrivateRoute = () => {
  const { authUser } = useContext(AuthContext);
  const location = useLocation();
  return authUser ? <Outlet /> : <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
};

export default PrivateRoute;