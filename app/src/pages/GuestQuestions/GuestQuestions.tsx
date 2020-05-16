import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Body, Container, Header, FormContainer, Error, Label, FormControl } from './style'
import * as Yup from 'yup'

interface MyFormValues {
  firstName: string;
  lastName: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
})

const onSubmit = (values: MyFormValues) => {
  console.log(values, "<----on submit")
}

function GuestQuestions() {
  const initialValues: MyFormValues = { firstName: '', lastName: '' };
  return (
    <Body>
      <Container>
        <Header>
          <h1>Contact Information.</h1>
        </Header>
        <FormContainer>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <FormControl>
                <Label htmlFor='firstName'>First Name</Label>
                <Field type='text' id='firstName' name='firstName' />
                <ErrorMessage
                  name="firstName">
                  {(msg) => (
                    <Error>{msg}</Error>
                  )}
                </ErrorMessage>
              </FormControl>

              <FormControl>
                <Label htmlFor='lastName'>Last Name</Label>
                <Field type='text' id='lastName' name='lastName' />
                <ErrorMessage
                  name="lastName">
                  {(msg) => (
                    <Error>{msg}</Error>
                  )}
                </ErrorMessage>
              </FormControl>

              <button type="submit">Submit</button>
            </Form>
          </Formik>
        </FormContainer>
      </Container>
    </Body>
  )
}

export default GuestQuestions
