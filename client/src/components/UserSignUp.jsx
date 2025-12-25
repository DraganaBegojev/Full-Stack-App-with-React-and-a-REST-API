import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ValidationErrors from '../components/ValidationErrors';

// component to handle user sign-up
const UserSignUp = () => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error handling state
  const [errors, setErrors] = useState([]);

  // Access signIn method from context
  const { signIn } = useContext(AuthContext);

  // Used for redirecting after successful sign up
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side password check
    if (password !== confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }

    // New user object sent to the API
    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    try {
      // Send POST request to create a new user
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.status === 201) {
        // Automatically sign in the user after successful registration
        await signIn({ emailAddress, password });

        // Redirect to the home page
        navigate('/');
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else { 
        throw new Error(); 
      }
    } catch {
      // Handle unexpected errors
      setErrors(['Something went wrong. Please try again.']);
    }
  };

  // Handle cancel button
  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <main>
      <div className="form--centered">
        <h2>Sign Up</h2>

        <ValidationErrors errors={errors} />

        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

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

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="button" type="submit">
            Sign Up
          </button>

          <button
            className="button button-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>

        <p>
          Already have a user account?{' '}
          <Link to="/sign-in">Click here to sign in</Link>!
        </p>
      </div>
    </main>
  );
};

export default UserSignUp;
