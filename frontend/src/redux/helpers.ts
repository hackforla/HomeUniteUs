// interface ApiError {
//   data: {
//     detail: any;
//     message: string;
//     code: string;
//   };
//   status: string;
// }

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is ApiError {
  return typeof error === 'object' && error != null && 'status' in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error: unknown): error is {message: string} {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (error as any).message === 'string'
  );
}

export function getErrorMessage(err: unknown): string {
  if (isFetchBaseQueryError(err)) {
    // you can access all properties of `FetchBaseQueryError` here
    console.log('helpers.ts', err);
    const errMsg = err.data?.message || 'An unexpected error occurred.';
    return errMsg;
  }

  if (isErrorWithMessage(err)) {
    // you can access a string 'message' property here
    return err.message;
  }

  return JSON.stringify(err);
}
