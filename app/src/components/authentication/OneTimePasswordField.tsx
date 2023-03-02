import {Stack, TextField} from '@mui/material';
import React, {useEffect} from 'react';

export const OneTimePasswordField = () => {
  const [otpCode, setOtpCode] = React.useState<string[]>(new Array(6).fill(''));
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  // Ref to the input element
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Ref to the current index. This is necessary to stop the on change event from firing when deleting a value
  const currentOTPIndex = React.useRef<number>(0);

  // When active index updates focus on the input
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeIndex]);

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {value} = event.currentTarget;
    if (value !== '' && new RegExp(/^\d+$/).test(value) === false) return;

    const otpCodeCopy = [...otpCode];

    otpCodeCopy[currentOTPIndex.current] = value.substring(value.length - 1);

    setOtpCode(otpCodeCopy);

    if (!value) {
      setActiveIndex(currentOTPIndex.current - 1);
    } else {
      setActiveIndex(
        currentOTPIndex.current < otpCode.length - 1
          ? currentOTPIndex.current + 1
          : currentOTPIndex.current,
      );
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    currentOTPIndex.current = index;
    if (event.key === 'Backspace') {
      setActiveIndex(index - 1);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setSelectionRange(0, 1);
  };

  return (
    <Stack direction="row" gap={2}>
      {otpCode.map((value, index) => {
        return (
          <TextField
            placeholder="-"
            inputMode="numeric"
            inputRef={index === activeIndex ? inputRef : null}
            variant="outlined"
            key={index}
            value={value}
            onChange={handleChange}
            onKeyDown={e => handleKeyDown(e, index)}
            onFocus={handleFocus}
          />
        );
      })}
    </Stack>
  );
};
