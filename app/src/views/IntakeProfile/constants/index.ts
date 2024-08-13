import {faker} from '@faker-js/faker';
import {array, object, string, date} from 'yup';
import {InitialValues} from '..';
import {
  FieldGroup,
  Fields,
  fieldTypes,
  FieldTypes,
  Response,
} from '../../../services/profile';
import {format} from 'date-fns';

export const fieldGroupBuilder = (
  options: Partial<FieldGroup> = {},
): FieldGroup => ({
  id: faker.string.numeric(4),
  title: faker.lorem.sentence({min: 2, max: 4}),
  fields: [],
  ...options,
});

export const fieldBuilder = (options: Partial<Fields> = {}): Fields => ({
  id: faker.string.numeric(4),
  title: faker.lorem.sentence({min: 5, max: 10}),
  type: faker.helpers.arrayElement(fieldTypes),
  ...options,
  properties: {
    ...options.properties,
  },
  validations: {
    ...options.validations,
  },
});

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

/**
 * Creates a validation schema for Formik based on field type
 * It takes the form of:
 * {
 *  fieldGroupId: {
 *     fieldId: validationSchema
 *  }
 * }
 */

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const typeValidations = {
  short_text: string(),
  long_text: string(),
  number: string().matches(phoneRegExp, 'phone number is not valid'),
  email: string().email('Must be a valid email address'),
  yes_no: string(),
  dropdown: string(),
  additional_guests: array().of(
    object().shape({
      name: string().required('Name is required'),
      dob: date()
        .transform(function (value, originalValue) {
          if (this.isType(value)) {
            return format(originalValue, 'P');
          }
          return originalValue;
        })
        .typeError('DOB is required')
        .required('DOB is required'),
      relationship: string().required('Relationship is required'),
    }),
  ),
  // array of strings of the type of pets
  pets: array().of(
    object().shape({
      type: string().required('Type of pet is required'),
    }),
  ),
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const merge = (...schemas) => {
  const [first, ...rest] = schemas;

  const merged = rest.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    first,
  );

  return merged;
};

const createFieldValidationSchema = ({type, validations}: Fields) => {
  if (!typeValidations[type]) {
    console.error(
      `No schema exists in typeValidations hashmap in IntakeProfile/constants/index.ts for type: ${type}`,
    );
  }

  let schema = typeValidations[type];

  if (validations.required) {
    // only works for string types at the moment
    schema = merge(schema, string().required('This field is required'));
  }

  if (validations.required_if) {
    const {field_id, value} = validations.required_if;
    // only works for string types at the moment
    const requiedIfSchema = string().when(field_id, {
      is: value,
      then: schema => schema.required('This field is required'),
      otherwise: schema => schema,
    });
    schema = merge(schema, requiedIfSchema);
  }

  return schema;
};

export const buildValidationSchema = (
  fieldGroup: FieldGroup[],
  groupId: string | undefined,
) => {
  if (groupId === undefined) {
    console.error('Invalid groupId');
    return object().shape({});
  }

  const fields = fieldGroup.find(group => group.id === groupId)?.fields || [];

  const schema = object().shape(
    fields.reduce((acc, field) => {
      return {
        ...acc,
        [field.id]: createFieldValidationSchema(field),
      };
    }, {}),
  );

  return object().shape({
    [groupId]: object().shape({...schema.fields}),
  });
};
