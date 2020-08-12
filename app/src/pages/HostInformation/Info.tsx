import * as React from 'react';
import { Guest } from '../../models';
import GuestCard from '../../components/GuestProfile/GuestCard';
import { TextField } from '@material-ui/core';



interface InfoState {
    guest: Guest;
}

const GuestViewModel = () => {
    name: '',
    imageUrl: '',
    firstName: '',
    middleInitial: ''
}

const Info = () => {

    const [state, 
        setState
    ] = React.useState(
        {
        guest: {
            name: '',
            imageUrl: 'http://imgur.com/324523234',
            firstName: '',
            middleInitial: '',
            lastName: '',
            email: '',
            guestIntro: '',
            guestChallenges:'',
            employmentInfo:'',
            dateOfBirth: new Date(),
            guestStayStatement:'',
            petsText:'',
            drinkingText:'',
            smokingText:'',
            substancesText:'',
            type: '',
            numberOfGuests: 0,
            employmentCompany:'',
            employmentPosition:''

        }
    }
    );

    const fileChanged = () => {

    }

    return (
        <div>
            {/* Formik */}
            <Formik>

            </Formik>

            {/* Name Field */}
            <TextField
                value={
                    state.guest.name
                }
                onChange={}
            />

            {/* Name Field */}
            <TextField
                value={state.guest.name}
                onChange={}
            />

            {/* Name Field */}
            <TextField
                value={state.guest.name}
                onChange={}
            />

            {/* Name Field */}
            <TextField
                value={state.guest.name}
                onChange={}
            />

            <input type='file' onChange={fileChanged} />

        </div>
    );
}