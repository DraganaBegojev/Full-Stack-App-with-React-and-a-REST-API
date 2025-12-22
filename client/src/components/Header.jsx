import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


const Header = () => {
  const { authUser, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <header>
      <div className="wrap header--flex">
        <h1 className="header--logo">
          <a href="/">Courses</a>
        </h1>
        <nav>
          {authUser ? (
            <ul className="header--signedin">
              <li>Welcome, {authUser.firstName} {authUser.lastName}!</li>
              <li>
                <button onClick={handleSignOut}>Sign Out</button>
              </li>
            </ul>
          ) : (
          <ul className="header--signedout">
            <li>
              <a href="/sign-up">Sign Up</a>
            </li>
            <li>
              <a href="/sign-in">Sign In</a>
            </li>
          </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

