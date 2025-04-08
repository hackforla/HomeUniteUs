import {InitialValues} from '../../../pages/intake-profile/IntakeProfile';
import {FieldGroup, FieldTypes, Response} from '../../../services/profile';

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
    case 'multiple_choice':
      return [];
    case 'contact_method':
      return '';
    case 'pets':
      return [];
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

export const createInitialValuesForSection = (
  group: FieldGroup,
  responses: Response[],
): InitialValues => {
  return {
    [group.id]: group.fields.reduce((acc, field) => {
      return {
        ...acc,
        [field.id]:
          responses.find(response => response.fieldId === field.id)?.value ||
          fieldDefaultValue(field.type),
      };
    }, {}),
  };
};
