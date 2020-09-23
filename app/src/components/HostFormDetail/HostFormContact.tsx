import React, { useState } from 'react'
import { useHostDashboardData } from '../../data/host-context'
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
import { Auth0User, useAuth0 } from '../../react-auth0-spa'

//this component is not yet wrapped in the HostProvider

interface HostContactDetails {
    email?: string
    phoneNumber?: string
    cellNumber?: string
}

interface FormValues {
    email: string
    phoneNumber: string
    cellNumber: string
}

const validationSchema = Yup.object()
    .shape({
        email: Yup.string()
            .email('Not a valid Email input')
            .required('Required'),
        phoneNumber: Yup.string().length(10, 'Too Short!'),
        cellNumber: Yup.string().length(10, 'Too Short!').required('Required'),
    })
    .test(
        'at least one number',
        'you must provide at least one number',
        (value) => !!(value.cellNumber || value.phoneNumber)
    )

interface HostFormContactProps {
    contactDetails: HostContactDetails
    onSubmitComplete?: () => void
}

const HostFormContact: React.FC<HostFormContactProps> = (
    props: HostFormContactProps
) => {
    const { putContactInfo } = useHostDashboardData()
    const { user } = useAuth0()

    const [contactOrder, setContactOrder] = useState([
        'Email',
        'SMS',
        'Phone Call',
    ])

    const initialValues: FormValues = {
        email: props.contactDetails.email || '',
        phoneNumber: props.contactDetails.phoneNumber || '',
        cellNumber: props.contactDetails.cellNumber || '',
    }

    const handleSubmit = async (values: FormValues) => {
        const payload = { ...values, email: (user as Auth0User).email }
        // alert(JSON.stringify(payload))
        try {
            await putContactInfo(payload)
            if (props.onSubmitComplete) {
                props.onSubmitComplete()
            }
        } catch (e) {
            console.log(`Error posting ${e}`)
        }
    }

    return (
        <>
            <Container maxWidth="md">
                <Typography variant="h5">
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
                                        width: '44.6vw',
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    <Button>
                                        <span
                                            style={{
                                                padding:
                                                    '0.4rem 1.3rem 0.4rem 1.3rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ArrowBackIosIcon /> Back
                                        </span>
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ margin: '0 3rem 0 7rem' }}
                                    >
                                        <span
                                            style={{
                                                padding:
                                                    '0.4rem 1.3rem 0.4rem 1.3rem',
                                            }}
                                        >
                                            Skip for Now
                                        </span>
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={!dirty || !isValid}
                                        variant="contained"
                                        color="primary"
                                    >
                                        <span
                                            style={{
                                                padding:
                                                    '0.4rem 1.3rem 0.4rem 1.3rem',
                                            }}
                                        >
                                            Save and Continue
                                        </span>
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

export default HostFormContact
