import * as React from 'react'
import { Host } from '../../models/Host'
import { Element } from 'react-scroll'
import { AdditionalInfoStyle } from './style'

interface IAdditionalInfoProps {
    host: Host
}

const HostAdditionalInfo = ({ host }: IAdditionalInfoProps) => {
    const additionalInfos = [
        {
            label: 'Employment:',
            content: `I'm currently employed at ${host.employmentCompany} as ${host.employmentPosition}`,
        },
        {
            label: 'Languages Spoken:',
            content: host.languages.join(', '),
        },
        {
            label: 'My Passions Are:',
            content: host.interests.join(', '),
        },
        {
            label: 'Desired Characteristics In A Tenant:',
            content: host.preferredCharacteristics,
        },
        {
            label: 'I Would Like To Be A Host Home Because:',
            content: host.hostingInterest,
        },
        {
            label: 'I Think I Would Be A Good Host Because:',
            content: host.hostingStrengths,
        },
        {
            label: 'These Are Challenges I May Face As A Host:',
            content: host.hostingChallenges,
        },
        {
            label: 'More About Me:',
            content: host.hostIntro,
        },
    ]

    return (
        <Element name="additionalInfo">
            <AdditionalInfoStyle.AdditionalInfoContainer>
                <AdditionalInfoStyle.AdditionalInfoTitle>
                    About the Host
                </AdditionalInfoStyle.AdditionalInfoTitle>
                <AdditionalInfoStyle.AdditionalInfoSingleHolder>
                    {additionalInfos.map((additionalHostInfo) => (
                        <AdditionalInfoStyle.AdditionalInfo>
                            <AdditionalInfoStyle.AdditionalInfoLabel>
                                {additionalHostInfo.label}
                            </AdditionalInfoStyle.AdditionalInfoLabel>
                            <AdditionalInfoStyle.AdditionalInfoContent>
                                {additionalHostInfo.content}
                            </AdditionalInfoStyle.AdditionalInfoContent>
                        </AdditionalInfoStyle.AdditionalInfo>
                    ))}
                </AdditionalInfoStyle.AdditionalInfoSingleHolder>
            </AdditionalInfoStyle.AdditionalInfoContainer>
        </Element>
    )
}

export default HostAdditionalInfo
