import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Container,
    Card,
    Image,
    Btn,
    CardHover,
    BtnContainer,
    CardHover2,
    Text,
    InnerCard,
    Header,
} from './style'

function ProfileSelection() {
    const history = useHistory()
    const [host, setHost] = useState(false)
    const [guest, setGuest] = useState(false)

    const handleToggle = (e: any): void => {
        if (e.target.alt === 'host') {
            setHost(!host)
            setGuest(false)
        }
        if (e.target.alt === 'guest') {
            setGuest(!guest)
            setHost(false)
        }
    }

    const handleClick = (e: any) => {
        console.log("hitting")
    }

    return (
        <Container>
            <Header>
                <h1>Select a Profile</h1>
            </Header>

            <Card>
                <InnerCard>
                    {host && guest === false ? (
                        <CardHover2 onClick={(e: any) => handleToggle(e)}>
                            <Image
                                src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png"
                                alt="host"
                            />
                        </CardHover2>
                    ) : (
                        <CardHover onClick={(e: any) => handleToggle(e)}>
                            <Image
                                src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png"
                                alt="host"
                            />
                        </CardHover>
                    )}

                    {guest && host === false ? (
                        <CardHover2 onClick={(e: any) => handleToggle(e)}>
                            <Image
                                src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png"
                                alt="guest"
                            />
                        </CardHover2>
                    ) : (
                        <CardHover onClick={(e: any) => handleToggle(e)}>
                            <Image
                                src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png"
                                alt="guest"
                            />
                        </CardHover>
                    )}
                </InnerCard>
                <Text>
                    <p>Host</p>
                    <p>Guest</p>
                </Text>
                <BtnContainer>
                    {guest === false && host === false ? (
                        <Btn disabled>Select one...</Btn>
                    ) : (
                        <Btn onClick={handleClick}>Next...</Btn>
                    )}
                </BtnContainer>
            </Card>
        </Container>
    )
}

export default ProfileSelection
