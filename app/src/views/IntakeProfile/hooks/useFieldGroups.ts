import {faker} from '@faker-js/faker';
import {useEffect, useState} from 'react';
import {fieldBuilder, fieldGroupBuilder} from '../constants';
import {Answer, FieldGroup} from 'src/services/profile';

interface UseFieldGroups {
  profileId: string;
}

/**
 * Generates field groups and answers for a given profile id
 */

export const useFieldGroups = ({profileId}: UseFieldGroups) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [fieldGroups, setFieldGroups] = useState<FieldGroup[]>([]);

  useEffect(() => {
    if (profileId) {
      const fieldGroups = Array.from(Array(3), () => {
        const fields = Array.from(Array(3), () => {
          const field = fieldBuilder();

          if (field.type === 'multiple_choice' || field.type === 'dropdown') {
            field.properties.choices = [
              {
                id: faker.string.uuid(),
                label: 'choice 1',
              },
              {
                id: faker.string.uuid(),
                label: 'choice 2',
              },
              {
                id: faker.string.uuid(),
                label: 'choice 3',
              },
            ];

            field.validations.required = true;
          }

          return field;
        });
        return fieldGroupBuilder({fields});
      });

      setFieldGroups(fieldGroups);

      const answersArr = fieldGroups
        .map(fieldGroup => fieldGroup.fields)
        .flat()
        .map(field => {
          let value;
          if (field.type === 'yes_no') {
            //yes or no
            value = faker.helpers.arrayElement(['unanswered', 'yes', 'no']);
          }

          if (field.type === 'short_text') {
            //short text
            value = faker.lorem.sentence();
          }

          if (field.type === 'long_text') {
            //long text
            value = faker.lorem.paragraph();
          }

          if (field.type === 'number') {
            //number
            value = faker.phone.number();
          }

          if (field.type === 'email') {
            //email
            value = faker.internet.email();
          }

          if (field.type === 'dropdown' || field.type === 'multiple_choice') {
            //dropdown or multiple choice
            value = faker.helpers.arrayElement(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              field.properties.choices.map(choice => choice.label),
            );
          }

          if (field.type === 'additional_guests') {
            value = [
              {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                dob: faker.date.birthdate().toString(),
                relationship: faker.helpers.arrayElement([
                  'mom',
                  'dad',
                  'sibling',
                  'friend',
                  'partner',
                ]),
              },
            ];
          }

          return {
            id: faker.string.uuid(),
            fieldId: field.id,
            value,
          };
        });
      setAnswers(answersArr);
    }
  }, [profileId]);

  return {answers, fieldGroups};
};
