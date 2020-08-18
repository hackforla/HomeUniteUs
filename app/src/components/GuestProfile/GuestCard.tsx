import * as React from 'react'
import { Guest } from '../../models/Guest'
import { GuestCardStyle } from './style'
import NumberContext from './NumberContext'
import { Constants } from '../../data/config'

interface Props {
  guest: Guest
}

const GuestCard = ({ guest }: Props) => (
  <GuestCardStyle.GuestCardContainer>
    <GuestCardStyle.GuestImageContainer>
      <GuestCardStyle.GuestImage
        src={
          guest.id === 999
            ? `${Constants.StaticFilePrefix}/img/kirk.png`
            : guest.id === 998
            ? `${Constants.StaticFilePrefix}/img/megan.png`
            : `${Constants.StaticFilePrefix}/img/profile${React.useContext(
                NumberContext
              )}.png`
        }
        alt={'Guest Image'}
      />
    </GuestCardStyle.GuestImageContainer>
  </GuestCardStyle.GuestCardContainer>
)

export default GuestCard
