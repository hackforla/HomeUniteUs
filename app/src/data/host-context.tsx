import * as React from 'react'
import { MatchingQuestionType } from '../models/MatchingQuestionType'
import { HostResponse } from '../models/HostResponse'
import { ApiWrapper } from './ApiWrapper'

const HostDashboardContext = React.createContext({})
const hostsFetcher = new ApiWrapper()

interface HostDashboardData {
  hostQuestions: Array<MatchingQuestionType>
  hostResponse: HostResponse | null
  loaderState: {
    loading: boolean
    message: string
  }
}

enum HostDashboardActionType {
  BeginFetchQuestions,
  FinishFetchQuestions,
  GetHostById,
  isLoading,
  BeginPostResponse,
  FinishPostResponse,
  Error,
}

interface HostDashboardAction {
  type: HostDashboardActionType
  payload?:
    | HostDashboardData
    | Array<MatchingQuestionType>
    | boolean
    | string
    | HostResponse
}

const initialState: HostDashboardData = {
  hostQuestions: [],
  hostResponse: null,
  loaderState: {
    loading: false,
    message: '',
  },
}

function hostDashboardReducer(
  state: HostDashboardData,
  action: HostDashboardAction
): HostDashboardData {
  switch (action.type) {
    case HostDashboardActionType.BeginFetchQuestions: {
      return {
        ...state,
        loaderState: {
          loading: true,
          message: action.payload as string,
        },
      }
    }
    case HostDashboardActionType.FinishFetchQuestions: {
      return {
        ...state,
        loaderState: {
          ...state.loaderState,
          loading: false,
        },
        hostQuestions: action.payload as Array<MatchingQuestionType>,
      }
    }
    case HostDashboardActionType.BeginPostResponse: {
      return {
        ...state,
        loaderState: {
          loading: true,
          message: action.payload as string,
        },
      }
    }
    case HostDashboardActionType.FinishPostResponse: {
      return {
        ...state,
        loaderState: {
          ...state.loaderState,
          loading: false,
        },
      }
    }

    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`)
  }
}

export function HostDashboardDataProvider(
  props: React.PropsWithChildren<{}>
): JSX.Element {
  const [state, dispatch] = React.useReducer(hostDashboardReducer, initialState)

  //dispatch begin and finish get questions

  React.useEffect(() => {
    ;(async function () {
      console.log('loadData: fetching...')
      try {
        dispatch({
          type: HostDashboardActionType.BeginFetchQuestions,
          payload: 'Retrieving host questions...',
        })
        const questions = await hostsFetcher.getMatchingHostQuestions()

        dispatch({
          type: HostDashboardActionType.FinishFetchQuestions,
          payload: questions,
        })
      } catch (e) {
        dispatch({
          type: HostDashboardActionType.Error,
          payload: `System error: ${e}`,
        })
      }
    })()
  }, [])

  const value = React.useMemo(() => [state, dispatch], [state])
  return <HostDashboardContext.Provider value={value} {...props} />
}

const getShowstopperQuestions = () => {
  return [
    {
      id: '10',
      group: 'Qualifying',
      order: -50,
      question: 'Do you have an extra bedroom or private space in your home?',
    },
    {
      id: '11',
      group: 'Qualifying',
      order: -49,
      question:
        'Are you able to provide Guest with access to a kitchen in which to prepare meals, store food and access to shared or private bathroom?',
    },
    {
      id: '12',
      group: 'Qualifying',
      order: -48,
      question: 'Do you have homeowners/renters insurance?',
    },
    {
      id: '13',
      group: 'Qualifying',
      order: -47,
      question:
        'Do you live on the westside of Los Angeles or within reasonable distance to public transportation?',
    },
    {
      id: '14',
      group: 'Qualifying',
      order: -46,
      question:
        'Are you able and willing to pass a LiveScan background clearance check?',
    },
    {
      id: '15',
      group: 'Qualifying',
      order: -45,
      question:
        'Do you agree to complete this application, undergo and interview and a home inspection?',
    },
    {
      id: '1',
      group: 'Qualifying',
      order: -45,
      question:
        'Do you agree to attend a 3-hour SPY Volunteer Orientation and a 1-day Host Home Orientation Training?',
    },
    {
      id: '2',
      group: 'Qualifying',
      order: -45,
      question:
        'Do you commit to attending monthly meetings with SPY staff and other hosts?',
    },
    {
      id: '3',
      group: 'Qualifying',
      order: -45,
      question:
        'Do you commit to providing a welcoming, safe, non-judgmental environment and to supporting the self-determined goals of youth Guest?',
    },
  ]
}

const getMatchingQuestions = () => {
  return [
    {
      id: '7',
      type: 'text',
      group: 'Bio',
      subgroup: 'Full name',
      order: 1,
      question: 'First Name',
    },
    {
      id: '8',
      type: 'text',
      group: 'Bio',
      subgroup: 'Full name',
      order: 2,
      question: 'Middle Name',
    },
    {
      id: '9',
      type: 'text',
      group: 'Bio',
      subgroup: 'Full name',
      order: 3,
      question: 'Last Name',
    },
    {
      id: '16',
      type: 'text',
      group: 'Bio',
      order: 4,
      question: 'Date of birth',
    },
    {
      id: '17',
      type: 'checkbox',
      group: 'Bio',
      subgroup: 'Gender',
      order: 5,
      question: 'What gender(s) do you most identify with?',
      options: [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' },
        { label: 'Trans Man', value: 'trans-man' },
        { label: 'Trans Woman', value: 'trans-woman' },
        { label: 'Non Binary', value: 'non-binary' },
        { label: 'Prefer not to identify', value: 'prefer-not' },
        { label: 'Describe your gender', value: 'describe' },
      ],
    },
    {
      id: '38',
      type: 'text',
      group: 'Bio',
      subgroup: 'Gender',
      order: 6,
      question: 'Describe your gender',
      conditional_id: '17',
      conditional_value: 'describe',
    },
    {
      id: '18',
      type: 'radio',
      group: 'Bio',
      order: 7,
      question:
        'Do you have another family member to add?- opens duplicate screen of page 11 for a new family member if yes',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '19',
      type: 'text',
      group: 'Bio',
      order: 8,
      question: 'Contact email',
    },
    {
      id: '20',
      type: 'text',
      group: 'Bio',
      order: 9,
      question: 'Contact phone',
    },
    {
      id: '21',
      type: 'radio',
      group: 'Bio',
      order: 10,
      question: 'Prefered contact method',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
        { label: 'Call', value: 'call' },
      ],
    },
    {
      id: '22',
      type: 'text',
      group: 'Bio',
      subgroup: 'Contact Address',
      order: 10,
      question: 'Street',
    },
    {
      id: '23',
      type: 'text',
      group: 'Bio',
      subgroup: 'Contact Address',
      order: 11,
      question: 'City',
    },
    {
      id: '24',
      type: 'text',
      group: 'Bio',
      subgroup: 'Contact Address',
      order: 12,
      question: 'Zip',
    },
    {
      id: '25',
      type: 'radio',
      group: 'Bio',
      order: 13,
      question:
        'Is your contact address the same as your residential address?- opens duplicate screen of question 15 if no',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '26',
      type: 'text',
      group: 'Bio',
      subgroup: 'Residential Address',
      order: 14,
      question: 'Street',
      conditional_id: '25',
      conditional_value: 'no',
    },
    {
      id: '27',
      type: 'text',
      group: 'Bio',
      subgroup: 'Residential Address',
      order: 15,
      question: 'City',
      conditional_id: '25',
      conditional_value: 'no',
    },
    {
      id: '28',
      type: 'text',
      group: 'Bio',
      subgroup: 'Residential Address',
      order: 16,
      question: 'Zip',
      conditional_id: '25',
      conditional_value: 'no',
    },
    {
      id: '29',
      type: 'radio',
      group: 'Bio',
      order: 17,
      question: 'Housing Type',
      options: [
        { label: 'Owned', value: 'owned' },
        { label: 'Rented', value: 'rented' },
      ],
    },
    {
      id: '30',
      type: 'radio',
      group: 'Bio',
      subgroup: 'Housing Type',
      order: 18,
      question: 'Housing Type',
      options: [
        { label: 'Single family house', value: 'single' },
        { label: 'Multi-unit', value: 'multi' },
        { label: 'Mobile home', value: 'mobile' },
        { label: 'Apartment', value: 'apartment' },
      ],
    },
    {
      id: '31',
      type: 'text',
      group: 'Bio',
      subgroup: 'Housing Type',
      order: 19,
      question: 'Other',
    },
    {
      id: '32',
      type: 'radio',
      group: 'Bio',
      order: 20,
      question:
        'Are you interested in being a temporary (1-10 days) or full time host (3-6 months)?',
      options: [
        { label: 'Temporary', value: 'temporary' },
        { label: 'Full time', value: 'full' },
      ],
    },
    {
      id: '33',
      type: 'text',
      group: 'Bio',
      subgroup: 'Job',
      order: 21,
      question: 'Place of Employment',
    },
    {
      id: '34',
      type: 'text',
      group: 'Bio',
      subgroup: 'Job',
      order: 22,
      question: 'Job Title',
    },
    {
      id: '35',
      type: 'radio',
      group: 'Home',
      subgroup: 'Pet',
      order: 23,
      question: 'Do you have pets?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '36',
      type: 'radio',
      group: 'Home',
      subgroup: 'Pet',
      order: 24,
      question: 'What kind of pets?',
      options: [
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Tortoise', value: 'tortoise' },
        { label: 'Other', value: 'other' },
      ],
      conditional_id: '35',
      conditional_value: 'yes',
    },
    {
      id: '37',
      type: 'text',
      group: 'Home',
      subgroup: 'Pet',
      order: 25,
      question: 'Other kind of pet',
      conditional_id: '36',
      conditional_value: 'other',
    },
    {
      id: '39',
      type: 'radio',
      group: 'Home',
      subgroup: 'Guest Pet',
      order: 26,
      question: 'Are you willing to host a youth with a pet?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '40',
      type: 'radio',
      group: 'Home',
      subgroup: 'Guest Pet',
      order: 27,
      question: 'What type of pet?',
      options: [
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
        { label: 'Tortoise', value: 'tortoise' },
        { label: 'Other', value: 'other' },
      ],
      conditional_id: '39',
      conditional_value: 'yes',
    },
    {
      id: '41',
      type: 'text',
      group: 'Home',
      subgroup: 'Guest Pet',
      order: 28,
      question: 'Other kind of pet',
      conditional_id: '40',
      conditional_value: 'other',
    },
    {
      id: '42',
      type: 'radio',
      group: 'Home',
      subgroup: 'Smoking',
      order: 29,
      question: 'Do you or anyone in your houshold smoke?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '43',
      type: 'radio',
      group: 'Home',
      subgroup: 'Smoking',
      order: 30,
      question: 'Is smoking allowed inside your home?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      conditional_id: '42',
      conditional_value: 'yes',
    },
    {
      id: '44',
      type: 'radio',
      group: 'Home',
      subgroup: 'Drinking',
      order: 31,
      question: 'Do you or anyone in your household drink alcohol?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '45',
      type: 'radio',
      group: 'Home',
      subgroup: 'Drinking',
      order: 33,
      question: 'Do you have concerns about your drinking?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      conditional_id: '44',
      conditional_value: 'yes',
    },
    {
      id: '46',
      type: 'text',
      group: 'Home',
      subgroup: 'Drinking',
      order: 34,
      question: 'Please explain why you are concerned',
      conditional_id: '45',
      conditional_value: 'yes',
    },
    {
      id: '47',
      type: 'radio',
      group: 'Home',
      subgroup: 'Substances',
      order: 35,
      question:
        'Do you or anyone in your household use other substances (prescriptions, etc.)?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '48',
      type: 'radio',
      group: 'Home',
      subgroup: 'Substances',
      order: 36,
      question: 'Do you have concerns about your substance use?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      conditional_id: '47',
      conditional_value: 'yes',
    },
    {
      id: '49',
      type: 'text',
      group: 'Home',
      subgroup: 'Substances',
      order: 37,
      question: 'Please explain why you are concerned',
      conditional_id: '48',
      conditional_value: 'yes',
    },
    {
      id: '50',
      type: 'text',
      group: 'Home',
      order: 38,
      question: 'How many youth are you able to host at one time?',
    },
    {
      id: '51',
      type: 'radio',
      group: 'Home',
      order: 39,
      question: 'Are you willing to host a parenting youth?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '52',
      type: 'radio',
      group: 'Home',
      order: 40,
      question:
        'Are you willing to host youth who are in a relationship with one another?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: '53',
      type: 'text',
      group: 'Home',
      order: 41,
      question:
        'Please upload an image of yourself (feel free to include any other family members!)',
    },
    {
      id: '54',
      type: 'text',
      group: 'Home',
      order: 42,
      question: 'Please upload an image of your home',
    },
    {
      id: '55',
      type: 'text',
      group: 'Home',
      subgroup:
        'Please upload any additional images you feel will give guests a better idea of you and your home',
      order: 43,
      question: 'Image upload',
    },
    {
      id: '56',
      type: 'text',
      group: 'Home',
      subgroup:
        'Please upload any additional images you feel will give guests a better idea of you and your home',
      order: 44,
      question: 'Image upload',
    },
    {
      id: '57',
      type: 'text',
      group: 'Home',
      subgroup:
        'Please upload any additional images you feel will give guests a better idea of you and your home',
      order: 45,
      question: 'Image upload',
    },
    {
      id: '58',
      type: 'textarea',
      group: 'Personal',
      order: 46,
      question: 'What are your passions, interests, and hobbies?',
    },
    {
      id: '59',
      type: 'text',
      group: 'Personal',
      order: 47,
      question: 'What languages do you speak at home',
    },
    {
      id: '60',
      type: 'textarea',
      group: 'Personal',
      order: 48,
      question:
        'Describe any preferred or ideal characteristics you hope for in a guest',
    },
    {
      id: '61',
      type: 'textarea',
      group: 'Personal',
      order: 49,
      question:
        'Please share why you are interested in hosting a young person experiencing homelessness',
    },
    {
      id: '62',
      type: 'textarea',
      group: 'Personal',
      order: 50,
      question:
        'Please share any strengths, skills, or experience you have that you believe will make you a successful host',
    },
    {
      id: '63',
      type: 'textarea',
      group: 'Personal',
      order: 51,
      question:
        'Please describe any challenges you foresee in your role as host',
    },
    {
      id: '64',
      type: 'textarea',
      group: 'Personal',
      order: 52,
      question:
        'As a way of starting your host profile, please take a moment to write something to introduce yourself to potential guests. Feel free to talk about your passions and hobbies, your family, your home values, or anything else that feels important to you.',
    },
  ]
}

export function useHostDashboardData() {
  const context = React.useContext(HostDashboardContext)
  console.log('this is context in a custom hook', context)
  if (!context) {
    throw new Error(
      'useHostDashboardData must be used within a HostDashboardProvider'
    )
  }

  const postHostResponse = (hostResponse: HostResponse) => {
    console.log(`postHostResponse: ${hostResponse} `)
    try {
      //dispatch begin
      //await post
      //dispatch end
    } catch (e) {}
  }

  const [data, dispatch] = context as [
    HostDashboardData,
    React.Dispatch<HostDashboardAction>
  ]

  return {
    data,
    dispatch,
    getShowstopperQuestions,
    getMatchingQuestions,
    postHostResponse,
  }
}
