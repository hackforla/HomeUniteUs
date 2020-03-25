import * as React from "react"
import Modal from "./Modals"
import { useHistory } from "react-router"
import { DemoStyle } from "./style"

export const Demo = () => {
  const [visible, showElement] = React.useState({
    adminPage: false,
    guestMatches: false,
    interestButtons: false,
    annotationOfInterested: false,
    annotationOfDecline: false
  })

  const showPic = (e: any) => {
    showElement({ ...visible, [e.target.title]: true })
  }

  const history = useHistory()
  return (
    <DemoStyle.MainHolder>
      <Modal
        visible={visible}
        showElement={showElement}
      />
      <DemoStyle.DemoHeader>
        <DemoStyle.DemoTitle>
          Host Profiles
        </DemoStyle.DemoTitle>
      </DemoStyle.DemoHeader>
      <DemoStyle.DemoProfileHolders>
        <DemoStyle.DemoHolder>
          <DemoStyle.InfoPaper>
            <DemoStyle.HeaderRow>
              <DemoStyle.SecondHeader>
                Name
              </DemoStyle.SecondHeader>
              <DemoStyle.SecondHeader>
                Link
              </DemoStyle.SecondHeader>
            </DemoStyle.HeaderRow>


            <DemoStyle.WiderHeaderRow>
              <DemoStyle.DemoName>
                Bonnie Wolfe
              </DemoStyle.DemoName>
              <DemoStyle.DemoButton
                onClick={() =>
                  history.push(`/hosthome/guests/999/matches/999`)
                }
              >
                Profile
                </DemoStyle.DemoButton>
            </DemoStyle.WiderHeaderRow>

            <DemoStyle.WiderHeaderRow>
              <DemoStyle.DemoName>
                Michael Romanov
              </DemoStyle.DemoName>
              <DemoStyle.DemoButton
                onClick={() =>
                  history.push(`/hosthome/guests/13/matches/998`)
                }
              >
                Profile
              </DemoStyle.DemoButton>
            </DemoStyle.WiderHeaderRow>


          </DemoStyle.InfoPaper>
        </DemoStyle.DemoHolder>
      </DemoStyle.DemoProfileHolders>
      <DemoStyle.SpacedHeader>
        <DemoStyle.DemoTitle>
          Guest Profiles
        </DemoStyle.DemoTitle>
      </DemoStyle.SpacedHeader>
      <DemoStyle.DemoProfileHolders>
        <DemoStyle.DemoHolder>
          <DemoStyle.InfoPaper>
            <DemoStyle.HeaderRow>
              <DemoStyle.SecondHeader>
                Name
              </DemoStyle.SecondHeader>
              <DemoStyle.SecondHeader>
                Link
              </DemoStyle.SecondHeader>
            </DemoStyle.HeaderRow>
            <DemoStyle.WiderHeaderRow>
              <DemoStyle.DemoName>
                Kirk Chu
              </DemoStyle.DemoName>
              <DemoStyle.DemoButton
                onClick={() => history.push(`/hosthome/guests/999`)}
              >
                Profile
              </DemoStyle.DemoButton>
            </DemoStyle.WiderHeaderRow>
            <DemoStyle.WiderHeaderRow>
              <DemoStyle.DemoName>
                Megan Sukarnoputri
              </DemoStyle.DemoName>
              <DemoStyle.DemoButton
                onClick={() => history.push(`/hosthome/guests/998`)}
              >
                Profile
              </DemoStyle.DemoButton>
            </DemoStyle.WiderHeaderRow>
          </DemoStyle.InfoPaper>
        </DemoStyle.DemoHolder>
      </DemoStyle.DemoProfileHolders>
      <DemoStyle.SpacedHeader>
        <DemoStyle.DemoTitle>
          Key Moments
        </DemoStyle.DemoTitle>
      </DemoStyle.SpacedHeader>
      <DemoStyle.BigProfileHolder>
        <DemoStyle.DemoHolder>
          <DemoStyle.InfoPaper>
            <DemoStyle.WrapHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>Admin Page</DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="adminPage"
                  src={"/hosthome/img/adminPageThumb.png"}
                  alt={"Admin Page"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>Guest Matches</DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="guestMatches"
                  src={"/hosthome/img/guestMatchesThumb.png"}
                  alt={"Guest Matches"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>
                  Interested/Not Interested Buttons
                </DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="interestButtons"
                  src={"/hosthome/img/interestButtonsThumb.png"}
                  alt={"Interest Buttons"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>
                  Annotation of Interested
                </DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="annotationOfInterested"
                  src={"/hosthome/img/annotationOfInterestedThumb.png"}
                  alt={"Annotation of Interested"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
              <DemoStyle.ImageHolder>
                <DemoStyle.ImageTitle>
                  Annotation of Decline
                </DemoStyle.ImageTitle>
                <DemoStyle.DemoImage
                  title="annotationOfDecline"
                  src={"/hosthome/img/annotationOfDeclineThumb.png"}
                  alt={"Annotation of Decline"}
                  onClick={e => showPic(e)}
                />
              </DemoStyle.ImageHolder>
            </DemoStyle.WrapHolder>
          </DemoStyle.InfoPaper>
        </DemoStyle.DemoHolder>
      </DemoStyle.BigProfileHolder>
    </DemoStyle.MainHolder >
  )
}
