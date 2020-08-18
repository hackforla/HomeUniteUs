import * as React from 'react'
import { useParams, useHistory } from 'react-router'
import { useHostHomeData } from '../../data/data-context'
import { ButtonBarStyle } from './style'
import { Host, MatchResult } from '../../models'
import { ProgressPlugin } from 'webpack'

const ButtonBar = () => {
  const history = useHistory()
  let { guestId, hostId } = useParams()

  const gid = Number.parseInt(guestId || '')
  const hid = Number.parseInt(hostId || '')

  const { markAsInterested, markAsNotInterested } = useHostHomeData()

  return (
    <ButtonBarStyle.Bar>
      <ButtonBarStyle.BarTitle>
        Would you like to express interest in this host's home?
      </ButtonBarStyle.BarTitle>
      <ButtonBarStyle.ButtonHolder>
        <ButtonBarStyle.YesButton
          onClick={() => {
            markAsInterested({
              guestId: gid,
              hostId: hid,
            })
            history.push(`/admin/guest/${guestId}`)
          }}
        >
          I'm interested
        </ButtonBarStyle.YesButton>
        <ButtonBarStyle.NoButton
          onClick={() => {
            markAsNotInterested({
              guestId: gid,
              hostId: hid,
            })
            history.push(`/admin/guest/${guestId}`)
          }}
        >
          I'm not interested
        </ButtonBarStyle.NoButton>
      </ButtonBarStyle.ButtonHolder>
    </ButtonBarStyle.Bar>
  )
}

export default ButtonBar
