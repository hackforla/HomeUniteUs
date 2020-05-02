import * as React from "react"
import { AboutStyle } from "./style"
import styled from "styled-components"
const Org = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 100px;
  margin: 15px;
`

export const Register = () => (
  <AboutStyle.AboutHolder>
    <AboutStyle.AboutText>
      List of organizations from the database
      <Org>
        <a href="/register/org1/host">Org 1 Host</a>
        <a href="/register/org1/guest">Org 1 Guest</a>
      </Org>
      <Org>
        <a href="/register/org2/host">Org 2 Host</a>
        <a href="/register/org2/guest">Org 2 Guest</a>
      </Org>
    </AboutStyle.AboutText>
  </AboutStyle.AboutHolder>
)
