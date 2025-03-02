import {FieldGroup, FieldTypes, Response} from '../../../services/profile';
import {InitialValues} from '../IntakeProfile';

/**
 * Creates an object used for the initial Formik values
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
    case 'multiple_choice':
      return [];
    case 'contact_method':
      return '';
    default:
      return '';
  }
};

export const createInitialValues = (
  fieldGroups: FieldGroup[] | undefined,
  responses: Response[] | undefined,
): InitialValues => {
  // Early return if fieldGroups is undefined or empty
  if (!fieldGroups || fieldGroups.length === 0) {
    return {};
  }

  // Use empty array if responses is undefined
  const safeResponses = responses || [];

  return fieldGroups.reduce((acc: InitialValues, fieldGroup) => {
    // Skip groups without fields
    if (!fieldGroup.fields || fieldGroup.fields.length === 0) {
      return acc;
    }

    const fields = fieldGroup.fields.reduce((fieldAcc, field) => {
      return {
        ...fieldAcc,
        [field.id]:
          safeResponses.find(response => response.fieldId === field.id)
            ?.value || fieldDefaultValue(field.type),
      };
    }, {});

    return {
      ...acc,
      [fieldGroup.id]: {...fields},
    };
  }, {});
};
