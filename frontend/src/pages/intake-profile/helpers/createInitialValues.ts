import {FieldGroup, FieldTypes, Response} from '../../../services/profile';
import {InitialValues} from '../IntakeProfile';

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
    case 'additional_guests':
      return [];
    case 'date':
      return null;
    case 'dropdown':
      return '';
    case 'email':
      return '';
    case 'long_text':
      return '';
    case 'number':
      return '';
    case 'pets':
      return [];
    case 'short_text':
      return '';
    case 'yes_no':
      return '';
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
