import * as React from 'react'
import QuestionPage from '../components/ProfileEdit/QuestionPage'

import styled from 'styled-components'

const Container = styled.div`
    margin: 30px auto;
    padding: 0 15px;
    max-width: 1140px;
`

const getQuestions = (org: string, section: string) => {
    return [
        {
            id: '10',
            type: 'radio',
            group: 'Introductory Questions',
            order: -50,
            question: 'Do you have an extra bedroom or private space in their home?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '11',
            type: 'radio',
            group: 'Introductory Questions',
            order: -49,
            question: 'Are you able to provide Guest with access to a kitchen in which to prepare meals, store food and access to shared or private bathroom?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '12',
            type: 'radio',
            group: 'Introductory Questions',
            order: -48,
            question: 'Do you have homeowners/renters insurance?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '13',
            type: 'radio',
            group: 'Introductory Questions',
            order: -47,
            question: 'Do you live on the westside of Los Angeles or within reasonable distance to public transportation?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '14',
            type: 'radio',
            group: 'Introductory Questions',
            order: -46,
            question: 'Are you able and willing to pass a LiveScan background clearance check?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '15',
            type: 'radio',
            group: 'Introductory Questions',
            order: -45,
            question: 'Do you agree to complete this application, undergo and interview and a home inspection?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '1',
            type: 'radio',
            group: 'Introductory Questions',
            order: -45,
            question: 'Do you agree to attend a 3-hour SPY Volunteer Orientation and a 1-day Host Home Orientation Training?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '2',
            type: 'radio',
            group: 'Introductory Questions',
            order: -45,
            question: 'Do you commit to attending monthly meetings with SPY staff and other hosts?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '3',
            type: 'radio',
            group: 'Introductory Questions',
            order: -45,
            question: 'Do you commit to providing a welcoming, safe, non-judgmental environment and to supporting the self-determined goals of youth Guest?',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '7',
            type: 'text',
            group: 'Host bio',
            subgroup: 'Full name',
            order: 1,
            question: 'First Name',
        },
        {
            id: '8',
            type: 'text',
            group: 'Host bio',
            subgroup: 'Full name',
            order: 2,
            question: 'Middle Name',
        },
        {
            id: '9',
            type: 'text',
            group: 'Host bio',
            subgroup: 'Full name',
            order: 3,
            question: 'Last Name',
        },
        {
            id: '16',
            type: 'text',
            group: 'Host bio',
            order: 4,
            question: 'Date of birth',
        },
        {
            id: '17',
            type: 'radio',
            group: 'Host bio',
            order: 5,
            question: 'Gender identity',
            options: [
                {label: 'option 1', value: '1'},
                {label: 'option 2', value: '2'},
                {label: 'option 3', value: '3'},
                {label: 'option 4', value: '4'},
            ]
        },
        {
            id: '18',
            type: 'radio',
            group: 'Host bio',
            order: 6,
            question: 'Do you have another family member to add?- opens duplicate screen of page 11 for a new family member if yes',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '19',
            type: 'text',
            group: 'Contact Info',
            order: 8,
            question: 'Contact email',
        },
        {
            id: '20',
            type: 'text',
            group: 'Contact Info',
            order: 9,
            question: 'Contact phone',
        },
        {
            id: '21',
            type: 'radio',
            group: 'Contact Info',
            order: 10,
            question: 'Prefered contact method',
            options: [{label: 'Email', value: 'email'}, {label: 'SMS', value: 'sms'}, {label: 'Call', value: 'call'}],
        },
        {
            id: '22',
            type: 'text',
            group: 'Contact Info',
            subgroup: 'Address',
            order: 10,
            question: 'Street',
        },
        {
            id: '23',
            type: 'text',
            group: 'Contact Info',
            subgroup: 'Address',
            order: 11,
            question: 'City',
        },
        {
            id: '24',
            type: 'text',
            group: 'Contact Info',
            subgroup: 'Address',
            order: 12,
            question: 'Zip',
        },
        {
            id: '25',
            type: 'radio',
            group: 'Contact Info',
            order: 13,
            question: 'Is your contact address the same as your residential address?- opens duplicate screen of question 15 if no',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        },
        {
            id: '26',
            type: 'text',
            group: 'Contact Info',
            subgroup: 'Contact Address',
            order: 14,
            question: 'Street',
        },
        {
            id: '27',
            type: 'text',
            group: 'Contact Info',
            subgroup: 'Contact Address',
            order: 15,
            question: 'City',
        },
        {
            id: '28',
            type: 'text',
            group: 'Contact Info',
            subgroup: 'Contact Address',
            order: 16,
            question: 'Zip',
        },
        {
            id: '29',
            type: 'radio',
            group: 'Home Info',
            order: 17,
            question: 'Housing Type',
            options: [{label: 'Owned', value: 'owned'}, {label: 'Rented', value: 'rented'}],
        },
        {
            id: '30',
            type: 'radio',
            group: 'Home Info',
            subgroup: 'Housing Type',
            order: 18,
            question: 'Housing Type',
            options: [
                {label: 'Single family house', value: 'single'}, 
                {label: 'Multi-unit', value: 'multi'},
                {label: 'Mobile home', value: 'mobile'},
                {label: 'Apartment', value: 'apartment'},
            ],
        },
        {
            id: '31',
            type: 'text',
            group: 'Home Info',
            subgroup: 'Housing Type',
            order: 19,
            question: 'Other',
        },
        {
            id: '32',
            type: 'radio',
            group: 'Home Info',
            order: 20,
            question: 'Are you interested in being a temporary (1-10 days) or full time host (3-6 months)?',
            options: [{label: 'Temporary', value: 'temporary'}, {label: 'Full time', value: 'full'}],
        },
        {
            id: '32',
            type: 'text',
            group: 'Employment Info',
            order: 21,
            question: 'Place of Employment',
        },
    ]
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    console.log(e.target);  
}

export const ProfileEditPage = () => {
    return (
        <Container>
            <h2>Hello! Answer these questions:</h2>
            <QuestionPage stepwise={true} onSubmit={handleSubmit} questions={getQuestions('spy', 'basic')}></QuestionPage>
        </Container>
    )
}
