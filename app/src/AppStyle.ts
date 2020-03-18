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

export { ToolBarTitle, Image, Holder, FlexHolder, FlexGrowHolder }
