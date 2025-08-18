// src/components/forms/InputField.tsx
import { Form } from 'react-bootstrap';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface Props extends React.ComponentProps<'input'> {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
}

export default function InputField({ label, register, error, ...rest }: Props) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control {...register} {...rest} isInvalid={!!error} />
      {error && <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>}
    </Form.Group>
  );
}
