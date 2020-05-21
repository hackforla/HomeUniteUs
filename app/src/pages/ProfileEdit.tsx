import * as React from "react"
import QuestionPage from "../components/ProfileEdit/QuestionPage"

import styled from "styled-components"

const Container = styled.div`
  margin: 30px auto;
  padding: 0 15px;
  max-width: 1140px;
`

export const ProfileEditPage = () => {
  return(
    <Container>
      <h2>Hello! Answer these questions:</h2>
      <QuestionPage></QuestionPage>
    </Container>
  )
}
