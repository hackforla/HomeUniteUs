import {object, string} from 'yup';

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
    .matches(/\W|_/, {
      message: {
        // add specificity into message
        special: 'password must contain at least one special character',
      },
    })
    .required({required: 'password is required'}),
});

export const signUpVaildationSchema = object().shape({
  firstName: string().required('first name is required'),
  lastName: string().required('first name is required'),
  ...validationSchema.fields,
});

// formik requires errors object with keys from yup

interface ValidationErrors {
  [key: string]: string;
}

const pwValidate = (password: string) =>
  validationSchema.fields.password
    .validate(password, {abortEarly: false})
    .catch(({errors}) => {
      const validationErrors = errors.reduce(
        (acc: ValidationErrors, error: string) => {
          const [key, value] = Object.entries(error)[0];
          acc[key] = value;
          return acc;
        },
        {},
      );
      return Promise.resolve({errors: validationErrors});
    });

export default pwValidate;
