import {Formik} from 'formik';
import React from 'react';
import {Outlet} from 'react-router-dom';
import {object, string, ref} from 'yup';

export interface ResestPasswordValues {
  email: string;
  code: string;
  password: string;
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
};

export const ResetPasswordContext = () => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        console.log(values);
      }}
      validationSchema={validationSchema}
    >
      <Outlet />
    </Formik>
  );
};
