import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => (
  localStorage.getItem('token') ? <Navigate to="/shorten" /> : children
);

export default PublicRoute;