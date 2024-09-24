import React from 'react';
import {setCredentials} from '../../../app/authSlice';
import {isFetchBaseQueryError, isErrorWithMessage} from '../../../app/helpers';
import {TokenRequest, TokenResponse} from '../../../services/auth';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch} from '../../../app/hooks/store';
import {
  MutationActionCreatorResult,
  MutationDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

// TODO: Maybe store this in a more global location? with routes?
export const redirectsByRole = {
  guest: '/guest',
  host: '/host',
  coordinator: '/coordinator',
  admin: '/coordinator',
};

interface UseAuthenticateWithOAuth {
  query: (
    arg: TokenRequest,
  ) => MutationActionCreatorResult<
    MutationDefinition<
      TokenRequest,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      'Hosts',
      TokenResponse,
      'api'
    >
  >;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  callbackUri: string;
}

export const useAuthenticateWithOAuth = ({
  query,
  setErrorMessage,
  callbackUri,
}: UseAuthenticateWithOAuth) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (location.search.includes('code')) {
      const code = location.search.split('?code=')[1];
      query({
        code,
        callbackUri,
      })
        .unwrap()
        .then(response => {
          const {token, user} = response;
          dispatch(setCredentials({user, token}));
          navigate(redirectsByRole[user.role.type]);
        })
        .catch(err => {
          if (isFetchBaseQueryError(err)) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = err.data.message;
            setErrorMessage(errMsg);
          } else if (isErrorWithMessage(err)) {
            // you can access a string 'message' property here
            setErrorMessage(err.message);
          }
        });
    }
  }, [location, setErrorMessage, dispatch, navigate, callbackUri, query]);
};
