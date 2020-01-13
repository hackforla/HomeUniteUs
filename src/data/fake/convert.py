import os
import json

# Mammals

# A rabbit

# A hedgehog with albinism

# A Labrador being petted

# Sharing a bed with a Yorkshire terrier

# A Göttingen minipig
# Alpacas
# Camels
# Cats
# Cattle
# Domestic skunks
# Dogs
# Donkeys
# Ferrets
# Goats
# Hedgehogs
# Horses
# Llamas
# Pigs
# Rabbits
# Red foxes
# Rodents, including rats, mice, hamsters, guinea pigs, gerbils, and chinchillas
# Sheep
# Sugar gliders
# Birds

# A chicken

# An Oscar
# Companion parrots, like the budgie and cockatiel.
# Fowl, such as chickens, turkeys, ducks, geese and quails
# Columbines
# Passerines, namely finches and canaries
# Fish
# Goldfish
# Koi
# Siamese fighting fish (Betta)
# Barb
# Guppy
# Molly
# Mosquitofish
# Oscar
# Arthropods
# Bees
# Silk moth


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
]

QUESTIONS = [
    'smoking_allowed',
    'drinking_residents',
    'drinking_concerns',
    'substance_residents',
    'substance_concerns',
    'host_type',
    'hosting_amount',
    'pets_hosting',
    'pet_restrictions',
    'youth_parenting',
    'youth_relationship',
]

BOOL_Q = [
    'smoking_allowed',
    'drinking_residents',
    'substance_residents',
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
    'guests_relationship'
    'smoking_household_acceptable',
    'drinking_guest',
    'mental_illness_care',
    'parenting_guest',
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


def main():

    question_i = 0

    questions_out = {}
    guest_questions_out = {}

    response_values = []

    guests = []

    hosts = []

    bool_i = 0

    for q in QUESTIONS:

        if q in BOOL_Q:
            questions_out[q] = {
                'responseValues': {
                    'Yes': bool_i,
                    'No': (bool_i+1)
                },
                'questionKey': q,
                'id': question_i,
                'multiplicity': 'ResponseMultiplicity.ONE'
            }

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

        if q in LIST_Q:
            questions_out[q] = {
                'responseValues': {
                    'Yes': bool_i,
                    'No': (bool_i+1)
                },
                'questionKey': q,
                'id': question_i,
                'multiplicity': 'ResponseMultiplicity.ONE'
            }

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

    question_i = 0

    for q in GUEST_QUESTIONS:

        if q in BOOL_Q:
            guest_questions_out[q] = {
                'responseValues': {
                    'Yes': bool_i,
                    'No': (bool_i+1)
                },
                'questionKey': q,
                'id': question_i,
                'multiplicity': 'ResponseMultiplicity.ONE'
            }

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

        if q in LIST_Q:
            guest_questions_out[q] = {
                'responseValues': {
                    'Yes': bool_i,
                    'No': (bool_i+1)
                },
                'questionKey': q,
                'id': question_i,
                'multiplicity': 'ResponseMultiplicity.ONE'
            }

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

    responses_out = {}

    with open('hosts.json') as f:
        raw_data = f.read()

    data = json.loads(raw_data)

    host_response_data = []

    for host in data:
        host_responses = {}
        responses = host['attributes']

        hosts.append({
            'id': int(host['id']),
            'firstName': responses['first_name'],
            'middleInitial': responses['middle_initial'],
            'lastName': responses['last_name'],
            'dateOfBirth': responses['dob'],
            'email': responses['email'],
            'phone': responses['phone'],
            'address': responses['address'],
            'employmentInfo': responses['employment_info'],
            'contactAddress': responses['contact_address'],
            'name': '{} {}'.format(responses['first_name'], responses['last_name']),
            'imageUrl': '/hosthome/img/profile-placeholder.png'
        })

        for q in QUESTIONS:
            if q in BOOL_Q:
                if responses[q]:
                    host_responses[q] = questions_out[q]['responseValues']['Yes']

                else:
                    host_responses[q] = questions_out[q]['responseValues']['No']

                host_response_data.append({
                    'hostId': int(host['id']),
                    'responseValues': [host_responses[q]],
                    'questionId': questions_out[q]['id']
                })

            if q in LIST_Q:
                if responses[q] and responses[q][0]:
                    host_responses[q] = questions_out[q]['responseValues']['Yes']
                else:
                    host_responses[q] = questions_out[q]['responseValues']['No']

                host_response_data.append({
                    'hostId': int(host['id']),
                    'responseValues': [host_responses[q]],
                    'questionId': questions_out[q]['id']
                })

        responses_out[host['id']] = host_responses

    guest_responses_out = {}

    with open('fakeguests.json') as f:
        raw_data = f.read()

    data = json.loads(raw_data)

    guest_response_data = []

    i = 0

    for guest in data:

        i += 1

        guest_responses = {}
        responses = dict(guest['attributes'])

        guests.append({
            'id': int(guest['ID'][1:]),
            'firstName': responses['first_name'],
            'middleInitial': responses['middle_initial'],
            'lastName': responses['last_name'],
            'dateOfBirth': responses['dob'],
            'email': responses['email'],
            'guestIntro': responses['guest_intro'],
            'guestChallenges': responses['guest_challenges'],
            'employmentInfo': responses['employment_info'],
            'guestStayStatement': responses['guest_stay_statement'],
            'name': '{} {}'.format(responses['first_name'], responses['last_name']),
            'imageUrl': '/hosthome/img/profile-placeholder.png'
        })

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
                    'guestId': int(guest['ID'][1:]),
                    'responseValues': [guest_responses[q]],
                    'questionId': guest_questions_out[q]['id']
                })

            if q in LIST_Q:
                if responses[q] and responses[q][0]:
                    guest_responses[q] = guest_questions_out[q]['responseValues']['Yes']
                else:
                    guest_responses[q] = guest_questions_out[q]['responseValues']['No']

                guest_response_data.append({
                    'guestId': int(guest['ID'][1:]),
                    'responseValues': [guest_responses[q]],
                    'questionId': guest_questions_out[q]['id']
                })

        guest_responses_out[guest['ID']] = guest_responses

    with open('questions.json', 'w') as f:
        json.dump(questions_out, f, indent=4)
    with open('guest_questions_out.json', 'w') as f:
        json.dump(guest_questions_out, f, indent=4)
    with open('responses_out.json', 'w') as f:
        json.dump(responses_out, f, indent=4)
    with open('guest_responses_out.json', 'w') as f:
        json.dump(guest_responses_out, f, indent=4)
    with open('host_response_data.json', 'w') as f:
        json.dump(host_response_data, f, indent=4)
    with open('guest_response_data.json', 'w') as f:
        json.dump(guest_response_data, f, indent=4)
    with open('response_values.json', 'w') as f:
        json.dump(response_values, f, indent=4)
    with open('guests.json', 'w') as f:
        json.dump(guests, f, indent=4)


    

    with open('data-full.json', 'w') as f:
        json.dump({
            'guests': guests,
            'hosts': hosts,
            'guestQuestions': [ {
                'responseValues': list(x['responseValues'].values()),
                'questionKey': x['questionKey'],
                'id': x['id'],
                'multiplicity': 'ResponseMultiplicity.ONE'
            } for x in list(guest_questions_out.values())],
            'hostQuestions': [ {
                'responseValues': list(x['responseValues'].values()),
                'questionKey': x['questionKey'],
                'id': x['id'],
                'multiplicity': 'ResponseMultiplicity.ONE'
            } for x in list(questions_out.values())],
            'responseValues': response_values,
            'hostResponses': host_response_data,
            'guestResponses': guest_response_data,
            "restrictions": [],
            "matchResults": []
        }, f, indent=4)


if __name__ == '__main__':
    main()
