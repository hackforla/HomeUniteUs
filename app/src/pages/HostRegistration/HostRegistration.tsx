import * as React from 'react'
import { useAuth0, Auth0User } from '../../react-auth0-spa'
import {
    HostDashboardDataProvider,
    useHostDashboardData,
} from '../../data/host-context'
import QuestionPage from '../../components/ProfileEdit/QuestionPage'
import { Switch, Route, useRouteMatch, useParams } from 'react-router'
import MatchingQuestionPage from '../../components/ProfileEdit/MatchingQuestionPage'
import ShowstopperQuestionPage from '../../components/ProfileEdit/ShowstopperQuestionPage'
import { Question } from '../../models/v2'

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

export const ProgressBarTemp = () => {
    return <></>
}
export interface QuestionPanelProps {
    question: Question
    onResponseChanged: (response: string) => void
}
export const QuestionPanel = (props: QuestionPanelProps) => {
    // get question from context
    // if info question then
    const { questionType, questionId } = useParams()
    return (
        <>
            {() => {
                switch (questionType) {
                    case 'matching':
                        return <div />
                    default:
                        throw new Error()
                }
            }}
        </>
    )
}
export interface ControlPanelProps {
    onSubmit: () => void
}
export const ControlPanel = (props: ControlPanelProps) => {
    return <></>
}

export const QuestionPageTemp = () => {
    const submit = () => {}

    const changeResponse = () => {
        // get conditional qs
    }

    return (
        <>
            <ProgressBarTemp />
            <QuestionPanel onResponseChanged={changeResponse} />
            <ControlPanel onSubmit={submit} />
        </>
    )
}

export const HostQuestionsPage = () => {
    let { path } = useRouteMatch()

    return (
        <Switch>
            {/* <Route
                path={`${path}/qualifying/:questionId`}
                component={QuestionPageTemp}
            /> */}
            <Route
                path={`${path}/:questionType/:questionId`}
                component={QuestionPageTemp}
            />
            {/* 

            <Route
                path={`${path}/qualifying/:questionId`}
                render={() => {
                    return (
                        <QuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            showstopperQuestions={getShowstopperQuestions()}
                            matchingQuestions={getMatchingQuestions()}
                        />
                        // <ShowstopperQuestionPage
                        //     stepwise={true}
                        //     onSubmit={handleSubmit}
                        //     showstopperQuestions={getShowstopperQuestions()}
                        //     matchingQuestions={getMatchingQuestions()}
                        // />
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
                        <QuestionPage
                            stepwise={true}
                            onSubmit={handleSubmit}
                            matchingQuestions={getMatchingQuestions()}
                        />
                        // <MatchingQuestionPage
                        //     stepwise={true}
                        //     onSubmit={handleSubmit}
                        //     showstopperQuestions={getShowstopperQuestions()}
                        //     matchingQuestions={getMatchingQuestions()}
                        // />
                    )
                }}
            /> */}

            <Route exact path={`${path}`} component={DefaultRegComp} />
        </Switch>
    )
}
