import styled from "styled-components"

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

const X = styled.span`
  color: black;
  font-size: 2em;
  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
  background-color: white;
  text-align: center;
  transform: scale(0.8, 0.8);
  cursor: default;
`

export const ModalsStyle = {
  Modal: Modal,
  TextHolder: TextHolder,
  ImageBorder: ImageBorder,
  ModalsText: ModalsText,
  X: X
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
  AboutHolder: AboutHolder,
  AboutTitle: AboutTitle,
  AboutText: AboutText,
  MailLink: MailLink,
  TextBlock: TextBlock
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

const DemoHeader = styled.div`
  padding: 16px;
  text-align: center;
  color: #757575;
  background-color: #fff;
  border-radius: 4px;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`

const SpacedHeader = styled(DemoHeader)`
  margin: 30px 0 0 0;
`

export const DemoStyle = {
  DemoHolder: DemoHolder,
  MainHolder: MainHolder,
  ImageHolder: ImageHolder,
  ImageTitle: ImageTitle,
  DemoImage: DemoImage,
  WrapHolder: WrapHolder,
  DemoHeader: DemoHeader,
  SpacedHeader: SpacedHeader
}
