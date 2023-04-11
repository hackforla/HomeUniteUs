import {object, string} from 'yup';

// export const validationSchema = object().shape({
//   email: string().email('Invalid email').required('email is required'),
//   password: string()
//     .required('password is required')
//     .min(8, 'password must be at least 8 characters')
//     .matches(/^(?=.*[0-9])/, 'password must contain at least one number')
//     .matches(/^(?=.*[a-z])/, 'Must contain at least one lowercase character')
//     .matches(/^(?=.*[A-Z])/, 'Must contain at least one uppercase character')
//     .matches(
//       /^(?=.*[!@#%&])/,
//       'password must contain at least one special character',
//     ),
// });
export const validationSchema = object().shape({
  email: string().email('Invalid email').required('email is required'),
  password: string()
    .min(8, {length: 'password must be at least 8 characters'})
    .matches(/^(?=.*[0-9])/, {
      message: {number: 'password must contain at least one number'},
    })
    .matches(/^(?=.*[a-z])/, {
      message: {lowercase: 'Must contain at least one lowercase character'},
    })
    .matches(/^(?=.*[A-Z])/, {
      message: {uppercase: 'Must contain at least one uppercase character'},
    })
    .matches(/^(?=.*[!@#%&])/, {
      message: {
        special: 'password must contain at least one special character',
      },
    })
    .required({required: 'password is required'}),
});

// formik requires errors object with keys from yup, but yup only returns ValidationError with
// no way of managing schema

// const pwValidate = password =>
//   validationSchema.fields.password
//     .validate(password, {abortEarly: false})
//     .catch(({errors}) => {
//       // errors is array of strings
//       return Promise.resolve({errors});
//     });
const pwValidate = password =>
  validationSchema.fields.password
    .validate(password, {abortEarly: false})
    .catch(({errors}) => {
      // errors is array of strings
      const validationErrors = errors.reduce((acc, error) => {
        const [key, value] = Object.entries(error)[0];
        acc[key] = value;
        return acc;
      }, {});
      return Promise.resolve({errors: validationErrors});
    });

export default pwValidate;
