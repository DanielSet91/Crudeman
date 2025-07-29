import { Paper, Typography, Box, Button } from '@mui/material';
import { SavedRequest } from '../../../types/commonTypes';

interface RequestCardProps {
  request: SavedRequest;
  onEdit: (req: SavedRequest) => void;
  onDelete: (id: string) => void;
}

const RequestCard = ({ request, onEdit, onDelete }: RequestCardProps) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {request.created_at}
      </Typography>
      <Typography variant="h6">
        {request.method} {request.url} - {request.status}
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        Response:
      </Typography>
      <Paper sx={{ p: 1, pl: 2, whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5' }}>
        <Typography variant="body2">
          {typeof request.response_data === 'object'
            ? JSON.stringify(request.response_data, null, 2)
            : String(request.response_data)}
        </Typography>
      </Paper>
      <Box sx={{ mt: 1, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button size="small" variant="outlined" onClick={() => onEdit(request)}>
          Edit
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={() => onDelete(request.id)}>
          Delete
        </Button>
      </Box>
    </Paper>
  );
};

export default RequestCard;
