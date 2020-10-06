import * as React from 'react'
import QuestionPage from '../components/ProfileEdit/QuestionPage'
import {
    HostDashboardDataProvider,
    useHostDashboardData,
} from '../data/host-context'

/*

    TODO: Divide this component
        - the reusable portion, <QuestionPage />, and the user-type-specific portion,
            <HostDashBoardProvider /> vs <GuestDashBoardProvider />
            ...cleanest approach would have three layers

            ///// TOP LEVEL: This component routed to from top Router
            /////   this can contain the progress bar UI
            <HostRegistration>
                <HostDashBoardProvider>
                     //// SUB ROUTER
                     <Switch>
                          ///// within each of these componenets, access the correct context via hook
                          ///// <Routes /> for BIO/CONTACT form
                          ///// <Routes /> for Qualifying questions by ID
                          ///// <Routes /> for Matching questions by ID
                     </Switch>
                </HostDashBoardProvider>
            </HostRegistration>
    

*/

const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    console.log(e.target)

    // call API wrapper to post
    //history.push() ??
}

export const ProfileEditPage = () => {
    return (
        <HostDashboardDataProvider>
            <QuestionPage
                stepwise={true}
                onSubmit={handleSubmit}
            ></QuestionPage>
        </HostDashboardDataProvider>
    )
}
