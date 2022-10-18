import React from 'react';
import {useGetHostsQuery} from '../services/host';

export const HostsList = () => {
  const {data} = useGetHostsQuery();

  return (
    <div>
      <h2>Hosts</h2>
      <ul>
        {data?.map(host => (
          <li key={host.id}>{host.name}</li>
        ))}
      </ul>
    </div>
  );
};
