import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Container, TextField } from '@material-ui/core'
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
                <h1>Please enter Name and Date of Birth:</h1>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {({ dirty, isValid }) => {
                        return (
                            <Form>
                                <div>
                                    <label>First Name</label>
                                    <Field
                                        autoComplete="off"
                                        name="firstName"
                                        as={TextInput}
                                    />
                                    <ErrorMessage name="firstName" />
                                </div>
                                <div>
                                    <label>Middle Name</label>
                                    <Field
                                        autoComplete="off"
                                        name="middleName"
                                        as={TextInput}
                                    />
                                    <ErrorMessage name="middleName" />
                                </div>
                                <div>
                                    <label>Last Name</label>
                                    <Field
                                        autoComplete="off"
                                        name="lastName"
                                        as={TextInput}
                                    />
                                    <ErrorMessage name="lastName" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!dirty || !isValid}
                                >
                                    Submit
                                </button>
                            </Form>
                        )
                    }}
                </Formik>
            </Container>
        </>
    )
}

export default HostFormDetails
