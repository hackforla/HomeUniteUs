import {InitialValues} from '../IntakeProfile';
import {FieldGroup, FieldTypes, Response} from '../../../services/profile';

/**
 * Creates an object used for the initial Formik valiues
 * It takes the form of:
 * {
 *  fieldGroupId: {
 *     fieldId: responseValue
 *  }
 * }
 */
const fieldDefaultValue = (fieldType: FieldTypes) => {
  switch (fieldType) {
    case 'short_text':
      return '';
    case 'long_text':
      return '';
    case 'dropdown':
      return '';
    case 'number':
      return '';
    case 'additional_guests':
      return [];
    case 'email':
      return '';
    case 'yes_no':
      return '';
    case 'pets':
      return [];
    default:
      return '';
  }
};

export const createInitialValues = (
  fieldGroups: FieldGroup[],
  responses: Response[],
): InitialValues => {
  return fieldGroups.reduce((acc: InitialValues, fieldGroup) => {
    const fields = fieldGroup.fields.reduce((acc, field) => {
      return {
        ...acc,
        [field.id]:
          responses.find(response => response.fieldId === field.id)?.value ||
          fieldDefaultValue(field.type),
      };
    }, {});

    return {
      ...acc,
      [fieldGroup.id]: {...fields},
    };
  }, {});
};
