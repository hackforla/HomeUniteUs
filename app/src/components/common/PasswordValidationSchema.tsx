import {object, string} from 'yup';

export const validationSchema = object().shape({
  email: string().email('Invalid email').required('email is required'),
  password: string()
    .required('password is required')
    .min(8, 'password must be at least 8 characters')
    .matches(/^(?=.*[0-9])/, 'password must contain at least one number')
    .matches(/^(?=.*[a-z])/, 'Must contain at least one lowercase character')
    .matches(/^(?=.*[A-Z])/, 'Must contain at least one uppercase character')
    .matches(
      /^(?=.*[!@#%&])/,
      'password must contain at least one special character',
    ),
});

// formik requires errors object with keys from yup, but yup only returns ValidationError with
// no way of managing schema

const pwValidate = password =>
  validationSchema.fields.password
    .validate(password, {abortEarly: false})
    .catch(({errors}) => {
      // errors is array of strings
      return Promise.resolve({errors});
    });

export default pwValidate;
