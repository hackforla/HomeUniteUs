import {Formik} from 'formik';
import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {object, string, ref} from 'yup';
import {useConfirmForgotPasswordMutation} from '../../services/auth';

export interface ResestPasswordValues {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = object({
  email: string().email().required('email is required'),
  password: string()
    .required('password is required')
    .min(8, 'password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])/,
      'password must contain at least one lowercase character',
    )
    .matches(/^(?=.*[0-9])/, 'password must contain at least one number')
    .matches(
      /^(?=.*[A-Z])/,
      'password must contain at least one uppercase character',
    )
    .matches(
      /^(?=.*[!@#%&])/,
      'password must contain at least one special character',
    ),
  confirmPassword: string()
    .required('confirm password is required')
    .oneOf([ref('password'), null], 'passwords must match'),
  code: string()
    .required('code is required')
    .length(6, 'code must be 6 digits'),
});

const initialValues = {
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
};

export const ResetPasswordContext = () => {
  const navigate = useNavigate();
  const [resetPassword] = useConfirmForgotPasswordMutation({
    fixedCacheKey: 'reset-password-post',
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async values => {
        try {
          await resetPassword(values).unwrap();
          navigate('/forgot-password/success');
        } catch (err) {
          console.log({err});
        }
      }}
      validationSchema={validationSchema}
    >
      <Outlet />
    </Formik>
  );
};
