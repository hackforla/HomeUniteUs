import React from 'react'
import { useHostDashboardData } from '../../data/host-context'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import {
    Container,
    TextField,
    Divider,
    Button,
    Typography,
} from '@material-ui/core'
import * as Yup from 'yup'
import { TextInput } from '../Registration'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useAuth0, Auth0User } from '../../react-auth0-spa'

export interface HostInfoDetails {
    firstName?: string
    middleName?: string
    lastName?: string
    dateofBirth?: Date
}

export interface HostInfoFormValues {
    firstName: string
    middleName?: string
    lastName: string
    dateofBirth: Date
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

interface HostFormInfoProps {
    infoDetails: HostInfoDetails
    onSubmitComplete?: (values: HostInfoDetails) => void
}

const HostFormInfo: React.FC<HostFormInfoProps> = (
    props: HostFormInfoProps
) => {
    const { putPersonalInfo } = useHostDashboardData()
    const { user } = useAuth0()

    const initialValues: HostInfoFormValues = {
        firstName: props.infoDetails.firstName || '',
        middleName: props.infoDetails.middleName || '',
        lastName: props.infoDetails.lastName || '',
        dateofBirth: props.infoDetails.dateofBirth || new Date(),
    }

    const handleSubmit = async (values: HostInfoFormValues) => {
        const payload = { ...values, email: (user as Auth0User).email }
        // alert(JSON.stringify(payload))

        try {
            await putPersonalInfo(payload)
            if (props.onSubmitComplete) {
                props.onSubmitComplete(payload)
            }
        } catch (e) {
            console.log(`Error posting ${e}`)
        }
    }
    return (
        <>
            <Container maxWidth="md">
                <Typography variant="h5">
                    Please enter your Name and Date of Birth:
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
                                        width: '33rem',
                                        marginBottom: '5rem',
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
                                        width: '44.6vw',
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    <Button style={{ color: '#55B1EB' }}>
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
                                        style={{
                                            margin: '0 3rem 0 7rem',
                                            background: '#55B1EB',
                                            color: '#fff',
                                        }}
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
                                        // color="primary"
                                        style={{
                                            background: '#55B1EB',
                                            color: '#fff',
                                        }}
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

export default HostFormInfo
