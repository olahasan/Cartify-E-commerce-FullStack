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
  const onblurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);
      register(name).onBlur(e);
    } else {
      register(name).onBlur(e);
    }
  };
  return (
    <Form.Group className="mb-3">
      {!hideLabel && label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type}
        placeholder={placeholder}
        {...register(name)}
        onBlur={onblurHandler}
        isInvalid={error ? true : false}
        isValid={success ? true : false}
        disabled={disabled}
        className={className}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      <Form.Control.Feedback type="valid">{success}</Form.Control.Feedback>
      {formText && <Form.Text muted>{formText}</Form.Text>}
    </Form.Group>
  );
};

export default Input;
