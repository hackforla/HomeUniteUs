import React from 'react';
import {NewPasswordForm} from '../components/authentication/NewPasswordForm';
import {useSearchParams} from 'react-router-dom';

export const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get('session_id');
  const user_id = searchParams.get('user_id');

  return (
    <>
      <NewPasswordForm session_id={session_id} email={user_id} />
    </>
  );
};
