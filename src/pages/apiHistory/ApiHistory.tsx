import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { getAllRequests } from '../../utils/getAllRequests';

const ApiHistory = () => {
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      const data = await getAllRequests();
      setRequests(data);
        console.log(data);

    }
    fetchRequests();
  }, []);


  return (
    <Box>
      {requests ? (
        requests.map((req) => (
          <div key={req.id}>
            {req.method} {req.url} - {req.status}
          </div>
        ))
      ) : (
        'Loading...'
      )}
    </Box>
  );
};

export default ApiHistory;
