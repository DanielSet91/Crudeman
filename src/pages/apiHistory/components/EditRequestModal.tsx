import { useEffect, useState } from 'react';
import { Box, Modal, Typography, TextField, Select, MenuItem, Button } from '@mui/material';
import { METHODS } from '../../../common/constants';
import { SavedRequest, Header, Param } from '../../../types/commonTypes';
import RequestTabs from '../../../components/common/RequestTabs';
import { RequestTransformer } from '../../../utils/RequestTransformer';
import MethodSelect from '../../../components/common/MethodSelect';

interface EditRequestModalProps {
  request: SavedRequest | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<SavedRequest>) => void;
  onSend: (request: SavedRequest) => void;
}

const EditRequestModal = ({ request, open, onClose, onSave, onSend }: EditRequestModalProps) => {
  const [method, setMethod] = useState(request?.method || 'GET');
  const [url, setUrl] = useState(request?.url || '');
  const [headers, setHeaders] = useState<Header[]>(RequestTransformer.objectToHeaders(request?.headers));
  const [params, setParams] = useState<Param[]>(RequestTransformer.objectToParams(request?.params));
  const [body, setBody] = useState(
    typeof request?.body === 'object' ? JSON.stringify(request.body, null, 2) : request?.body || ''
  );
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (open && request) {
      setMethod(request.method);
      setUrl(request.url);
      setHeaders(RequestTransformer.objectToHeaders(request.headers));
      setParams(RequestTransformer.objectToParams(request.params));
      setBody(typeof request.body === 'object' ? JSON.stringify(request.body, null, 2) : request.body || '');
    }
  }, [open, request]);

  const handleSave = () => {
    if (!request) return;

    let parsedBody: unknown = body;

    try {
      parsedBody = body ? JSON.parse(body) : '';
    } catch {
      alert('Body is not valid JSON');
      return;
    }

    const updates: Partial<SavedRequest> = {};

    const isMethodChanged = method !== request.method;
    const isUrlChanged = url !== request.url;

    const updatedHeaders = RequestTransformer.headersToObject(headers);
    const isHeadersChanged = JSON.stringify(updatedHeaders) !== JSON.stringify(request.headers);

    const updatedParams = RequestTransformer.paramsToObject(params);
    const isParamsChanged = JSON.stringify(updatedParams) !== JSON.stringify(request.params);

    const isBodyChanged = JSON.stringify(parsedBody) !== JSON.stringify(request.body);

    if (isMethodChanged) updates.method = method;
    if (isUrlChanged) updates.url = url;
    if (isHeadersChanged) updates.headers = updatedHeaders;
    if (isParamsChanged) updates.params = updatedParams;
    if (isBodyChanged) updates.body = JSON.stringify(parsedBody);

    if (Object.keys(updates).length > 0) {
      onSave(request.id, updates);
    } else {
      alert('No changes to save.');
    }
  };

  const handleSend = () => {
    let parsedBody = body;
    try {
      parsedBody = body ? JSON.parse(body) : '';
    } catch {
      alert('Body is not valid JSON');
      return;
    }

    const updatedRequest: SavedRequest = {
      ...request!,
      method,
      url,
      headers: RequestTransformer.headersToObject(headers),
      params: RequestTransformer.paramsToObject(params),
      body: parsedBody,
    };

    onSend(updatedRequest);
  };

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
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6">Edit Request</Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <MethodSelect value={method} onChange={setMethod} />
          <TextField label="URL" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth />
          <RequestTabs
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            headers={headers}
            setHeaders={setHeaders}
            params={params}
            setParams={setParams}
            body={body}
            setBody={setBody}
          />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="contained" color="primary" onClick={handleSend}>
              Send Again
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditRequestModal;
