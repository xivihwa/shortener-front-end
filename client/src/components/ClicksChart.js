import React, { useState, useEffect, useCallback } from 'react';
import { fetchLinkRedirects } from '../services/authService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ClicksChart = ({ short }) => {
  const [clicksData, setClicksData] = useState([]);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState('day');

  const groupByInterval = (data, interval) => {
    const formatDate = (date) => {
      const d = new Date(date);
      switch (interval) {
        case 'day':
          return d.toISOString().split('T')[0];
        case 'hour':
          return `${d.toISOString().split('T')[0]} ${String(d.getHours()).padStart(2, '0')}:00`;
        case 'minute':
          return `${d.toISOString().split('T')[0]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        default:
          return date;
      }
    };

    return Object.entries(
      data.reduce((acc, timestamp) => {
        const formattedDate = formatDate(timestamp);
        acc[formattedDate] = (acc[formattedDate] || 0) + 1;
        return acc;
      }, {})
    ).map(([timestamp, count]) => ({ timestamp, count }));
  };

  const handleChangeInterval = (newInterval) => setInterval(newInterval);

  const loadClicksData = useCallback(async () => {
    try {
      const data = await fetchLinkRedirects(short);
      if (Array.isArray(data)) {
        setClicksData(groupByInterval(data, interval));
      } else {
        setError('The click data should be in the form of an array');
      }
    } catch (err) {
      setError('Error while loading clicks');
      console.error('Error while loading clicks:', err);
    }
  }, [short, interval]);

  useEffect(() => {
    loadClicksData();
  }, [loadClicksData]);

  if (error) {
    return <div>{error}</div>;
  }

  const tickFormatter = (tick) => {
    const date = new Date(tick);
    switch (interval) {
      case 'day':
        return date.toISOString().split('T')[0];
      case 'hour':
        return `${String(date.getHours()).padStart(2, '0')}:00`;
      case 'minute':
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      default:
        return tick;
    }
  };

  return (
    <div>
      {clicksData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={clicksData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={tickFormatter} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#ec7263" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div>No data available to build the chart</div>
      )}
      <div style={buttonContainerStyle}>
        {['day', 'hour', 'minute'].map((item) => (
          <button
            key={item}
            onClick={() => handleChangeInterval(item)}
            style={buttonStyle}
          >
            {item === 'day' && 'By days'}
            {item === 'hour' && 'By hours'}
            {item === 'minute' && 'By minutes'}
          </button>
        ))}
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '0 10px',
  fontSize: '16px',
  cursor: 'pointer',
  border: '1px solid #ddd',
  borderRadius: '5px',
  backgroundColor: '#ec7263',
  color: '#fff',
  transition: 'background-color 0.3s',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
};

export default ClicksChart;
