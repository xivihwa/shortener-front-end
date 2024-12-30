import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClicksChart from '../../components/ClicksChart';
import '../../styles/LinkClicksPage.css';

const LinkClicksPage = () => {
  const { short } = useParams();
  const navigate = useNavigate();

  return (
    <section className="page-chart">
      <header className="navigate">
        <div className="logo">URL Shortener</div>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </header>
      <div className="graph">
        <h1>
          Click chart for the link:{' '}
          <a
            href={`http://localhost:8000/${short}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {short}
          </a>
        </h1>
        <ClicksChart short={short} />
      </div>
    </section>
  );
};

export default LinkClicksPage;
