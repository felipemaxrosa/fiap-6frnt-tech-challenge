export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}
