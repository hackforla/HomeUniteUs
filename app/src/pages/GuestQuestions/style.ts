import styled from 'styled-components'

export const Body = styled.div`
  min-height: 86.5vh;
  padding: 0;
  margin: 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
` 

export const Container = styled.div`
  width: 65.03125rem;
`

export const Header = styled.div`
  text-align: left;
  margin-left: 3.5rem;
  margin-top: 5rem;
  margin-bottom: 4rem;
  height: 28px
`

export const FormContainer = styled.div`
  width: 65.03125rem;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`

export const FormControl = styled.div`
  margin-bottom: 3rem;
`

export const Label = styled.label`
  display: flex;
  margin-bottom: 5px;
  font-size: 20px;
  font-family: brandon-grotesque, sans-serif;
  font-weight: 5;
  line-height: 25px;
`

export const Error = styled.div`
  color: red;
`

export const BtnContainer = styled.div`
  width: 90px;
  height: 35px;
  padding: .6em .7em;
  margin: 0 3rem;
`

export const Btn = styled.button`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: #02afeb;
  font-family: brandon-grotesque, sans-serif;
  font-weight: 700;
  color: #fff;
  min-height: 34px;
  text-transform: uppercase;
  text-align: center;
  background: #02afeb;
  border: none;
  font-size: 12px;
  &:hover {
    background: #c6c6c6;
  }
`