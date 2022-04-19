import React from 'react';
import {Link} from 'react-router-dom';

export const ProtectedView = () => {
  return (
    <div>
      <h1>Protected View</h1>
      <Link to={'/private'}>Priate View</Link>
    </div>
  );
};
