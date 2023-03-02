import {OutlinedInput, Stack} from '@mui/material';
import React, {useEffect} from 'react';

export const OneTimePasswordField = () => {
  const [otpCode, setOtpCode] = React.useState<string[]>(new Array(6).fill(''));
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  // Ref to the input element
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Ref to the current index. This is necessary to sync the active index with the input value when the user presses backspace
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
      if (currentOTPIndex.current < otpCode.length - 1) {
        setActiveIndex(currentOTPIndex.current + 1);
      } else {
        setActiveIndex(currentOTPIndex.current);
      }
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    // syncs current index with the active index on keypress
    currentOTPIndex.current = index;

    if (event.key === 'Backspace') {
      // If the last input cotains a value, delete the value and keep focus on the input
      if (activeIndex === otpCode.length - 1) {
        setOtpCode(otpCode.map((val, i) => (i === index ? '' : val)));
      }

      // If the input is empty and the user presses backspace, delete the number from the previous input and focus on the previous input
      if (otpCode[index] === '' && index > 0) {
        setActiveIndex(index - 1);
        setOtpCode(otpCode.map((val, i) => (i === index - 1 ? '' : val)));
      }
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setSelectionRange(0, 1);
  };

  return (
    <Stack direction="row" gap={2}>
      {otpCode.map((value, index) => {
        return (
          <OutlinedInput
            placeholder="-"
            inputMode="numeric"
            inputRef={index === activeIndex ? inputRef : null}
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
