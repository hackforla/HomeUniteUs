import * as React from 'react'
import { useAuth0, Auth0User } from '../../react-auth0-spa'
import {
    HostDashboardDataProvider,
    useHostDashboardData,
} from '../../data/host-context'
import QuestionPage from '../../components/ProfileEdit/QuestionPage'
import { Switch, Route, useRouteMatch } from 'react-router'
import MatchingQuestionPage from '../../components/ProfileEdit/MatchingQuestionPage'
import ShowstopperQuestionPage from '../../components/ProfileEdit/ShowstopperQuestionPage'

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

export const DefaultRegComp = () => {
    return <div>Host Registration Default Component</div>
}

export const HostQuestionsPage = () => {
    const {
        getShowstopperQuestions,
        getMatchingQuestions,
    } = useHostDashboardData()

    let { path } = useRouteMatch()

    return (
        <Switch>
            <Route
                path={`${path}/qualifying/:questionId`}
                render={() => {
                    return (
                        <ShowstopperQuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            showstopperQuestions={getShowstopperQuestions()}
                            matchingQuestions={getMatchingQuestions()}
                        />
                    )
                }}
            />

            <Route
                path={`${path}/bio/info`}
                render={() => {
                    return (
                        <QuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            showstopperQuestions={getShowstopperQuestions()}
                            matchingQuestions={getMatchingQuestions()}
                        />
                    )
                }}
            />

            <Route
                path={`${path}/bio/address`}
                render={() => {
                    return (
                        <QuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            showstopperQuestions={getShowstopperQuestions()}
                            matchingQuestions={getMatchingQuestions()}
                        />
                    )
                }}
            />

            <Route
                path={`${path}/bio/language`}
                render={() => {
                    return (
                        <QuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            showstopperQuestions={getShowstopperQuestions()}
                            matchingQuestions={getMatchingQuestions()}
                        />
                    )
                }}
            />

            <Route
                path={`${path}/bio/gender`}
                render={() => {
                    return (
                        <QuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            showstopperQuestions={getShowstopperQuestions()}
                            matchingQuestions={getMatchingQuestions()}
                        />
                    )
                }}
            />

            <Route
                path={`${path}/contact`}
                render={() => {
                    return (
                        <QuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            showstopperQuestions={getShowstopperQuestions()}
                            matchingQuestions={getMatchingQuestions()}
                        />
                    )
                }}
            />

            <Route
                path={`${path}/matching/:questionId`}
                render={() => {
                    return (
                        <MatchingQuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            matchingQuestions={getMatchingQuestions()}
                        />
                    )
                }}
            />

            <Route exact path={`${path}`} component={DefaultRegComp} />
        </Switch>
    )
}
