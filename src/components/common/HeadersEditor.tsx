import { Box, TextField, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { Header } from '../../types/commonTypes';

interface HeadersEditorParams {
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
}

const defaultHeaders = [
  { key: 'Content-Type', value: 'application/json', enabled: true },
  { key: 'Accept', value: 'application/json', enabled: true },
];

const HeadersEditor = ({ headers, setHeaders }: HeadersEditorParams) => {
  useEffect(() => {
    if (headers.length === 0) {
      setHeaders([...defaultHeaders, { key: '', value: '', enabled: true }]);
    }
  }, [setHeaders, headers.length]);

  const handleChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const handleToggle = (index: number) => {
    const updated = [...headers];
    updated[index].enabled = !updated[index].enabled;
    setHeaders(updated);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index: number) => {
    const updated = headers.filter((_, i) => i !== index);
    setHeaders(updated);
  };

  // Always have one empty header row at the end
  useEffect(() => {
    const last = headers[headers.length - 1];
    if (last && (last.key !== '' || last.value !== '')) {
      setHeaders([...headers, { key: '', value: '', enabled: true }]);
    }
  }, [headers, setHeaders]);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {headers.map((header, index) => (
        <Box key={index} display="flex" gap={1} alignItems="center">
          <FormControlLabel
            control={<Checkbox checked={header.enabled !== false} onChange={() => handleToggle(index)} />}
            label=""
          />
          <TextField
            label="Header"
            size="small"
            value={header.key}
            onChange={(e) => handleChange(index, 'key', e.target.value)}
            fullWidth
          />
          <TextField
            label="Value"
            size="small"
            value={header.value}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
            fullWidth
          />
          <IconButton onClick={() => removeHeader(index)} size="small" disabled={index < 2}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={addHeader} size="small">
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default HeadersEditor;
