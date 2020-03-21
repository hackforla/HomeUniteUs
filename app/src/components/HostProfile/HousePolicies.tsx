import * as React from "react"
import { Host } from "../../models/Host"
import { HousePolicyStyle } from "./style"

interface IHousePoliciesProps {
  host: Host
}

const HousePolicies = ({ host }: IHousePoliciesProps) => {

  let policies = [
    {
      icon:
        host.petsText === "Our pet(s) only need new human friends." ||
          host.petsText === "We provide a pet free environment."
          ? "/hosthome/img/petsNo.png"
          : "/hosthome/img/pets.png",
      content: host.petsText
    },
    {
      icon:
        host.smokingText === "We smoke in the house." ||
          host.smokingText ===
          "We don't smoke, but we're ok with others smoking in the house." ||
          host.smokingText ===
          "I don't smoke, but I'm fine with others smoking indoors."
          ? "/hosthome/img/doSmoke.png"
          : "/hosthome/img/smoke.png",
      content: host.smokingText
    },
    {
      icon:
        host.drinkingText === "No one in the house drinks alcohol."
          ? "/hosthome/img/alcoholNo.png"
          : "/hosthome/img/alcohol.png",
      content: host.drinkingText
    },
    {
      icon:
        host.substancesText === "We use substances."
          ? "/hosthome/img/meds.png"
          : "/hosthome/img/medsNo.png",
      content: host.substancesText
    },
    {
      icon: host.youthParenting
        ? "/hosthome/img/baby.png"
        : "/hosthome/img/babyNo.png",
      content: host.youthParenting
        ? "We welcome parents."
        : "We do not welcome parents."
    }
  ]

  return (
    <HousePolicyStyle.HousePolicyContainer>
      <HousePolicyStyle.HousePolicyTitle>
        House Policies
      </HousePolicyStyle.HousePolicyTitle>
      <HousePolicyStyle.IconHolderRow>
        {policies.slice(0, 3).map(policy =>
          <HousePolicyStyle.SinglePolicyCopyAndIconHolder>
            <HousePolicyStyle.PolicyIconHolder>
              <HousePolicyStyle.HousePolicyImage src={policy.icon} />
              <HousePolicyStyle.HousePolicyContent>
                {policy.content}
              </HousePolicyStyle.HousePolicyContent>
            </HousePolicyStyle.PolicyIconHolder>
          </HousePolicyStyle.SinglePolicyCopyAndIconHolder>
        )}
      </HousePolicyStyle.IconHolderRow>
      <HousePolicyStyle.IconHolderRow style={{ width: "60%" }}>
        {policies.slice(3).map(policy =>
          <HousePolicyStyle.SinglePolicyCopyAndIconHolder>
            <HousePolicyStyle.PolicyIconHolder>
              <HousePolicyStyle.HousePolicyImage src={policy.icon} />
              <HousePolicyStyle.HousePolicyContent>
                {policy.content}
              </HousePolicyStyle.HousePolicyContent>
            </HousePolicyStyle.PolicyIconHolder>
          </HousePolicyStyle.SinglePolicyCopyAndIconHolder>
        )}
      </HousePolicyStyle.IconHolderRow>
    </HousePolicyStyle.HousePolicyContainer>
  )
}

export default HousePolicies
