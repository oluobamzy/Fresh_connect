import { TextField } from '@mui/material';

export default function FormInput({ label, value, onChange, type = 'text', ...props }) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      fullWidth
      margin="normal"
      {...props}
    />
  );
}
