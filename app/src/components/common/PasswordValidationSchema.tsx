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
// create new errors array and check for validation there -> must abortEarly: false but
// cannot manage without resolver

const pwValidate = password =>
  validationSchema.fields.password
    .validate(password, {abortEarly: false})
    .catch(({errors}) => {
      const validationErrors = errors;
      return Promise.resolve({errors: validationErrors});
    });

export default pwValidate;

// ROADMAP:
// 1. user types in password
// 2. as user types in password, password validation is going on
// -> password validation is checking by whether it exists in the mapped out errors
// array or not.
// So there are two components: one password validation with the server
// and one password validation check off in the "must contain"
//right now, password validtion IS working on server side
// what I need to do is: 1. have total validation errors in array
// if the value in the current password matches the "must contain", it receives a check
//
