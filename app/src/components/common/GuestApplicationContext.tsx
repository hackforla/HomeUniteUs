import {Formik} from 'formik';
import {Outlet} from 'react-router-dom';

export const initialValues = {
  null: '',
};

export const GuestApplicationContext = () => {
  return (
    <Formik initialValues={initialValues} onSubmit={() => console.log('hello')}>
      <Outlet />
    </Formik>
  );
};
