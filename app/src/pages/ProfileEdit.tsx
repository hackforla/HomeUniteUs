import * as React from 'react'
import QuestionPage from '../components/ProfileEdit/QuestionPage'

import styled from 'styled-components'

const Container = styled.div`
    margin: 30px auto;
    padding: 0 15px;
    max-width: 1140px;
`

const getQuestions = (org: string, section: string) => {
    const questions = [
        {
            id: '7',
            question: 'First Name',
            type: 'text',
            answer: 'house',
        },
        {
            id: '8',
            question: 'Middle Name',
            type: 'text',
            parent: '7',
            answer: 'house',
        },
        {
            id: '9',
            question: 'Last Name',
            type: 'text',
            parent: '7',
            answer: 'house',
        },
        {
            id: '1',
            question: 'How would you describe your home?',
            type: 'radio',
            options: [
                { label: 'Owned Single-Unit', value: 'single' },
                { label: 'Owned Multi-Unit', value: 'multi' },
                { label: 'Owned House', value: 'house' },
            ],
            answer: 'house',
        },
        {
            id: '2',
            question: 'Do you allow drinking there?',
            type: 'radio',
            options: [
                { label: 'Yes', value: 'yes' },
                {
                    label: "We don't drink, but it is allowed",
                    value: 'we-dont',
                },
                { label: 'No', value: 'no' },
            ],
            answer: 'yes',
        },
        {
            id: '3',
            question: 'Do you allow smoking at your residence?',
            type: 'radio',
            options: [
                { label: 'Yes, we smoke inside', value: 'inside' },
                { label: 'Yes, but only outside', value: 'outside' },
                { label: 'No', value: 'no' },
            ],
            answer: 'outside',
        },
        {
            id: '4',
            question: 'Do you allow substance use at your residence?',
            type: 'radio',
            options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
            ],
            answer: 'no',
        },
        {
            id: '5',
            question: 'What are your interests?',
            type: 'checkbox',
            options: [
                { label: 'Tinkering', value: 'tinkering' },
                { label: 'Trashy TV', value: 'tv' },
                { label: 'Puzzles', value: 'puzzles' },
                { label: 'Cheesecakes', value: 'cheesecakes' },
            ],
            answer: {
                tinkering: false,
                tv: true,
                puzzles: false,
                cheesecakes: true,
            },
        },
        {
            id: '6',
            question: 'Tell us about yourself',
            type: 'textarea',
            answer: 'I have many leather-bound books',
        },
    ]
    return questions
}

export const ProfileEditPage = () => {
    return (
        <Container>
            <h2>Hello! Answer these questions:</h2>
            <QuestionPage stepwise={false} questions={getQuestions('spy', 'basic')}></QuestionPage>
        </Container>
    )
}
