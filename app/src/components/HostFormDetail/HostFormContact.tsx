import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import {
    Container,
    TextField,
    Divider,
    Button,
    Paper,
    Typography,
} from '@material-ui/core'
import * as Yup from 'yup'
import SortableComponent from './SortableComponent'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import TextInput from '../Registration/TextInput/TextInput'
import Btn from '../Registration/Button/Button'

interface FormValues {
    email: string
    phoneNumber: number
    cellNumber: number
}

const initialValues: FormValues = {
    email: '',
    phoneNumber: NaN,
    cellNumber: NaN,
}

const validationSchema = Yup.object()
    .shape({
        email: Yup.string()
            .email('Not a valid Email input')
            .required('Required'),
        phoneNumber: Yup.number().min(10, 'Too Short!'),
        cellNumber: Yup.number().min(10, 'Too Short!').required('Required'),
    })
    .test(
        'at least one number',
        'you must provide at least one number',
        (value) => !!(value.cellNumber || value.phoneNumber)
    )

const HostFormAddress: React.FC = () => {
    const [contactOrder, setContactOrder] = useState([
        'Email',
        'SMS',
        'Phone Call',
    ])

    const handleSubmit = (values: FormValues): void => {
        alert(JSON.stringify(values))
    }
    return (
        <>
            <Container maxWidth="md">
                <Typography variant="h4">
                    Please provide your Contact Information:
                </Typography>
                <br />
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
                                        Email Address
                                    </label>
                                    <Field
                                        autoComplete="off"
                                        name="email"
                                        variant="outlined"
                                        as={TextField}
                                        // as={TextInput} //error doesnt show when using arshia mui textInput
                                        style={{ marginBottom: '1.5rem' }}
                                    />
                                    <ErrorMessage name="email">
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
                                        Home Phone Number
                                    </label>
                                    <Field
                                        autoComplete="off"
                                        name="phoneNumber"
                                        variant="outlined"
                                        as={TextField}
                                        style={{ marginBottom: '1.5rem' }}
                                    />
                                    <ErrorMessage name="phoneNumber">
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
                                        Cell Phone Number
                                    </label>
                                    <Field
                                        autoComplete="off"
                                        name="cellNumber"
                                        variant="outlined"
                                        as={TextField}
                                        style={{ marginBottom: '1.5rem' }}
                                    />
                                    <ErrorMessage name="cellNumber">
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
                                        width: '17.6rem',
                                    }}
                                >
                                    <Typography variant="h6">
                                        Reorder best forms of Contact
                                    </Typography>
                                    <SortableComponent />
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
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    <Button style={{ verticalAlign: 'middle' }}>
                                        <ArrowBackIosIcon /> Back
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

export default HostFormAddress
