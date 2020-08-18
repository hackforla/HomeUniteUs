import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Container, TextField, Divider, Button } from '@material-ui/core'
import * as Yup from 'yup'
import { TextInput } from '../Registration'

interface FormValues {
  address: string
  address2?: string
  city: string
  state: string
  zipcode: number
}

const initialValues: FormValues = {
  address: '',
  address2: '',
  city: '',
  state: '',
  zipcode: 0,
}

const validationSchema = Yup.object().shape({
  address: Yup.string().min(2, 'Too Short!').required('Required'),
  address2: Yup.string(),
  city: Yup.string().min(1, 'Too Short!').required('Required'),
  state: Yup.string().min(2, 'Too Short!').required('Required'),
  zipcode: Yup.number().min(2, 'Too Short!').required('Required'),
})

const HostFormAddress: React.FC = () => {
  const handleSubmit = (values: FormValues): void => {
    alert(JSON.stringify(values))
  }
  return (
    <>
      <Container maxWidth="md">
        <h1>Please enter your Address here:</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ dirty, isValid, values }) => {
            return (
              <Form
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '33rem',
                  }}
                >
                  <label
                    style={{
                      marginBottom: '0.7rem',
                      fontSize: '18px',
                    }}
                  >
                    Street Address
                  </label>
                  <Field
                    autoComplete="off"
                    name="address"
                    variant="outlined"
                    as={TextField} //error doesnt show when using arshia mui textInput
                    style={{ marginBottom: '1.5rem' }}
                  />
                  <ErrorMessage name="address">
                    {(msg) => (
                      <div
                        style={{
                          color: 'red',
                          marginBottom: '1rem',
                        }}
                      >
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '33rem',
                  }}
                >
                  <label
                    style={{
                      marginBottom: '0.7rem',
                      fontSize: '18px',
                    }}
                  >
                    Street Address 2
                  </label>
                  <Field
                    autoComplete="off"
                    name="address2"
                    variant="outlined"
                    as={TextField}
                    style={{ marginBottom: '1.5rem' }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '33rem',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <label
                      style={{
                        marginBottom: '0.7rem',
                        fontSize: '18px',
                      }}
                    >
                      City
                    </label>
                    <Field
                      autoComplete="off"
                      name="city"
                      variant="outlined"
                      as={TextField}
                      style={{ marginBottom: '1.5rem' }}
                    />
                    <ErrorMessage name="city">
                      {(msg) => (
                        <div
                          style={{
                            color: 'red',
                            marginBottom: '1rem',
                          }}
                        >
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <label
                      style={{
                        marginBottom: '0.7rem',
                        fontSize: '18px',
                      }}
                    >
                      State
                    </label>
                    <Field
                      autoComplete="off"
                      name="state"
                      variant="outlined"
                      as={TextField}
                      style={{
                        marginBottom: '1.5rem',
                      }}
                    />
                    <ErrorMessage name="state">
                      {(msg) => (
                        <div
                          style={{
                            color: 'red',
                            marginBottom: '1rem',
                          }}
                        >
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '13rem',
                  }}
                >
                  <label
                    style={{
                      marginBottom: '0.7rem',
                      fontSize: '18px',
                    }}
                  >
                    Zip Code
                  </label>
                  <Field
                    autoComplete="off"
                    name="zipcode"
                    variant="outlined"
                    as={TextField}
                    style={{ marginBottom: '1.5rem' }}
                  />
                  <ErrorMessage name="zipcode">
                    {(msg) => (
                      <div
                        style={{
                          color: 'red',
                          marginBottom: '1rem',
                        }}
                      >
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
                <Divider
                  style={{
                    marginBottom: '1rem',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Button>
                    <p>
                      <i className="arrow left"></i>Back
                    </p>
                  </Button>

                  <Button variant="contained" color="primary">
                    Skip for Now
                  </Button>

                  <Button
                    type="submit"
                    disabled={!dirty || !isValid}
                    variant="contained"
                    color="primary"
                  >
                    Save and Continue
                  </Button>
                </div>
                <pre>{JSON.stringify(values)}</pre>
              </Form>
            )
          }}
        </Formik>
      </Container>
    </>
  )
}

export default HostFormAddress
