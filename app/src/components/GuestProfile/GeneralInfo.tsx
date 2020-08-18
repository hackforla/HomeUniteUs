import * as React from 'react'
import { Guest } from '../../models/Guest'
import { HostHomeType } from '../../models/HostHomeType'
import { NumberProvider } from './NumberContext'
import { GeneralInfoStyle } from './style'
import GuestCard from './GuestCard'
import GuestInfo from './GuestInfo'
import GuestPolicies from './GuestPolicies'

interface Props {
  guest: Guest
}

const guestTypeToString = (hostHomeType: HostHomeType) =>
  hostHomeType === HostHomeType.Respite
    ? 'respite'
    : hostHomeType === HostHomeType.Full
    ? 'full-time'
    : 'full-time or respite'

const GeneralInfo = ({ guest }: Props) => {
  const Fragment = React.Fragment

  const random: number = Math.floor(Math.random() * 4)

  return (
    <Fragment>
      <Fragment>
        <GeneralInfoStyle.GuestInfoHeader>
          Meet {guest.firstName}
        </GeneralInfoStyle.GuestInfoHeader>
        <GeneralInfoStyle.SpacedParagraph>
          {`${guest.firstName} ${guest.lastName}, ${
            new Date().getFullYear() - guest.dateOfBirth.getFullYear()
          }, is a guest seeking ${guestTypeToString(guest.type)} host`}
        </GeneralInfoStyle.SpacedParagraph>
      </Fragment>
      <GeneralInfoStyle.GeneralInfoRow>
        <NumberProvider value={random}>
          <GuestCard guest={guest} />
          <GuestInfo guest={guest} />
        </NumberProvider>
      </GeneralInfoStyle.GeneralInfoRow>
      <Fragment>
        <GuestPolicies guest={guest} />
      </Fragment>
      {/* <GeneralInfoStyle.AdditionalInfo name="moreAboutGuest"> */}
      <GeneralInfoStyle.AdditionalInfo>
        <GeneralInfoStyle.Header>About the Guest</GeneralInfoStyle.Header>
        <br />
        <GeneralInfoStyle.Bold>Intro:</GeneralInfoStyle.Bold>
        <GeneralInfoStyle.Paragraph>
          {guest.guestIntro}
        </GeneralInfoStyle.Paragraph>
        <br />
        <GeneralInfoStyle.Bold>Stay Statement:</GeneralInfoStyle.Bold>
        <GeneralInfoStyle.Paragraph>
          {guest.guestStayStatement}
        </GeneralInfoStyle.Paragraph>
        <br />
        <GeneralInfoStyle.Bold>Employment:</GeneralInfoStyle.Bold>
        <GeneralInfoStyle.Paragraph>
          {`I'm currently employed at ${guest.employmentCompany} as ${guest.employmentPosition}`}
        </GeneralInfoStyle.Paragraph>
        <br />
        <GeneralInfoStyle.Bold>Challenges:</GeneralInfoStyle.Bold>
        <GeneralInfoStyle.Paragraph>
          {guest.guestChallenges}
        </GeneralInfoStyle.Paragraph>
        <br />
      </GeneralInfoStyle.AdditionalInfo>
    </Fragment>
  )
}

export default GeneralInfo
