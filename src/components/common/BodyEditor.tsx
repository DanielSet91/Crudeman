import { TextField } from '@mui/material';

interface BodyEditorProps {
  body: string;
  setBody: (body: string) => void;
}

const BodyEditor = ({ body, setBody }: BodyEditorProps) => {
  const bodyToShow = typeof body === 'string' ? body : JSON.stringify(body, null, 2);

  return (
    <TextField
      label="Request Body"
      multiline
      minRows={6}
      fullWidth
      value={bodyToShow}
      onChange={(e) => setBody(e.target.value)}
      variant="outlined"
    />
  );
};

export default BodyEditor;
