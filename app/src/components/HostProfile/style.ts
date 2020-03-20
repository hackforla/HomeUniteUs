import styled from "styled-components"

const NeighborContainer = styled.div`
    padding: 10px 20px;
    margin: 50px 0 200px 0;
`

const NeighborTitle = styled.div`
    font-size: 24px;
`

const NeighborImage = styled.img`
    width: 70%;

`

export const NeighborStyle = {
    NeighborContainer: NeighborContainer,
    NeighborTitle: NeighborTitle,
    NeighborImage: NeighborImage
}

const LocationImagesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: 400px;
    min-width: 600px;
    max-width: 800px;
`

const LocationImage = styled.img`
    width: 49%;
`

export const LocationImagesStyle = {
    LocationImage: LocationImage,
    LocationImagesContainer: LocationImagesContainer
}

const LocationCardContainer = styled.div`
    height: 600px;
    padding: 10px 20px;
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
    align-items: stretch;
`

const LocationInfoContainer = styled.div`
    max-width: 100%;
    display: flex;
    flex-grow: 0;
    flex-basis: 100%;
`

const LocationDescriptionContainer = styled.div`
    width: 100%;
    height: 166px;
`

const LocationInfo = styled.div`
    font-size: 24px;
    padding: 10px 0;
`

export const LocationCardStyle = {
    LocationCardContainer: LocationCardContainer,
    LocationInfoContainer: LocationInfoContainer,
    LocationDescriptionContainer: LocationDescriptionContainer,
    LocationInfo: LocationInfo
}

const HousePolicyContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 50px auto 0 auto;
  display: flex; 
  align-items:center;
  flex-direction: column;

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

const IconHolderRow = styled(HousePolicyContainer)`
    flex-direction:row;
    margin:0;
`

const HousePolicyTitle = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 25px 0;
    align-self: flex-start;
`

const HousePolicyImage = styled.img`
    width: 100px;
`

const HousePolicyContent = styled.p`
    width: 285px;
    font-size: 24px;
    line-height: 1.3;
`

const PolicyIconHolder = styled.div`
    margin: 20px 0;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
`

const SinglePolicyCopyAndIconHolder = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`

export const HousePolicyStyle = {
    HousePolicyContainer: HousePolicyContainer,
    IconHolderRow: IconHolderRow,
    HousePolicyTitle: HousePolicyTitle,
    HousePolicyImage: HousePolicyImage,
    HousePolicyContent: HousePolicyContent,
    PolicyIconHolder: PolicyIconHolder,
    SinglePolicyCopyAndIconHolder: SinglePolicyCopyAndIconHolder
}

export const RoommateContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const HostImage = styled.img`
    height: 400px;
`

const HostCardContainer = styled.div`
    height: 600px;
    padding: 10px 20px;
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
`

const HostImageContainer = styled.div`
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const HostDescriptionContainer = styled.div`
    height: 175px;
    width: 100%;
`

export const HostCardStyle = {
    HostImage: HostImage,
    HostCardContainer: HostCardContainer,
    HostImageContainer: HostImageContainer,
    HostDescriptionContainer: HostDescriptionContainer
}

const AdditionalInfoContainer = styled.div`
    padding: 10px 20px;
    margin-top: 50px;
`

const AdditionalInfoTitle = styled.div`
    font-size: 24px;
    font-weight: bold;
`

const AdditionalInfoSingleHolder = styled.div`
    width: 70%;
`

const AdditionalInfo = styled.div`
    margin: 20px 0;
`

const AdditionalInfoLabel = styled.div`
    font-weight: bold;
    font-size: 24px;
    line-height: 1.7;
`

const AdditionalInfoContent = styled.div`
    font-size: 20px;
    line-height: 1.3;
`

export const AdditionalInfoStyle = {
    AdditionalInfoContainer: AdditionalInfoContainer,
    AdditionalInfoTitle: AdditionalInfoTitle,
    AdditionalInfoSingleHolder: AdditionalInfoSingleHolder,
    AdditionalInfo: AdditionalInfo,
    AdditionalInfoLabel: AdditionalInfoLabel,
    AdditionalInfoContent: AdditionalInfoContent
}

const GeneralInfoRow = styled.div`
    display: flex;
    justify-content: space-around;
`

const GeneralHeaderText = styled.p`
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 30px 25px; 
`

const GeneralContent = styled.span`
    font-size: 20px;
    margin: 0 0 30px 25px;
`

export const GeneralInfoStyle = {
    GeneralInfoRow: GeneralInfoRow,
    GeneralHeaderText: GeneralHeaderText,
    GeneralContent: GeneralContent
}

const Bar = styled.header`
    color: inherit;
    top: auto;
    bottom: 0;
    height: 100px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-evenly;
    left: auto;
    right: 0;
    position: fixed;
    width: 100%;
    z-index: 1100;
    box-sizing: border-box;
    flex-shrink: 0;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    background-color: #fff;
    box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`

const ButtonHolder = styled.div`
    margin: 0 100px 0 35px;
`

const BarTitle = styled.div`
    margin: 0 0 0 50px;
    font-weight: 700;
    font-size: 20px;
`

const NoButton = styled.button`
    background-color: white;
    padding: 6px 16px;
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 4px;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    border: 0;
    margin: 0;
    display: inline-flex;
    outline: 0;
    vertical-align: middle;
    justify-content: center;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
`

const YesButton = styled(NoButton)`
    color:white;
    background-color: #00AAEF;
    margin: 0 25px 0 20px;
`

export const ButtonBarStyle = {
    ButtonHolder: ButtonHolder,
    BarTitle: BarTitle,
    Bar: Bar,
    NoButton: NoButton,
    YesButton: YesButton
}