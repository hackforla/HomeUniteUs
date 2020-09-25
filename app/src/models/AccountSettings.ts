/* schema describing the customizable properties of the theme */
/* first defined at account onboarding */

export interface AccountSettings {
    accountId: string
    accountName: string
    logoImageURL: string
    primaryColor: string
    fontColor: string //calculate hex code complementary to primary color
}
