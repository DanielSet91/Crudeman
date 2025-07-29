import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Button, Typography, Paper } from '@mui/material';
import { METHODS } from '../../common/constants';
import { RequestService } from '../../services/RequestService';
import { useNavigate } from 'react-router-dom';
import { SavedRequest } from '../../types/commonTypes';
import EditRequestModal from './components/EditRequestModal';

const ApiHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState('all');
  const [editRequest, setEditRequest] = useState<SavedRequest | null>(null);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    const data = await RequestService.getAll();
    setRequests(data);
    setFiltered(tab === 'all' ? data : data.filter((r) => r.method === tab));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (tab === 'all') {
      setFiltered(requests);
    } else {
      setFiltered(requests.filter((r) => r.method === tab));
    }
  }, [tab, requests]);

  const handleEditOpen = (req) => {
    setEditRequest(req);
  };

  const handleEditClose = () => {
    setEditRequest(null);
  };

  const handleDelete = (id: string) => {
    RequestService.delete(id);
    fetchRequests();
  };

  const handleSendAgain = () => {
    navigate('/', { state: editRequest });
    handleEditClose();
  };

  return (
    <Box>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
        <Tab label="All" value="all" />
        {METHODS.map((method) => (
          <Tab key={method} label={method} value={method} />
        ))}
      </Tabs>

      <Box mt={2}>
        {filtered.length > 0
          ? filtered.map((req) => (
              <Paper key={req.id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {req.created_at}
                </Typography>
                <Typography variant="h6">
                  {req.method} {req.url} - {req.status}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Response:
                </Typography>
                <Paper sx={{ p: 1, pl: 2, whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body2">
                    {typeof req.response_data === 'object'
                      ? JSON.stringify(req.response_data, null, 2)
                      : String(req.response_data)}
                  </Typography>
                </Paper>
                <Box sx={{ mt: 1, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button size="small" variant="outlined" onClick={() => handleEditOpen(req)}>
                    Edit
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(req.id)}>
                    Delete
                  </Button>
                </Box>
              </Paper>
            ))
          : 'No requests'}
      </Box>
      <EditRequestModal
        request={editRequest}
        open={!!editRequest}
        onClose={handleEditClose}
        onSend={(req) => {
          navigate('/', { state: req });
          handleEditClose();
        }}
      />
    </Box>
  );
};

export default ApiHistory;
