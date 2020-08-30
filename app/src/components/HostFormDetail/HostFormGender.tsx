import React, { useState, CSSProperties } from 'react'
import { useHostDashboardData } from '../../data/host-context'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import {
    Container,
    TextField,
    Divider,
    Button,
    Typography,
    Checkbox,
} from '@material-ui/core'
import * as Yup from 'yup'
import SortableComponent from './SortableComponent'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

interface FormValues {
    woman: boolean
    man: boolean
    transMan: boolean
    transWoman: boolean
    nonBinary: boolean
    notToIdentify: boolean
    describe: boolean
    describeTextField: string
}

const initialValues: FormValues = {
    woman: false,
    man: false,
    transMan: false,
    transWoman: false,
    nonBinary: false,
    notToIdentify: false,
    describe: false,
    describeTextField: '',
}

const validationSchema = Yup.object()
    .shape({
        woman: Yup.boolean(),
        man: Yup.boolean(),
        transMan: Yup.boolean(),
        transWoman: Yup.boolean(),
        nonBinary: Yup.boolean(),
        notToIdentify: Yup.boolean(),
        describe: Yup.boolean(),
        describeTextField: Yup.string(),
    })
    .test(
        'Must pick at lease one field',
        'Or complete Description',
        (value) =>
            !!(
                value.woman ||
                value.man ||
                value.transMan ||
                value.transWoman ||
                value.nonBinary ||
                value.notToIdentify ||
                value.describe
            )
    )

const fieldContainerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '18px',
}

const HostFormGender: React.FC = () => {
    const { putGenderInfo } = useHostDashboardData()
    const handleSubmit = async (values: FormValues) => {
        alert(JSON.stringify(values))

        try {
            await putGenderInfo(values)
        } catch (e) {
            console.log(`Error posting ${e}`)
        }
    }
    return (
        <>
            <Container maxWidth="md">
                <Typography variant="h5">
                    What gender(s) do you most Identify with?
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
                                <div style={fieldContainerStyles}>
                                    <Field
                                        autoComplete="off"
                                        name="woman"
                                        variant="outlined"
                                        as={Checkbox}
                                    />
                                    <label>Woman</label>
                                </div>
                                <div style={fieldContainerStyles}>
                                    <Field
                                        autoComplete="off"
                                        name="man"
                                        variant="outlined"
                                        as={Checkbox}
                                    />
                                    <label>Man</label>
                                </div>
                                <div style={fieldContainerStyles}>
                                    <Field
                                        autoComplete="off"
                                        name="transMan"
                                        variant="outlined"
                                        as={Checkbox}
                                    />
                                    <label>Trans Man</label>
                                </div>
                                <div style={fieldContainerStyles}>
                                    <Field
                                        autoComplete="off"
                                        name="transWoman"
                                        variant="outlined"
                                        as={Checkbox}
                                    />
                                    <label>Trans Woman</label>
                                </div>
                                <div style={fieldContainerStyles}>
                                    <Field
                                        autoComplete="off"
                                        name="nonBinary"
                                        variant="outlined"
                                        as={Checkbox}
                                    />
                                    <label>Non Binary</label>
                                </div>
                                <div style={fieldContainerStyles}>
                                    <Field
                                        autoComplete="off"
                                        name="notToIdentify"
                                        variant="outlined"
                                        as={Checkbox}
                                    />
                                    <label>Prefer not to Identify</label>
                                </div>
                                <div style={fieldContainerStyles}>
                                    <Field
                                        autoComplete="off"
                                        name="describe"
                                        variant="outlined"
                                        as={Checkbox}
                                    />
                                    <label>Describe your Gender</label>
                                </div>
                                {/* need to fix this later */}
                                <div
                                    style={{
                                        marginBottom: '1.5rem',
                                        marginLeft: '2.5rem',
                                    }}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="describeTextField"
                                        variant="outlined"
                                        as={TextField}
                                        disabled={
                                            values.describe ? false : true
                                        }
                                        value={
                                            values.describe
                                                ? values.describeTextField
                                                : (values.describeTextField =
                                                      '')
                                        }
                                    />
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

export default HostFormGender
