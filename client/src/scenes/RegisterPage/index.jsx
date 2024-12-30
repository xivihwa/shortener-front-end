import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleRegister } from '../../services/authService';
import '../../styles/LoginAndRegisterPages.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    const hasUsername = Boolean(username);
    const hasPassword = Boolean(password);
    const hasFullName = Boolean(fullName);

    setUsernameError(!hasUsername);
    setPasswordError(!hasPassword || (password.length < 8));
    setFullNameError(!hasFullName);

    if (!hasUsername || !hasPassword || !hasFullName) {
      return false;
    }

    if (password.length < 8) {
      setError('The password must be at least 8 characters long.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateInputs()) {
      handleRegister(username, password, fullName, setError, navigate);
    }
  };

  return (
    <div className="register-container">
      <div className="box">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Registration</h2>

          <div className="form-group">
            <label htmlFor="username">Login:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={usernameError ? 'error' : ''}
              placeholder={usernameError ? 'The Login field cannot be empty' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? 'error' : ''}
              placeholder={
                passwordError
                  ? 'The Password field cannot be empty or the password is too short'
                  : ''
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full name:</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={fullNameError ? 'error' : ''}
              placeholder={fullNameError ? 'The Full Name field cannot be empty.' : ''}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Sign up</button>
        </form>

        <p className="plogin">
          Already have an account?{' '}
          <Link to="/login" className="plink">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
