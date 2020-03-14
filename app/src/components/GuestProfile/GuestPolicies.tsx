import * as React from "react"
import { Guest } from "../../models/Guest"
import { Link } from "react-scroll"
import { GuestPolicyStyle } from "./style"

interface Props {
  guest: Guest
}

const GuestPolicies = ({ guest }: Props) => {
  const Fragment = React.Fragment

  return (
    <Fragment>
      <Link
        activeClass="active"
        to="moreAboutGuest"
        spy={true}
        smooth={true}
        duration={500}
        style={{ margin: "0 0 0 88px" }}
      >
        <a href="#">{`more about ${guest.firstName}`}</a>
      </Link>
      <GuestPolicyStyle.Policy>
        <GuestPolicyStyle.PolicyHeader>
          {guest.firstName}'s Preferences
        </GuestPolicyStyle.PolicyHeader>
        <GuestPolicyStyle.Holder>
          <GuestPolicyStyle.Spacer>
            <GuestPolicyStyle.Fill>
              <GuestPolicyStyle.Holder>
                <GuestPolicyStyle.Image
                  src={
                    guest.petsText ===
                      "I have no pets and would love to live with pets." ||
                      guest.petsText ===
                      "I have pet(s), and would love to live with more pets."
                      ? "/hosthome/img/pets.png"
                      : "/hosthome/img/petsNo.png"
                  }
                  alt={"Pets Policy"}
                />
                <GuestPolicyStyle.Text>
                  {guest.petsText}
                </GuestPolicyStyle.Text>
              </GuestPolicyStyle.Holder>
            </GuestPolicyStyle.Fill>
            <GuestPolicyStyle.Fill>
              <GuestPolicyStyle.Holder>
                <GuestPolicyStyle.Image
                  src={
                    guest.smokingText ===
                      "I smoke cigerettes, but I prefer a smoke free environment indoors." ||
                      guest.smokingText ===
                      "I do not smoke cigerettes, and I prefer a smoke-free environment indoors."
                      ? "/hosthome/img/smoke.png"
                      : "/hosthome/img/doSmoke.png"
                  }
                  alt={"Smoke Policy"}
                />
                <GuestPolicyStyle.Text>
                  {guest.smokingText}
                </GuestPolicyStyle.Text>
              </GuestPolicyStyle.Holder>
            </GuestPolicyStyle.Fill>
          </GuestPolicyStyle.Spacer>
          <GuestPolicyStyle.Spacer>
            <GuestPolicyStyle.Fill>
              <GuestPolicyStyle.Holder>
                <GuestPolicyStyle.Image
                  src={
                    guest.drinkingText ===
                      "I drink alcohol, and I'm open to other people in the household drinking alcohol." ||
                      guest.drinkingText.startsWith(
                        "I don't drink alcohol, but I'm open to other people in the household drinking alcohol."
                      )
                      ? "/hosthome/img/alcohol.png"
                      : "/hosthome/img/alcoholNo.png"
                  }
                  alt={"Alcohol Policy"}
                />
                <GuestPolicyStyle.Text>
                  {guest.drinkingText}
                </GuestPolicyStyle.Text>
              </GuestPolicyStyle.Holder>
            </GuestPolicyStyle.Fill>
            <GuestPolicyStyle.Fill>
              <GuestPolicyStyle.Holder>
                <GuestPolicyStyle.Image
                  src={
                    guest.substancesText ===
                      "I use substances, and I'm open to other people in the household using substances." ||
                      guest.substancesText.startsWith(
                        "I don't use substances, but I'm open to other people in the household using substances."
                      )
                      ? "/hosthome/img/meds.png"
                      : "/hosthome/img/medsNo.png"
                  }
                  alt={"Meds Policy"}
                />
                <GuestPolicyStyle.Text>
                  {guest.substancesText}
                </GuestPolicyStyle.Text>
              </GuestPolicyStyle.Holder>
            </GuestPolicyStyle.Fill>
          </GuestPolicyStyle.Spacer>
        </GuestPolicyStyle.Holder>
      </GuestPolicyStyle.Policy>
    </Fragment>
  )
}

export default GuestPolicies
