import { Alert } from 'react-bootstrap';
import type { ApiError } from '../../api/types';
import { JSX } from 'react/jsx-runtime';

interface RtkQueryErrorShape {
  data?: ApiError;
  status?: number | string;
}

export interface ApiErrorAlertProps {
  error: unknown;
}

/**
 * Renders the ApiError payload shape returned by the backend's
 * GlobalExceptionHandler ({ message, fieldErrors: { field: message } }).
 */
export default function ApiErrorAlert({ error }: ApiErrorAlertProps): JSX.Element | null {
  if (!error) return null;

  const data = (error as RtkQueryErrorShape).data;
  if (!data) {
    return <Alert variant="danger">Something went wrong. Please try again.</Alert>;
  }

  return (
    <Alert variant="danger">
      <div>{data.message || 'Please fix the errors below.'}</div>
      {data.fieldErrors && (
        <ul className="mb-0 mt-2">
          {Object.entries(data.fieldErrors).map(([field, message]) => (
            <li key={field}><strong>{field}</strong>: {message}</li>
          ))}
        </ul>
      )}
    </Alert>
  );
}
