import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
  const { authUser } = useContext(AuthContext);
  return authUser ? <Outlet /> : <Navigate to="/sign-in" replace/>;
};

export default PrivateRoute;