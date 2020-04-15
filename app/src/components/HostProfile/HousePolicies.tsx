import * as React from "react"
import { Host } from "../../models/Host"
import { HousePolicyStyle } from "./style"
import { Constants } from "../../data/config"

interface IHousePoliciesProps {
  host: Host
}

const HousePolicies = ({ host }: IHousePoliciesProps) => {

  let policies = [
    {
      icon:
        host.petsText === "Our pet(s) only need new human friends." ||
          host.petsText === "We provide a pet free environment."
          ? `${Constants.StaticFilePrefix}/img/petsNo.png`
          : `${Constants.StaticFilePrefix}/img/pets.png`,
      content: host.petsText
    },
    {
      icon:
        host.smokingText === "We smoke in the house." ||
          host.smokingText ===
          "We don't smoke, but we're ok with others smoking in the house." ||
          host.smokingText ===
          "I don't smoke, but I'm fine with others smoking indoors."
          ? `${Constants.StaticFilePrefix}/img/doSmoke.png`
          : `${Constants.StaticFilePrefix}/img/smoke.png`,
      content: host.smokingText
    },
    {
      icon:
        host.drinkingText === "No one in the house drinks alcohol."
          ? `${Constants.StaticFilePrefix}/img/alcoholNo.png`
          : `${Constants.StaticFilePrefix}/img/alcohol.png`,
      content: host.drinkingText
    },
    {
      icon:
        host.substancesText === "We use substances."
          ? `${Constants.StaticFilePrefix}/img/meds.png`
          : `${Constants.StaticFilePrefix}/img/medsNo.png`,
      content: host.substancesText
    },
    {
      icon: host.youthParenting
        ? `${Constants.StaticFilePrefix}/img/baby.png`
        : `${Constants.StaticFilePrefix}/img/babyNo.png`,
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
