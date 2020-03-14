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
    align-items: center   
`

const TextHolder = styled.div`
    display: flex;
    justify-content: space-between;
    width: 1100px
`

const ImageBorder = styled.img`
border: 1px solid #757575  
`

const ModalsText = styled.span`
    color: white;
    font-size: 2em
`

const X = styled.span`
    color: black;
    font-size: 2em;
    height: 1.5em;
    width: 1.5em;
    border-radius: 50%;
    background-color: white;
    text-align: center;
    transform: scale(.8,.8);
    cursor: default
`


export const ModalsStyle = {
    Modal: Modal,
    TextHolder: TextHolder,
    ImageBorder: ImageBorder,
    ModalsText: ModalsText,
    X: X
}

const AboutTitle = styled.h2`
    text-align:center;
    margin: 0 0 .35em 0;
    font-size: 3.75rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 1.2;
    letter-spacing:-0.008em
`

const AboutText = styled.p`
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1.5;
    letter-spacing: 0.009em
`
const MailLink = styled.a`
    color: black;
    margin: 0 0 0 .5em
`

const TextBlock = styled.div`
    padding: 16px;
    background-color: #eee;
    border-radius: 4px;
    color: #1f1f1f
`

export const AboutStyle = {
    AboutTitle: AboutTitle,
    AboutText: AboutText,
    MailLink: MailLink,
    TextBlock: TextBlock
}