import React from 'react';
import {Link} from 'react-router-dom';

export const PrivateView = () => {
  return (
    <div>
      <h1>Private View</h1>
      <button>sign out</button>
      <Link to={'/protected'}>Protected View</Link>
    </div>
  );
};
