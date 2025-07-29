import React from 'react';
import { Box, Modal, Typography, TextField, Select, MenuItem, Button } from '@mui/material';
import { METHODS } from '../../../common/constants';
import { SavedRequest } from '../../../types/commonTypes';

interface EditRequestModalProps {
  request: SavedRequest | null;
  open: boolean;
  onClose: () => void;
  onSend: (request: SavedRequest) => void;
}

const EditRequestModal = ({ request, open, onClose, onSend }: EditRequestModalProps) => {
  if (!request) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6">Edit Request</Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Select value={request.method} fullWidth>
            {METHODS.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
          <TextField label="URL" value={request.url} fullWidth />
          <TextField
            label="Headers (JSON)"
            value={JSON.stringify(request.headers, null, 2)}
            multiline
            minRows={4}
            fullWidth
          />
          <TextField
            label="Body"
            value={typeof request.body === 'object' ? JSON.stringify(request.body, null, 2) : String(request.body)}
            multiline
            minRows={3}
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => onSend(request)}>
              Send Again
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditRequestModal;
