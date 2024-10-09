import { FC, ChangeEvent } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface FormFieldProps extends Omit<TextFieldProps, 'onChange'> {
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FormField: FC<FormFieldProps> = ({ name, onChange, ...props }) => (
  <TextField
    fullWidth
    name={name}
    onChange={onChange}
    {...props}
  />
);