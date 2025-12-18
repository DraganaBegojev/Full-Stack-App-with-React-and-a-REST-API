// Sign-in screen component
// Allows existing users to authenticate using email and password

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const UserSignIn = () => {
// State for controlled form inputs
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
// State for handling validation errors
  const [errors, setErrors] = useState([]);

  // Access signIn function from AuthContext
  const { signIn } = useContext(AuthContext);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Attempt to sign in the user
    const user = await signIn({ emailAddress, password });

    // If successful, redirect to home; otherwise, show error
    if (user) {
      navigate('/');
    } else {
      setErrors(['Sign-in was unsuccessful']);
    }
  };

  return (
    <main>
      <div className="form--centered">
        <h2>Sign In</h2>
        {errors.length > 0 && (
          <div className="validation--errors">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" type="submit">
            Sign In
          </button>

          <Link className="button button-secondary" to="/">
            Cancel
          </Link>
        </form>

        <p>
          Don't have a user account? Click here to{' '}
          <Link to="/signup">sign up</Link>!
        </p>
      </div>
    </main>
  );
};

export default UserSignIn;
