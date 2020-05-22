import os
import json
import itertools

########################
# Data
########################


entities = [
    'hosts',
    'guests',
    'guestResponses',
    'hostResponses',
    'guestQuestions',
    'hostQuestions',
    'restrictions',
    'responseValues'
]

# Data helpers

def load_from_json_file(fpath):
    result = None

    try:
        with open(fpath) as f:
            result = json.load(f)
    except Exception as e:
        print(f'load_from_json_file: {e}')

    return result
            
def write_to_json_file(name, data):

    try:
        with open(f'{name}.json', 'w') as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f'write_to_json_file: {e}')

# Load all collections

# Tyler 5/21/2020: use this for local testing from flat file
# data = {x: load_from_json_file(os.path.join(os.getcwd(), '..', 'data', f'{x}.json')) for x in entities}



# reshape data for fast access to responses by question ID


class BasicFilter:
    
    def __init__(self, repos):
        self.repos = repos

    def get_all_match_results(self):

        data = {
            'hosts': self.repos['hosts'].get(),
            'guests': self.repos['guests'].get(),
            'guestResponses': self.repos['guestResponses'].get(),
            'hostResponses': self.repos['hostResponses'].get(),
            'guestQuestions': self.repos['guestQuestions'].get(),
            'hostQuestions': self.repos['hostQuestions'].get(),
            'restrictions': self.repos['restrictions'].get(),
            'responseValues': self.repos['responseValues'].get()
        }

        guest_response_map = {
            q['id']: [
                {
                    'id': gr['guestId'],
                    'values': gr['responseValues']
                } for gr in data['guestResponses'] if gr['questionId'] == q['id']
            ] for q in data['guestQuestions']
        }

        host_response_map = {
            q['id']: [
                {
                    'id': gr['hostId'],
                    'values': gr['responseValues']
                } for gr in data['hostResponses'] if gr['questionId'] == q['id']
            ] for q in data['hostQuestions']
        }

        restricted_pairs = {}

        for r in data['restrictions']:

            print(f'- looking at restriction: {dict(r)}')

            host_responses = host_response_map[r['hostQuestionId']]
            guest_responses = guest_response_map[r['guestQuestionId']]

            restricted = [
                (
                    (h['id'],g['id']), 
                    r
                ) for h in host_responses if r['hostResponseValue'] in h['values'] for g in guest_responses if r['guestResponseValue'] in g['values']]

            for pair, restriction in restricted:
                if pair not in restricted_pairs.keys():
                    restricted_pairs[pair] = list()
                restricted_pairs[pair].append(restriction)

        match_results = [
            {
                'hostId': pair[0],
                'guestId': pair[1],
                'restrictionsFailed': restrictions_failed,
                'guestInterestLevel': 'Unknown',
                'lastInterestUpdate': None
                
            } for pair, restrictions_failed in restricted_pairs.items()
        ]

        return match_results