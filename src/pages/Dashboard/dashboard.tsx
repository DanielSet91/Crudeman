import { useState, useEffect } from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';
import { Header, Method, Param } from '../../types/commonTypes';
import { RequestService } from '../../services/RequestService';
import { useLocation } from 'react-router-dom';
import RequestControllers from './components/RequestControllers';
import ResponseViewer from './components/ResponseViewer';
import RequestTabs from '../../components/common/RequestTabs';
import { formatHeaders, formatParams } from '../../utils/format';
import { RequestTransformer } from '../../utils/RequestTransformer';

const Dashboard = () => {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [body, setBody] = useState('');
  const [params, setParams] = useState<Param[]>([]);
  const [response, setResponse] = useState('');
  const location = useLocation();
  const prefillRequest = location.state;

  useEffect(() => {
    if (prefillRequest) {
      setMethod(prefillRequest.method || 'GET');
      setUrl(prefillRequest.url || '');
      setHeaders(RequestTransformer.objectToHeaders(prefillRequest.headers || {}));
      setParams(RequestTransformer.objectToParams(prefillRequest.params || {}));
      setBody(
        typeof prefillRequest.body === 'object'
          ? JSON.stringify(prefillRequest.body, null, 2)
          : prefillRequest.body || ''
      );
    }
  }, [prefillRequest]);

  const handleSend = async () => {
    const formattedHeaders = formatHeaders(headers);
    const formattedParams = formatParams(params);

    const result = await RequestService.send({
      method,
      url,
      headers: formattedHeaders,
      params: formattedParams,
      body,
    });

    if (!result) {
      alert('Failed to send request. Please check your network or request details.');
      return;
    }

    setResponse(result.data);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '80vw' }}>
      <CssBaseline />
      <Box
        sx={{
          p: 3,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Request Builder
        </Typography>
        <RequestControllers method={method} setMethod={setMethod} url={url} setUrl={setUrl} onSend={handleSend} />
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
        <ResponseViewer response={response} />
      </Box>
    </Box>
  );
};

export default Dashboard;
