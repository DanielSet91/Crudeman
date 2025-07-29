import { Box, TextField, Button } from '@mui/material';
import { METHODS } from '../../../common/constants';
import MethodSelect from '../../../components/common/MethodSelect';

type HttpMethod = (typeof METHODS)[number];

interface RequestControllersProps {
  method: HttpMethod;
  setMethod: React.Dispatch<React.SetStateAction<HttpMethod>>;
  url: string;
  setUrl: (url: string) => void;
  onSend: () => void;
}

const RequestControllers = ({ method, setMethod, url, setUrl, onSend }: RequestControllersProps) => {
  return (
    <Box display="flex" gap={2} mb={2}>
      <MethodSelect value={method} onChange={setMethod} />
      <TextField
        fullWidth
        label="Request URL"
        variant="outlined"
        size="small"
        placeholder="https://api.example.com/"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={onSend}>
        Send
      </Button>
    </Box>
  );
};

export default RequestControllers;
