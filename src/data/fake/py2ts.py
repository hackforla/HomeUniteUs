import os
import sys
import json

OUTPUT_DIR = 'output'

GUEST_QUESTIONS = [
    'pets_have',
    'host_pets',
    'employed',
    'in_school',
    'smoking_guest',
    'substances_household_acceptable',
    'drinking_household_acceptable',
    'substances_guest',
    'mental_illness',
    'guests_relationship',
    'smoking_household_acceptable',
    'drinking_guest',
    'mental_illness_care',
    'parenting_guest',
    'drinking_concerns',
    'substances_concerns',
    'pets_kind',
    'pets_other',
    'pets_list',
    'host_pet_restrictions',
    'languages',
    'duration_of_stay',
    'number_of_guests',
    'smoking_household_acceptable'
]

GUEST_QUESTIONS_TEXT = {
    'pets_have': 'Do you have pets?',
    'host_pets': 'Are you willing to live with a host who has pets?',
    'employed':'Are you currently employed or looking for employment?',
    'in_school':'Are you enrolled or hoping to enroll in an educational program?',
    'smoking_guest':'Do you smoke cigarettes?',
    'substances_household_acceptable':'Are you willing to live in a home where other substances are used?',
    'drinking_household_acceptable':'Are you willing to live in a home where alcohol is consumed?',
    'substances_guest':'Do you use other substances?',
    'mental_illness':'Do you suffer from mental illness?',
    'guests_relationship': 'Are you in a relationship?',
    'smoking_household_acceptable':'Are you willing to live in a home where smoking is permitted indoors?',
    'drinking_guest':'Do you drink alcohol?',
    'mental_illness_care':'If yes to, are you currently receiving care/treatment?',
    'parenting_guest':'Are you parenting?',
    'drinking_concerns':'Do you have concerns about your drinking?',
    'substances_concerns':'Do you have concerns about substance use?',
    'pets_kind': 'What kind of pets do you have?',
    'pets_other': 'What other pets?',
    'pets_list': 'What pets?',
    'host_pet_restrictions': 'Are you ok with a host home which has pets?',
    'languages': 'What language(s) do you speak?',
    'duration_of_stay': 'What duration of stay are you looking for?',
    'number_of_guests': 'How many guests?',
    'smoking_household_acceptable': 'Are you willing to live in a home where residents smoke?'
}

QUESTIONS = [
    'smoking_allowed',
    'smoking_residents',
    'drinking_residents',
    'drinking_concerns',
    'substances_residents',
    'substances_concerns',
    'host_type',
    'hosting_amount',
    'pets_hosting',
    'pet_restrictions',
    'youth_parenting',
    'youth_relationship',
]

QUESTIONS_TEXT = {
    'smoking_allowed': 'Is smoking allowed in your home?',
    'smoking_residents': 'Do you or any residents smoke in the home?',
    'drinking_residents': 'Do any residents drink alcohol in the home?',
    'drinking_concerns': 'Do you have concerns about your alcohol use, or that of any resident in the home?',
    'substances_residents': 'Do you or any residents use substances?',
    'substances_concerns': 'Do you have concerns about your substance use, or that of any resident in the home?',
    'host_type': 'How long would you like to host?',
    'hosting_amount': 'How many guests are you willing to host?',
    'pets_hosting': 'Do you have any pets?',
    'pet_restrictions': 'Are you willing to host a guest who has pets?',
    'youth_parenting': 'Are you willing to host a guest who is parenting?',
    'youth_relationship':'Are you willing to host a guest who is in a relationship?',
}

QUESTIONS_DISPLAY = {
    'smoking_allowed': 'Smoking Allowed',
    'smoking_residents': 'Smoking Residents',
    'drinking_residents': 'Drinking Residents',
    'drinking_concerns': 'Drinking Concerns',
    'substances_residents': 'Substances Residents',
    'substances_concerns': 'Substances Concerns',
    'host_type': 'Host Type',
    'hosting_amount': 'Number of Guests',
    'pets_hosting': 'Has Pets',
    'pet_restrictions': 'Pets OK',
    'youth_parenting': 'Parenting OK',
    'youth_relationship': 'Relationship OK',
}

BOOL_Q = [
    'smoking_allowed',
    'smoking_residents',
    'drinking_residents',
    'substances_residents',
    'pets_hosting',
    'youth_parenting',
    'youth_relationship',
    'pets_have',
    'host_pets',
    'employed',
    'in_school',
    'smoking_guest',
    'substances_household_acceptable',
    'drinking_household_acceptable',
    'substances_guest',
    'mental_illness',
    'guests_relationship',
    'smoking_household_acceptable',
    'drinking_guest',
    'mental_illness_care',
    'parenting_guest',
    'smoking_household_acceptable'
]

INT_Q = [
    'hosting_amount',
]

LIST_Q = [
    'drinking_concerns',
    'substance_concerns',
    'pet_restrictions',
    'drinking_concerns',
    'substances_concerns',
]


RESTRICTIONS = {
    'number_of_guests':'hosting_amount',
    'guests_relationship':'youth_relationship',
    'parenting_guest':'youth_parenting',
    'pets_have':'pets_hosting',
    'duration_of_stay':'duration_of_stay',
    'smoking_household_acceptable':'smoking_allowed',
    'drinking_household_acceptable':'drinking_residents',
    'substances_household_acceptable':'substances_residents'
}


def main():

    if(len(sys.argv) < 3):
        print('Usage: python {} <hosts file> <guests file>'.format(sys.argv[0]))
        exit(-1)

    hosts_file = sys.argv[1]
    if not os.path.exists(hosts_file):
        print('Could not find hosts file: {}'.format(hosts_file))
        exit(-1)

    guests_file = sys.argv[2]
    if not os.path.exists(guests_file):
        print('Could not find guests file: {}'.format(guests_file))
        exit(-1)

    question_i = 0

    questions_out = {}
    guest_questions_out = {}

    response_values = []

    guests = []

    hosts = []

    bool_i = 0

    responses_map = dict()

    host_qids = dict()
    guest_qids = dict()

    for q in QUESTIONS:
        host_qids[q] = question_i

        if q in BOOL_Q:
            questions_out[q] = {
                'responseValues': {
                    'Yes': bool_i,
                    'No': (bool_i+1)
                },
                'questionKey': q,
                'id': question_i,
                'text': QUESTIONS_TEXT[q],
                'displayName': QUESTIONS_DISPLAY[q],
                'multiplicity': 'ResponseMultiplicity.ONE'
            }


            responses_map[q] = questions_out[q]['responseValues']

            response_values.append({
                'id': bool_i,
                'text': 'Yes',
                'displayText': 'Yes {}'.format(q)
            })

            response_values.append({
                'id': bool_i+1,
                'text': 'No',
                'displayText': 'No {}'.format(q)
            })

            question_i += 1
            bool_i += 2
            

        elif q in LIST_Q:
            questions_out[q] = {
                'responseValues': {
                    'Yes': bool_i,
                    'No': (bool_i+1)
                },
                'questionKey': q,
                'id': question_i,
                'text': QUESTIONS_TEXT[q],
                'displayName': QUESTIONS_DISPLAY[q],
                'multiplicity': 'ResponseMultiplicity.ONE'
            }
            responses_map[q] = questions_out[q]['responseValues']

            response_values.append({
                'id': bool_i,
                'text': 'Yes',
                'displayText': 'Yes {}'.format(q)
            })

            response_values.append({
                'id': bool_i+1,
                'text': 'No',
                'displayText': 'No {}'.format(q)
            })

            bool_i += 2
            question_i += 1
        else:
            print('skipping host question: {}'.format(q))

    question_i = 0

    for q in GUEST_QUESTIONS:
        
        guest_qids[q] = question_i

        print('- looking at question: {}'.format(q))

        if q in BOOL_Q:
            print('--- type: boolean')
            guest_questions_out[q] = {
                'responseValues': {
                    'Yes': bool_i,
                    'No': (bool_i+1)
                },
                'questionKey': q,
                'id': question_i,
                'text':GUEST_QUESTIONS_TEXT[q],
                'multiplicity': 'ResponseMultiplicity.ONE'
            }
            responses_map[q] = guest_questions_out[q]['responseValues']

            response_values.append({
                'id': bool_i,
                'text': 'Yes',
                'displayText': 'Yes {}'.format(q)
            })

            response_values.append({
                'id': bool_i+1,
                'text': 'No',
                'displayText': 'No {}'.format(q)
            })

            question_i += 1
            bool_i += 2

        elif q in LIST_Q:
            print('--- type: list')
            guest_questions_out[q] = {
                'responseValues': {
                    'Yes': bool_i,
                    'No': (bool_i+1)
                },
                'questionKey': q,
                'id': question_i,
                'text':GUEST_QUESTIONS_TEXT[q],
                'multiplicity': 'ResponseMultiplicity.ONE'
            }

            responses_map[q] = guest_questions_out[q]['responseValues']

            response_values.append({
                'id': bool_i,
                'text': 'Yes',
                'displayText': 'Yes {}'.format(q)
            })

            response_values.append({
                'id': bool_i+1,
                'text': 'No',
                'displayText': 'No {}'.format(q)
            })

            bool_i += 2
            question_i += 1

        else:
            print('--- type: other')
            print('--- ** skipping guest question: {} **'.format(q))

    responses_out = {}

    with open(hosts_file) as f:
        raw_data = f.read()

    data = json.loads(raw_data)

    host_response_data = []

    for i, host in enumerate(data):
        host_responses = {}
        responses = host['attributes']

        try:
            hosts.append({
                'id': int(host['id'][1:]),
                'firstName': responses.get('first_name', ''),
                'middleInitial': responses.get('middle_initial', ''),
                'lastName': responses.get('last_name', ''),
                'dateOfBirth': responses.get('dob', ''),
                'email': responses.get('email', ''),
                'phone': responses.get('phone', ''),
                'address': responses.get('address', ''),
                'employmentInfo': responses.get('employment_info', ''),
                'contactAddress': responses.get('contact_address', ''),
                'name': '{} {}'.format(responses.get('first_name', ''), responses.get('last_name', '')),
                'imageUrl': '/hosthome/img/profile-placeholder.png',
                'petsText': responses.get('pets_text', '') or 'None',
                'drinkingText': responses.get('drinking_text', ''),
                'smokingText': responses.get('smoking_text', ''),
                'substancesText': responses.get('substances_text', ''),
                'householdMembers': responses.get('household_members', []),
                'interests': responses.get('interests', ''),
                'housingType': responses.get('housing_type', ''), 
                'languages': responses.get('languages', ''), 
                'preferredCharacteristics': responses.get('preferred_characteristics', ''),
                'hostingInterest': responses.get('hosting_interest', ''),
                'hostingStrengths': responses.get('hosting_strenghts', ''),
                'hostingChallenges': responses.get('hosting_challenges', ''),
                'hostIntro': responses.get('host_intro', ''),
                'durationOfStay': responses.get('duration_of_stay', ['N/A'])[0],
                'hostingAmount': responses.get('hosting_amount', 1),
                'youthParenting': responses.get('youth_parenting', False),
                'youthRelationship': responses.get('youth_relationship', False)
            })

        except Exception as e:

            print('error for host: {}'.format(responses))
            print('message: {}'.format(e))

        for q in QUESTIONS:

            if q not in responses.keys():
                print('host {} is missing question "{}"'.format(i, q))
                continue

            if q in BOOL_Q:
                if responses[q]:
                    host_responses[q] = questions_out[q]['responseValues']['Yes']

                else:
                    host_responses[q] = questions_out[q]['responseValues']['No']

                host_response_data.append({
                    'hostId': int(host['id'][1:]),
                    'responseValues': [host_responses[q]],
                    'questionId': questions_out[q]['id']
                })

            if q in LIST_Q:
                if responses[q] and responses[q][0]:
                    host_responses[q] = questions_out[q]['responseValues']['Yes']
                else:
                    host_responses[q] = questions_out[q]['responseValues']['No']

                host_response_data.append({
                    'hostId': int(host['id'][1:]),
                    'responseValues': [host_responses[q]],
                    'questionId': questions_out[q]['id']
                })

        responses_out[host['id']] = host_responses

    guest_responses_out = {}

    with open(guests_file) as f:
        raw_data = f.read()

    data = json.loads(raw_data)

    guest_response_data = []

    i = 0

    for guest in data:

        i += 1

        guest_responses = {}
        responses = dict(guest['attributes'])

        try:

            guests.append({
                'id': int(guest['id'][1:]),
                'firstName': responses.get('first_name', ''),
                'middleInitial': responses.get('middle_initial', ''),
                'lastName': responses.get('last_name', ''),
                'dateOfBirth': responses.get('dob', ''),
                'email': responses.get('email', ''),
                'guestIntro': responses.get('guest_intro', ''),
                'guestChallenges': responses.get('guest_challenges', ''),
                'employmentInfo': responses.get('employment_info', ''),
                'guestStayStatement': responses.get('guest_stay_statement', ''),
                'name': '{} {}'.format(responses.get('first_name', ''), responses.get('last_name', '')),
                'imageUrl': '/hosthome/img/profile-placeholder.png',
                'petsText': responses.get('pets_text', '') or 'None',
                'drinkingText': responses.get('drinking_text', ''),
                'smokingText': responses.get('smoking_text', ''),
                'substancesText': responses.get('substances_text', '')
            })

        except KeyError as e:

            print('kererror on "{}" for record: {}'.format(e, guest))

        for q in GUEST_QUESTIONS:

            if q not in responses.keys():
                print('guest {} is missing question "{}"'.format(i, q))
                continue

            if q in BOOL_Q:
                if responses[q]:
                    guest_responses[q] = guest_questions_out[q]['responseValues']['Yes']

                else:
                    guest_responses[q] = guest_questions_out[q]['responseValues']['No']

                guest_response_data.append({
                    'guestId': int(guest['id'][1:]),
                    'responseValues': [guest_responses[q]],
                    'questionId': guest_questions_out[q]['id']
                })

            if q in LIST_Q:
                if responses[q] and responses[q][0]:
                    guest_responses[q] = guest_questions_out[q]['responseValues']['Yes']
                else:
                    guest_responses[q] = guest_questions_out[q]['responseValues']['No']

                guest_response_data.append({
                    'guestId': int(guest['id'][1:]),
                    'responseValues': [guest_responses[q]],
                    'questionId': guest_questions_out[q]['id']
                })

        guest_responses_out[guest['id']] = guest_responses



    output_path = os.path.join(os.getcwd(), OUTPUT_DIR)
    if not os.path.exists(output_path):
        os.mkdir(output_path)

    with open(os.path.join(output_path, 'questions.json'), 'w') as f:
        json.dump(questions_out, f, indent=4)
    with open(os.path.join(output_path, 'guest_questions_out.json'), 'w') as f:
        json.dump(guest_questions_out, f, indent=4)
    with open(os.path.join(output_path, 'responses_out.json'), 'w') as f:
        json.dump(responses_out, f, indent=4)
    with open(os.path.join(output_path, 'guest_responses_out.json'), 'w') as f:
        json.dump(guest_responses_out, f, indent=4)
    with open(os.path.join(output_path, 'host_response_data.json'), 'w') as f:
        json.dump(host_response_data, f, indent=4)
    with open(os.path.join(output_path, 'guest_response_data.json'), 'w') as f:
        json.dump(guest_response_data, f, indent=4)
    with open(os.path.join(output_path, 'response_values.json'), 'w') as f:
        json.dump(response_values, f, indent=4)
    with open(os.path.join(output_path, 'guests.json'), 'w') as f:
        json.dump(guests, f, indent=4)


    restriction_list = list()

    for r in RESTRICTIONS.keys():
        if r not in responses_map.keys() or RESTRICTIONS[r] not in responses_map.keys():
            print('missing restriction question: \n\tguest: {}\n\thost: {}'.format(r, RESTRICTIONS[r]))
            continue
        restriction_list.append({
            'hostQuestionId': host_qids[RESTRICTIONS[r]],
            'guestQuestionId': guest_qids[r],
            'reasonText': 'Yes {} no {}'.format(RESTRICTIONS[r], r),
            'hostResponseValue': responses_map[RESTRICTIONS[r]]['Yes'],
            'guestResponseValue': responses_map[r]['No']
        })

    with open(os.path.join(output_path, 'data-full.json'), 'w') as f:
        json.dump({
            'guests': guests,
            'hosts': hosts,
            'guestQuestions': [{
                'responseValues': list(x['responseValues'].values()),
                'questionKey': x['questionKey'],
                'id': x['id'],
                'text': x['text'],
                'multiplicity': 'ResponseMultiplicity.ONE'
            } for x in list(guest_questions_out.values())],
            'hostQuestions': [{
                'responseValues': list(x['responseValues'].values()),
                'questionKey': x['questionKey'],
                'id': x['id'],
                'text': x['text'],
                'displayName': x['displayName'],
                'multiplicity': 'ResponseMultiplicity.ONE'
            } for x in list(questions_out.values())],
            'responseValues': response_values,
            'hostResponses': host_response_data,
            'guestResponses': guest_response_data,
            'restrictions': restriction_list,
            # 'restrictions': [
            #     {
            #         'hostQuestionId': 0,
            #         'guestQuestionId': 4,
            #         'reasonText': 'No smoking is allowed',
            #         'hostResponseValue': 1,
            #         'guestResponseValue': 26
            #     },
            #     {
            #         'hostQuestionId': 1,
            #         'guestQuestionId': 4,
            #         'reasonText': 'Guest prefers non-smoking home',
            #         'hostResponseValue': 2,
            #         'guestResponseValue': 26
            #     },
            #     {
            #         'hostQuestionId': 6,
            #         'guestQuestionId': 0,
            #         'reasonText': 'Host does not allow pets',
            #         'hostResponseValue': 13,
            #         'guestResponseValue': 18
            #     },
            #     {
            #         'hostQuestionId': 5,
            #         'guestQuestionId': 1,
            #         'reasonText': 'Guest does not want to live with pets',
            #         'hostResponseValue': 10,
            #         'guestResponseValue': 21
            #     },
            #     {
            #         'hostQuestionId': 7,
            #         'guestQuestionId': 11,
            #         'reasonText': 'Host does not allow guests who are parenting',
            #         'hostResponseValue': 15,
            #         'guestResponseValue': 40
            #     },
            #     {
            #         'hostQuestionId': 1,
            #         'guestQuestionId': 9,
            #         'reasonText': 'Host does not allow guests who drink',
            #         'hostResponseValue': 3,
            #         'guestResponseValue': 36
            #     },
            # ],
            "matchResults": []
        }, f, indent=4)


if __name__ == '__main__':
    main()
