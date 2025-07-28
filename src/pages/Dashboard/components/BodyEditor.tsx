import { TextField } from '@mui/material';

interface BodyEditorProps {
  body: string;
  setBody: (body: string) => void;
}

const BodyEditor = ({ body, setBody }: BodyEditorProps) => {
  return (
    <TextField
      label="Request Body"
      multiline
      minRows={6}
      fullWidth
      value={body}
      onChange={(e) => setBody(e.target.value)}
      variant="outlined"
    />
  );
};

export default BodyEditor;
