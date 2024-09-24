import React from 'react';
import {DatePicker} from '@mui/x-date-pickers';
import {parseISO} from 'date-fns';

interface DatePickerFieldProps {
  error: string | undefined;
  handleChange: (
    name: string,
    value: string | null,
    shouldValidate?: boolean,
  ) => void;
  name: string;
  value: string | null;
}

export const DatePickerField = ({
  name,
  value,
  handleChange,
  error,
}: DatePickerFieldProps) => {
  return (
    <DatePicker
      disableFuture
      format="MM/dd/yyyy"
      label="Date of birth"
      name={name}
      onChange={value => {
        let newDate = null;

        if (value !== null && !isNaN(+value)) {
          newDate = value.toISOString();
        }

        handleChange(name, newDate, true);
      }}
      slotProps={{
        textField: {
          error: Boolean(error),
          helperText: error,
        },
      }}
      value={value !== null ? parseISO(value) : null}
      views={['month', 'day', 'year']}
    />
  );
};
