import styled from "styled-components"

const ToolBarTitle = styled.h2`
  color: inherit;
  text-align: center;
  flex: 1;
`

const Image = styled.img`
  height: 60px;
`

const Holder = styled.div`
  padding: 8px;

  > *{
  color: #1f1f1f;
  padding: 18px 8px 35px 8px;
  font-size: 0.875rem;
  min-width: 64px;
  box-sizing: border-box;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 500;
  /* line-height: 2.5; */
  border-radius: 4px;
  letter-spacing: 0.02857em;
  text-decoration: none;
  }

  :nth-child(n+2):nth-child(-n+4){
    height: 3em;

     :hover {
       background-color: #eee;
     }
}
`

const FlexHolder = styled(Holder)`
  margin: 8px;
  display: flex;
`

const FlexGrowHolder = styled(Holder)`
  flex-grow: 1;
`

const AuthHolder = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width: 100%;
  min-height: 40em;
`

export { ToolBarTitle, Image, Holder, FlexHolder, FlexGrowHolder, AuthHolder }
