import {Response} from 'src/services/profile';
import {InitialValues} from '../ProfileSection';

interface UpdateResponses {
  responses: Response[];
  values: InitialValues;
  sectionId: string;
}

export const updateResponses = ({
  responses,
  values,
  sectionId,
}: UpdateResponses) => {
  return Object.entries(values[sectionId]).map(([fieldId, value]) => {
    const response = responses.find(response => response.fieldId === fieldId);
    if (response) {
      response.value = value;
      return response;
    } else {
      return {
        fieldId,
        value,
      };
    }
  });
};
