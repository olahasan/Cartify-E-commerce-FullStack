import styles from "../FormSection.module.css";
const { errorMessage } = styles;
import { Form } from "react-bootstrap";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputProps<TFieldValue extends FieldValues> = {
  label?: string;
  placeholder?: string;
  name: Path<TFieldValue>;
  hideLabel?: boolean;
  register: UseFormRegister<TFieldValue>;
  error?: string;
  formText?: string;
  success?: string;
  disabled?: boolean;
  className?: string;
};

const TextArea = <TFieldValue extends FieldValues>({
  label,
  placeholder,
  name,
  hideLabel,
  register,
  error,
  formText,
  success,
  disabled,
  className,
}: InputProps<TFieldValue>) => {
  return (
    <Form.Group className="mb-3">
      {!hideLabel && label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        as="textarea"
        rows={5}
        placeholder={placeholder}
        {...register(name)}
        isInvalid={!!error}
        isValid={!!success}
        disabled={disabled}
        className={className}
      />
      <Form.Control.Feedback type="invalid" className={errorMessage}>
        {error}
      </Form.Control.Feedback>
      <Form.Control.Feedback type="valid">{success}</Form.Control.Feedback>
      {formText && <Form.Text muted>{formText}</Form.Text>}
    </Form.Group>
  );
};

export default TextArea;
