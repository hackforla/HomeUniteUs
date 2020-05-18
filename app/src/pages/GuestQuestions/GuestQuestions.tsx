import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Body, Container, Header, FormContainer, Error, Label, FormControl, BtnContainer, Btn } from './style'
import './style.css';
import * as Yup from 'yup'

interface MyFormValues {
  firstName: string;
  lastName: string;
  email: string;
  number: string
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("wrong dawg").required("Rired"),
  number: Yup.string().required("Required"),
})

const onSubmit = (values: MyFormValues) => {
  console.log(values, "<----on submit")
}

function GuestQuestions() {
  const initialValues: MyFormValues = { firstName: '', lastName: '', email: '', number: '' };
  return (
    <Body>
      <Container>
        <Header>
          <h2>Contact Information.</h2>
          <p>Add your contact Information to get you started!</p>
        </Header>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <FormContainer>
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

              <FormControl>
                <Label htmlFor='email'>Email</Label>
                <Field type='text' id='email' name='email' />
                <ErrorMessage
                  name="email">
                  {(msg) => (
                    <Error>{msg}</Error>
                  )}
                </ErrorMessage>
              </FormControl>

              <FormControl>
                <Label htmlFor='number'>Phone Number</Label>
                <Field type='text' id='number' name='number' />
                <ErrorMessage
                  name="number">
                  {(msg) => (
                    <Error>{msg}</Error>
                  )}
                </ErrorMessage>
              </FormControl>

            </FormContainer>
            <BtnContainer>
              <Btn type="submit">Submit</Btn>
            </BtnContainer>
          </Form>
        </Formik>
      </Container>
    </Body>
  )
}

export default GuestQuestions
