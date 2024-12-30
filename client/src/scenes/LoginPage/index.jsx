import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import '../../styles/LoginAndRegisterPages.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setUsernameError(!username);
    setPasswordError(!password);

    if (!username || !password) {
      return;
    }

    loginUser(username, password, setError, navigate);
  };

  return (
    <div className="login-container">
      <div className="box">
        <h2>Authorization</h2>
        <form onSubmit={handleLogin} className="form-group">
          <div className="form-group">
            <label htmlFor="username">Login</label>
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? 'error' : ''}
              placeholder={passwordError ? 'The Password field cannot be empty' : ''}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Log in</button>
        </form>
        <p className="plogin">
          Don't have an account?{' '}
          <Link to="/register" className="plink">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
