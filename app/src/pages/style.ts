import styled from "styled-components"
import { ProgressPlugin } from "webpack"

const Modal = styled.section`
  width: 100vw;
  height: 100vh;
  background-color: #000000b1;
  backdrop-filter: blur(3px);
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const TextHolder = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1100px;
`

const ImageBorder = styled.img`
  border: 1px solid #757575;
`

const ModalsText = styled.span`
  color: white;
  font-size: 2em;
`

const X = styled.div`
  color: black;
  font-size: 2em;
  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
  background-color: white;
  text-align: center;
  transform: scale(0.8, 0.8);
  cursor: default;

  span {
    position: relative;
    top: .35em;
  }
`

export const ModalsStyle = {
  Modal,
  TextHolder,
  ImageBorder,
  ModalsText,
  X
}

const AboutHolder = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  @media (min-width: 1280px) {
    div {
      max-width: 1280px;
    }
  }

  @media (min-width: 960px) {
    div {
      padding: 0 32px;
    }
  }

  @media (min-width: 600px) {
    div {
      padding: 0 24px;
    }
  }
`

const AboutTitle = styled.h2`
  text-align: center;
  margin: 0 0 0.35em 0;
  font-size: 3.75rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.008em;
`

const AboutText = styled.p`
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  line-height: 1.5;
  letter-spacing: 0.009em;
`

const MailLink = styled.a`
  color: black;
  margin: 0 0 0 0.5em;
`

const TextBlock = styled.div`
  padding: 16px;
  background-color: #eee;
  border-radius: 4px;
  color: #1f1f1f;
`

export const AboutStyle = {
  AboutHolder,
  AboutTitle,
  AboutText,
  MailLink,
  TextBlock,
}

const DemoHolder = styled.div`
  margin: 0 auto;
  max-width: 1210px;
`

const MainHolder = styled(DemoHolder)`
  max-width: 1280px;
`

const ImageHolder = styled.div`
  margin: 0 0 65px 0;
  width: 50%;
`

const ImageTitle = styled.div`
  font-size: 16pt;
  color: #757575;
  text-align: left;
`

const DemoImage = styled.img`
  border: 1px solid #757575;
`

const WrapHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const NoWrapHolder = styled.div`
  display: flex;
`

const MainHeader = styled.div`
  padding: 16px;
  text-align: center;
  color: #757575;
  background-color: #fff;
  border-radius: 4px;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`

const MainTitle = styled.h1`
  font-size: 2em;
  text-align:center;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  margin: 0;
  color: #757575;
`

const SpacedHeader = styled(MainHeader)`
  margin: 30px 0 0 0;
`
const DemoProfileHolders = styled.div`
    margin: 30px 0px 0px;
    flex-grow: 0;
    max-width: 100%;
    flex-basis: 100%;
    box-sizing: border-box;
`

const BigProfileHolder = styled(DemoProfileHolders)`
    margin: 50px 0px 0px;
`

const Button = styled.a`
  color: white;
  background-color: #00AAEF;
  padding: 8px;
  font-size: 0.875rem;
  min-width: 64px;
  box-sizing: border-box;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 500;
  line-height: 1.75;
  border-radius: 4px;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`

const DemoName = styled.span`
  color: #757575;
  text-decoration: none;
  text-align:left;
  font-size: 1rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  letter-spacing: 0.00938em;
`

const HeaderRow = styled.div`
  display: flex; 
  justify-content: space-between;
  margin: 0 0 -.25em 0;
  width: 93%;
  align-items:center;
`

const WiderHeaderRow = styled(HeaderRow)`
  width: 95%;
  margin: 0 0 1em 0;
`

const SecondHeader = styled.h3`
  color: #757575;
  font-weight: bold;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`

const InfoPaper = styled.div`
    border: 1px solid #ADADAD;
    padding: 24px;
    text-align: center;
    box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
    border-radius: 4px;
`

export const DemoStyle = {
  DemoHolder,
  MainHolder,
  ImageHolder,
  ImageTitle,
  DemoImage,
  WrapHolder,
  MainHeader,
  MainTitle,
  SpacedHeader,
  Button,
  DemoName,
  DemoProfileHolders,
  SecondHeader,
  HeaderRow,
  WiderHeaderRow,
  InfoPaper,
  BigProfileHolder,
}

const HostMatchClick = styled.div`
  font-weight: bold; 

  :hover {
    color: dimgrey;
    cursor: pointer;
  }
`

const AdminHolder = styled.div`
  margin: 0 auto;
  max-width: 1210px;
`

const AdminLink = styled.a`
  color: #757575;
  text-decoration: none;
  text-align: left;
  font-size: 1rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  flex: 1;
`

const AdminText = styled.p`
  font-size: 1rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  text-align: left;
  flex: 1;
`

const AdminMatchHolders = styled.div`
  margin: 30px 0px 0px;
  flex-grow: 0;
  max-width: 100%;
  flex-basis: 100%;
  box-sizing: border-box;
`

export const AdminStyle = {
  MainHeader,
  AdminLink,
  AdminText,
  MainTitle,
  AdminMatchHolders,
  AdminHolder,
  Button,
  InfoPaper,
  HeaderRow,
  MainHolder,
  SecondHeader,
  WiderHeaderRow
}

const Table = styled.div`
  min-width: 650
`

const TableHeaderRow = styled.div`
  display: flex; 
  justify-content: space-between;
  margin: 0;
  width: 100%;
  align-items:center;
  background-color: #00AAEF;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
`
const TableHeaderLabel = styled.div`
  display: flex;
  color: #757575;
  font-weight: bold;
  justify-content: space-between;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
  text-align: ${(prop: { center: boolean }) => prop.center ? 'center' : 'left'};
  display: table-cell;
  padding: .85em;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  letter-spacing: 0.01071em;
  vertical-align: inherit;
  flex: 1;
`

const TableRow = styled.div`
  display: flex; 
  justify-content: space-between;
  margin: 0 0 0 0;
  width: 95%;
  align-items:center;
  width: 100%;
  margin: '0';
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  background-color: ${(prop: { rowNumber: string }) => prop.rowNumber === 'even' ? '#F5F5F5' : '#FFFFFF'}
`

const TableCell = styled.div`
  display: table-cell;
  padding: 1em;
  font-size: 0.875rem;
  text-align: left;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  color: rgba(0,0,0,0.87);
  line-height: 1.43;
  letter-spacing: 0.01071em;
  vertical-align: inherit;
  flex: 1;
`
const TableName = styled.h2`
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0,0,0,0.54);
  margin: 0 0 .25em 0;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`

const AdminGuestMainHolder = styled(DemoHolder)`
  max-width: 1380px;
`

const AdminGuestHolders = styled.div`
  margin: 30px 0px 0px;
  flex-grow: 0;
  max-width: 100%;
  flex-basis: 100%;
  box-sizing: border-box;
`

const AdminGuestPaper = styled(InfoPaper)`
  border: .05px solid #ADADAD;
  margin: 0 10px 0 10px;

`
export const AdminGuestStyle = {
  HostMatchClick,
  MainHeader,
  MainTitle,
  AdminGuestMainHolder,
  NoWrapHolder,
  AdminGuestHolders,
  AdminGuestPaper,
  AdminHolder,
  Table,
  TableHeaderLabel,
  TableName,
  TableRow,
  TableCell,
  TableHeaderRow,
}

const Holder = styled.main`
    height:65vh;
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
`
const Message = styled.section`
    width: max(400px,70vw);
    min-height: 350px;
    border: 1px solid #595959;
    color: #595959;
    display:grid;
    grid-template-columns: 5% max-content;
    grid-template-rows: 20% max-content auto max-content 20%;
    grid-template-areas: ". ."
                         ". pageNotFound"
                         ". ."
                         ". report"
                         ". ."
                         ;
`
const PageNotFound = styled.div`
    grid-area: pageNotFound;
    font-size: min(60px,8vw);
    p {
        margin: 0;
    }
`

const Report = styled.div`
    grid-area:report;
    width: max(400px,70vw);
    font-size: min(27px,5vw);
    display:flex;
    flex-wrap:wrap;

    span {
        margin: 0;
    }
`

export const FourOhFourStyle = {
  Holder,
  Message,
  PageNotFound,
  Report
}