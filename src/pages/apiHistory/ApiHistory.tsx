import { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { RequestService } from '../../services/RequestService';
import { useNavigate } from 'react-router-dom';
import { SavedRequest } from '../../types/commonTypes';
import EditRequestModal from './components/EditRequestModal';
import RequestCard from './components/RequestCard';
import MethodTabs from './components/MethodTabs';

const ApiHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState<SavedRequest[]>([]);
  const [tab, setTab] = useState('all');
  const [editRequest, setEditRequest] = useState<SavedRequest | null>(null);
  const navigate = useNavigate();

  const fetchRequests = useCallback(async () => {
    const data = await RequestService.getAll();
    setRequests(data);
    let filteredData = data;

    if (tab !== 'all') {
      filteredData = data.filter((request: SavedRequest) => request.method === tab);
    }

    setFiltered(filteredData);
  }, [tab, setRequests, setFiltered]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    if (tab === 'all') {
      setFiltered(requests);
    } else {
      setFiltered(requests.filter((r: SavedRequest) => r.method === tab));
    }
  }, [tab, requests]);

  const handleEditOpen = (req: SavedRequest) => {
    setEditRequest(req);
  };

  const handleEditClose = () => {
    setEditRequest(null);
  };

  const handleDelete = async (id: string) => {
    const result = await RequestService.delete(id);
    if (result) {
      fetchRequests();
    } else {
      alert('Failed to delete the request.');
    }
  };

  const handleSendAgain = (updatedRequest: SavedRequest) => {
    navigate('/', { state: updatedRequest });
    handleEditClose();
  };

  const handleOnSave = async (id: string, updates: Partial<SavedRequest>) => {
    const result = await RequestService.edit(id, updates);
    if (!result) {
      alert('Failed to save changes.');
      return;
    }
    fetchRequests();
    handleEditClose();
  };

  return (
    <Box>
      <MethodTabs tab={tab} setTab={setTab} />
      <Box mt={2}>
        {filtered.length > 0
          ? filtered.map((req) => (
              <RequestCard key={req.id} request={req} onEdit={handleEditOpen} onDelete={handleDelete} />
            ))
          : 'No requests'}
      </Box>
      <EditRequestModal
        request={editRequest}
        open={!!editRequest}
        onClose={handleEditClose}
        onSend={handleSendAgain}
        onSave={handleOnSave}
      />
    </Box>
  );
};

export default ApiHistory;
