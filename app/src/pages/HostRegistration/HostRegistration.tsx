import * as React from 'react'
import { useAuth0, Auth0User } from '../../react-auth0-spa'
import {
    HostDashboardDataProvider,
    useHostDashboardData,
} from '../../data/host-context'
import QuestionPage from '../../components/ProfileEdit/QuestionPage'

const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    console.log(e.target)
}

export const HostRegistration = () => {
    const { user } = useAuth0()
    return (
        <HostDashboardDataProvider>
            <HostQuestionsPage />
        </HostDashboardDataProvider>
    )
}

export const HostQuestionsPage = () => {
    const {
        getShowstopperQuestions,
        getMatchingQuestions,
    } = useHostDashboardData()

    return (
        <QuestionPage
            stepwise={true}
            onSubmit={handleSubmit}
            showstopperQuestions={getShowstopperQuestions()}
            matchingQuestions={getMatchingQuestions()}
        />
    )
}
