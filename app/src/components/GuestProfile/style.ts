import styled from 'styled-components'

const GuestInfoHeader = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 30px 25px;
`

const Paragraph = styled.p`
    font-size: 20px;
    line-height: 1.3;
`

const SpacedParagraph = styled(Paragraph)`
    margin: 0 0 0 25px;
`

const GeneralInfoRow = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`

const AdditionalInfo = styled.div`
    width: 70%;
    margin: 0 0 3em 1.6em;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`

const Header = styled.h5`
    font-size: 24px;
    font-weight: bold;

`

const Bold = styled.b`
    font-size: 24px;
`

export const GeneralInfoStyle = {
    GuestInfoHeader: GuestInfoHeader,
    Paragraph: Paragraph,
    SpacedParagraph: SpacedParagraph,
    GeneralInfoRow: GeneralInfoRow,
    AdditionalInfo: AdditionalInfo,
    Header: Header,
    Bold: Bold
}


const GuestCardContainer = styled.div`
    height: 400px;
    padding: 10px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
`

const GuestImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const GuestImage = styled.img`
    box-shadow:
      0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12);
      height: 400px;
`

export const GuestCardStyle = {
    GuestCardContainer: GuestCardContainer,
    GuestImageContainer: GuestImageContainer, GuestImage: GuestImage
}


const LocationImagesContainer = styled.div`
    border: 1px hidden green;
    display: flex;
    flex-wrap: wrap;
    height: 400px;
    min-width: 600px;
    max-width: 800px;
`

const PlaceImage = styled.img`
    box-shadow:
      0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12);
    width: 49%;
`

export const GuestInfoStyle = {
    LocationImagesContainer: LocationImagesContainer,
    PlaceImage: PlaceImage
}

const Policy = styled.div`
    border: 1px hidden blue;
    margin: 200px 0 65px 0;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
`

const PolicyHeader = styled.h5`
    font-size: 24px;
    align-self: flex-start;
    margin: 0 0 50px 25px;
`

const Holder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
`

const Spacer = styled.div`
    display:inherit;
    width: inherit;
    justify-content: space-evenly;
`
const Fill = styled(Holder)`
    width: 49%;
`
const Image = styled.img`
    margin: 0 0 30px 0;
    width:100px;
`
const Text = styled.span`
    width: 285px;
    margin: 0 0 25px 0;
    font-size: 24px;
    line-height: 1.3;
`

export const GuestPolicyStyle = {
    Policy: Policy,
    PolicyHeader: PolicyHeader,
    Holder: Holder,
    Spacer: Spacer,
    Fill: Fill,
    Image: Image,
    Text: Text
}