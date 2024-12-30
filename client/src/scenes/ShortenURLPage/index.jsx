import React, { useState, useEffect } from 'react';
import { shortenUrl, getUserUrls, getUserName } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShortenURLPage.css';

const ShortenURL = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [userUrls, setUserUrls] = useState([]);
  const [userName, setUserName] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortenedUrl('');

    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }

    try {
      const data = await shortenUrl(url);
      setShortenedUrl(data.short);
      fetchUserUrls();
    } catch (err) {
      console.error('Error while shortening the URL:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
    }
  };

  const fetchUserUrls = async () => {
    try {
      const data = await getUserUrls();
      setUserUrls(data);
    } catch (err) {
      console.error('Error while retrieving user URL:', err);
    }
  };

  const fetchUserName = async () => {
    try {
      const user = await getUserName();
      setUserName(user.full_name);
      setUsername(user.username);
    } catch (err) {
      console.error('Failed to retrieve user name:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchUserName();
    fetchUserUrls();
  }, []);

  const handleViewAll = () => {
    navigate('/all-urls');
  };

  return (
    <div className="shorten-url-container">
      <nav className="navigate">
        <div className="logo">URL Shortener</div>
        <div className="langandexit">
          <div className="language-switch">
            {userName ? `Welcome, ${userName}` : `Welcome, ${username}`}
          </div>
          <div onClick={handleLogout} className="exit-button">
            <b>EXIT</b>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="shorten-box">
          <h1>
            Create your short <span>link</span>
          </h1>
          <form onSubmit={handleSubmit} className="shorten-form">
            <input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`shorten-input ${error ? 'input-error' : ''}`}
            />
            <button type="submit" className="shorten-button">
              SHORTEN
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
          {shortenedUrl && (
            <div className="success-message">
              Your short link:{' '}
              <a
                href={`http://localhost:8000/${shortenedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenedUrl}
              </a>
            </div>
          )}
          <p className="info-text">
            URL shortening is a tool that makes your content look professional.
          </p>
        </div>

        <div className="user-urls">
          <h2>Your short links:</h2>
          {userUrls.length > 0 ? (
            <ul>
              {userUrls.slice(0, 3).map((url, index) => (
                <li key={index}>
                  <p>
                    <strong>Short link:</strong>{' '}
                    <a
                      href={`http://localhost:8000/${url.short}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url.short}
                    </a>
                  </p>
                  <button
                    className="view-short-redirects-button"
                    onClick={() => navigate(`/link/${url.short}`)}
                  >
                    Statistics
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>You don't have any short links yet</p>
          )}
          {userUrls.length > 0 && (
            <button className="toggle-button" onClick={handleViewAll}>
              Show all...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortenURL;
