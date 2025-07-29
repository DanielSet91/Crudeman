import { Select, MenuItem } from '@mui/material';
import { METHODS } from '../../common/constants';

type HttpMethod = (typeof METHODS)[number];

interface MethodSelectProps {
  value: HttpMethod;
  onChange: (value: HttpMethod) => void;
}

const MethodSelect = ({ value, onChange }: MethodSelectProps) => (
  <Select value={value} onChange={(e) => onChange(e.target.value as HttpMethod)} size="small">
    {METHODS.map((method) => (
      <MenuItem key={method} value={method}>
        {method}
      </MenuItem>
    ))}
  </Select>
);

export default MethodSelect;
