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
