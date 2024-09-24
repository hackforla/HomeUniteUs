import {
  Stack,
  InputLabel,
  OutlinedInput,
  Button,
  Container,
} from '@mui/material';
import React from 'react';
import {useGetHostsQuery, useCreateHostMutation} from '../services/host';

export const HostsList = () => {
  const [name, setName] = React.useState('');

  const {data} = useGetHostsQuery();
  const [createPost, {isLoading}] = useCreateHostMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    if (name === '') return;

    createPost({body: {name}});
  };

  return (
    <Container>
      <h2>Create a host</h2>
      <Stack alignItems="start" spacing={1}>
        <InputLabel htmlFor="name">Full name</InputLabel>
        <OutlinedInput
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          type="submit"
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </Button>
      </Stack>
      <h2>Hosts</h2>
      <ul>{data?.map(host => <li key={host.id}>{host.name}</li>)}</ul>
    </Container>
  );
};
