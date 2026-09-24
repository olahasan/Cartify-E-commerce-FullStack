import styles from "../FormSection.module.css";
const { errorMessage } = styles;
import { Form } from "react-bootstrap";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
type InputProps<TFieldValue extends FieldValues> = {
  label?: string;
  placeholder?: string;
  name: Path<TFieldValue>;
  type?: string;
  hideLabel?: boolean;
  register: UseFormRegister<TFieldValue>;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  formText?: string;
  success?: string;
  disabled?: boolean;
  className?: string;
};

const Input = <TFieldValue extends FieldValues>({
  label,
  placeholder,
  name,
  type = "text",
  hideLabel,
  register,
  error,
  onBlur,
  formText,
  success,
  disabled,
  className,
}: InputProps<TFieldValue>) => {
  const field = register(name);
  const onblurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);
      field.onBlur(e);
    } else {
      field.onBlur(e);
    }
  };
  return (
    <Form.Group className="mb-3">
      {!hideLabel && label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type}
        placeholder={placeholder}
        {...field}
        onBlur={onblurHandler}
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

export default Input;
