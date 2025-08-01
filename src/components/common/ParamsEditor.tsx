import { useEffect } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Param } from '../../types/commonTypes';
import { ensureTrailingEmpty } from '../../utils/gui';
import { EMPTY_PARAM } from '../../common/constants';

interface ParamsEditorProps {
  params: Param[];
  setParams: (params: Param[]) => void;
}

const ParamsEditor = ({ params, setParams }: ParamsEditorProps) => {
  const safeParams= params.map(param => ({
  key: param.key,
  value: param.value.toString()
}));
  useEffect(() => {
    ensureTrailingEmpty(safeParams, setParams, { key: '', value: '' });
  }, [params, setParams, safeParams]);

  const handleChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...params];
    updated[index][field] = value;
    setParams(updated);
  };

  const addParam = () => {
    setParams([...params, EMPTY_PARAM]);
  };

  const removeParam = (index: number) => {
    const updated = params.filter((_, i) => i !== index);
    setParams(updated);
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {params.map((param, index) => (
        <Box key={index} display="flex" gap={1}>
          <TextField
            label="Key"
            size="small"
            value={param.key}
            onChange={(e) => handleChange(index, 'key', e.target.value)}
          />
          <TextField
            label="Value"
            size="small"
            value={param.value}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
          />
          {params.length > 1 && (
            <IconButton onClick={() => removeParam(index)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
      <IconButton onClick={addParam} size="small">
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ParamsEditor;
