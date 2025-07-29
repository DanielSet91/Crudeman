import { Paper, Typography } from '@mui/material';

interface ResponseViewerProps {
  response: unknown;
}

const ResponseViewer = ({ response }: ResponseViewerProps) => {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 'auto', mb: 1 }}>
        Response
      </Typography>
      <Paper
        sx={{
          p: 2,
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: '#f5f5f5',
          width: '100%',
        }}
      >
        {response ? (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            Click send in order to see response
          </Typography>
        )}
      </Paper>
    </>
  );
};

export default ResponseViewer;
