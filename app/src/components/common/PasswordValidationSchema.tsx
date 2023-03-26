import {object, string} from 'yup';

export const passwordValidationSchema = object().shape({
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

console.log('passwordValidationSchema', passwordValidationSchema);
// formik requires errors object with keys from yup, but yup only returns ValidationError with
// no way of managing schema
// create new errors array and check for validation there -> must abortEarly: false but
// cannot manage without resolver

const pwValidate = password =>
  passwordValidationSchema.fields.password
    .validate(password, {abortEarly: false})
    .catch(({errors}) => {
      const validationErrors = errors.reduce((acc, error) => {
        const [key, value] = Object.entries(error)[0];
        acc[key] = value;
        return acc;
      }, {});
      return Promise.resolve({errors: validationErrors});
    });

export default pwValidate;
