import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Container, TextField, Divider, Button } from '@material-ui/core'
import * as Yup from 'yup'
import { TextInput } from '../Registration'

interface FormValues {
    firstName: string
    middleName?: string
    lastName: string
    dateofBirth: Date
}

const initialValues: FormValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateofBirth: new Date(),
}

const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').required('Required'),
    middleName: Yup.string(),
    lastName: Yup.string().min(2, 'Too Short!').required('Required'),
    // dateofBirth: Yup.number().required("Required").positive().integer(),
    dateofBirth: Yup.date()
        .required('Required')
        .max(new Date(), 'Birth cannot be in the future'),
})

const HostFormDetails: React.FC = () => {
    const handleSubmit = (values: FormValues): void => {
        alert(JSON.stringify(values))
    }
    return (
        <>
            <Container maxWidth="md">
                <h1>Please enter your Name and Date of Birth:</h1>
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
                                    // alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        // alignItems: 'center',
                                        width: '33rem',
                                    }}
                                >
                                    <label
                                        style={{
                                            marginBottom: '0.7rem',
                                            fontSize: '18px',
                                        }}
                                    >
                                        First Name
                                    </label>
                                    <Field
                                        autoComplete="off"
                                        name="firstName"
                                        variant="outlined"
                                        as={TextField} //error doesnt show when using arshia mui textInput
                                        style={{ marginBottom: '1.5rem' }}
                                    />
                                    <ErrorMessage name="firstName">
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
                                        // alignItems: 'center',
                                        width: '33rem',
                                    }}
                                >
                                    <label
                                        style={{
                                            marginBottom: '0.7rem',
                                            fontSize: '18px',
                                        }}
                                    >
                                        Middle Name
                                    </label>
                                    <Field
                                        autoComplete="off"
                                        name="middleName"
                                        variant="outlined"
                                        as={TextField}
                                        style={{ marginBottom: '1.5rem' }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        // alignItems: 'center',
                                        width: '33rem',
                                    }}
                                >
                                    <label
                                        style={{
                                            marginBottom: '0.7rem',
                                            fontSize: '18px',
                                        }}
                                    >
                                        Last Name
                                    </label>
                                    <Field
                                        autoComplete="off"
                                        name="lastName"
                                        variant="outlined"
                                        as={TextField}
                                        style={{ marginBottom: '1.5rem' }}
                                    />
                                    <ErrorMessage name="lastName">
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
                                        // alignItems: 'center',
                                        width: '33rem',
                                    }}
                                >
                                    <label
                                        style={{
                                            marginBottom: '0.7rem',
                                            fontSize: '18px',
                                        }}
                                    >
                                        MM/DD/YYYY
                                    </label>
                                    <Field
                                        autoComplete="off"
                                        name="dateofBirth"
                                        variant="outlined"
                                        as={TextField}
                                        style={{ marginBottom: '1.5rem' }}
                                    />
                                    <ErrorMessage name="dateofBirth">
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
                            </Form>
                        )
                    }}
                </Formik>
            </Container>
        </>
    )
}

export default HostFormDetails
