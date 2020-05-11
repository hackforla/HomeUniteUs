import React, { useState } from 'react'
import { Container, Card, Image, Btn, CardHover, BtnContainer } from './style'

function ProfileSelection() {
  const [clicked, setClicked] = useState({
    host: false,
    guest: false
  })

  const handleClick = () => {
    console.log("clicked")
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
          <CardHover onClick={handleClick}>
            <Image src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png" alt="house" />
          </CardHover>
          <CardHover>
            <Image src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png" alt="guest" />
          </CardHover>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "24rem", margin: " 0 auto" }}>
          <p>Host</p>
          <p>Guest</p>
        </div>
        <BtnContainer>
          <Btn>Next...</Btn>
        </BtnContainer>
      </Card>
    </Container>
  )
}

export default ProfileSelection
