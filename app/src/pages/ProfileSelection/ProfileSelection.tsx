import React, { useState } from 'react'
import { Container, Card, Image, Btn, CardHover, BtnContainer, CardHover2 } from './style'

function ProfileSelection() {
  const [host, setHost] = useState(false)
  const [guest, setGuest] = useState(false)

  const handleClick = (e: any) => {
    if (e.target.alt === "host") {
      setHost(!host)
      setGuest(false)
    }
    if (e.target.alt === "guest") {
      setGuest(!guest)
      setHost(false)
    }
  }

  return (
    <Container>
      <div style={{
        textAlign: "center",
        margin: "0 auto",
        marginTop: "5rem",
        height: "28px"
      }}>
        <h1>Select a Profile</h1>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {
            host && guest === false
              ? <CardHover2 onClick={(e) => handleClick(e)}>
                <Image src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png" alt="host" />
              </CardHover2>
              : <CardHover onClick={(e) => handleClick(e)}>
                <Image src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png" alt="host" />
              </CardHover>
          }

          {
            guest && host === false
              ? <CardHover2 onClick={(e) => handleClick(e)}>
                <Image src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png" alt="guest" />
              </CardHover2>
              : <CardHover onClick={(e) => handleClick(e)}>
                <Image src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png" alt="guest" />
              </CardHover>
          }

        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "368px", margin: " 0 auto" }}>
          <p>Host</p>
          <p>Guest</p>
        </div>
        <BtnContainer>
          {
            guest === false && host === false
              ? <Btn disabled>Select one...</Btn>
              : <Btn>Next...</Btn>
          }

        </BtnContainer>
      </Card>
    </Container>
  )
}

export default ProfileSelection
