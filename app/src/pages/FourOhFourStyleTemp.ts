import styled from "styled-components"

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