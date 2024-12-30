import React, { useState, useEffect } from 'react';
import { getUserUrls } from '../../services/authService';
import '../../styles/AllUrlPage.css';
import { useNavigate } from 'react-router-dom';

const AllUrlsPage = () => {
  const [userUrls, setUserUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserUrls = async () => {
    try {
      const data = await getUserUrls();
      setUserUrls(data);
    } catch (err) {
      console.error('Error when retrieving user URL:', err);
      setError('Failed to load links. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDateString) => {
    return new Date(isoDateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchUserUrls();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="all-urls-container">
      <header className="navigate">
        <div className="logo">URL Shortener</div>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </header>
      <h1 className="h1-allurl">All shortened links</h1>
      {userUrls.length > 0 ? (
        <ul className="urls-list">
          {userUrls.map((url, index) => (
            <li key={index} className="url-item">
              <p>
                <strong>Shortened link:</strong>{' '}
                <a
                  href={`http://localhost:8000/${url.short}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.short}
                </a>
              </p>
              <p>
                <strong>Creation date:</strong> {formatDate(url.created_at)}
              </p>
              <p>
                <strong>Number of clicks:</strong> {url.redirects}
              </p>
              <div className="button-view">
                <button
                  className="view-redirects-button"
                  onClick={() => navigate(`/link/${url.short}`)}
                >
                  View click chart
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any shortened links yet.</p>
      )}
    </div>
  );
};

export default AllUrlsPage;
