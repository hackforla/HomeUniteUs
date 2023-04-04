import {Formik} from 'formik';
import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {object, string, ref} from 'yup';
import {useNewPasswordMutation} from '../../services/auth';

export interface NewPasswordValues {
  password: string;
  confirmPassword: string;
}

const validationSchema = object({
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
});

const initialValues = {
  password: '',
  confirmPassword: '',
};

export const NewPasswordContext = () => {
  const navigate = useNavigate();
  const [newPassword] = useNewPasswordMutation(); // fixedCacheKey?

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async values => {
        try {
          await newPassword(values).unwrap();
          navigate('/signin');
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
