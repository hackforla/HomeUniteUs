import React from 'react';
import {setCredentials} from '../../../app/authSlice';
import {isFetchBaseQueryError, isErrorWithMessage} from '../../../app/helpers';
import {useGetTokenMutation} from '../../../services/auth';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch} from '../../../app/hooks/store';

// TODO: Maybe store this in a more global location? with routes?
export const redirectsByRole = {
  Guest: '/guest',
  Host: '/host',
  Coordinator: '/coordinator',
  Admin: '/coordinator',
};

interface UseAuthenticateWithOAuth {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  callbackUri: string;
}

export const useAuthenticateWithOAuth = ({
  setErrorMessage,
  callbackUri,
}: UseAuthenticateWithOAuth) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getToken, {isLoading: getTokenIsLoading}] = useGetTokenMutation();

  React.useEffect(() => {
    if (location.search.includes('code')) {
      const code = location.search.split('?code=')[1];
      getToken({
        code,
        callbackUri,
      })
        .unwrap()
        .then(response => {
          const {token, user} = response;
          dispatch(setCredentials({user, token}));
          navigate(redirectsByRole[user.role.name]);
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
  }, [location, setErrorMessage, getToken, dispatch, navigate, callbackUri]);

  return {getTokenIsLoading};
};
