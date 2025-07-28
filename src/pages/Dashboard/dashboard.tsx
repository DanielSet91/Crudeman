import { useState } from 'react';
import { Box, CssBaseline, Typography, Button, TextField, Select, MenuItem, Tabs, Tab, Paper } from '@mui/material';
import ParamsEditor from './components/ParamsEditor';
import HeadersEditor from './components/HeadersEditor';
import BodyEditor from './components/BodyEditor';
import { Header, HttpResponse, Method, Param } from '../../types/commonTypes';
import { sendHttpRequest } from '../../utils/sendRequest';
import { METHODS } from '../../common/constants';

const Dashboard = () => {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [body, setBody] = useState('');
  const [params, setParams] = useState<Param[]>([]);
  const [response, setResponse] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSend = async () => {
    const result = await sendHttpRequest({
      method,
      url,
      headers: headers
        .filter((h) => h.key && h.enabled !== false)
        .reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {}),
      params: params.filter((p) => p.key).reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {}),
      body: body,
    });
    setResponse(result?.data);
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
        <Box display="flex" gap={2} mb={2}>
          <Select value={method} onChange={(e) => setMethod(e.target.value)} size="small">
            {METHODS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Request URL"
            variant="outlined"
            size="small"
            placeholder="https://api.example.com/"
            onChange={handleUrlChange}
          />
          <Button variant="contained" color="primary" onClick={handleSend}>
            Send
          </Button>
        </Box>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 1 }}>
          <Tab label="Params" />
          <Tab label="Headers" />
          <Tab label="Body" />
        </Tabs>

        <Paper sx={{ p: 2, mb: 2, minHeight: 100, width: '100%' }}>
          <Box>
            <Box sx={{ display: tabIndex === 0 ? 'block' : 'none' }}>
              <ParamsEditor params={params} setParams={setParams} />
            </Box>
            <Box sx={{ display: tabIndex === 1 ? 'block' : 'none' }}>
              <HeadersEditor headers={headers} setHeaders={setHeaders} />
            </Box>
            <Box sx={{ display: tabIndex === 2 ? 'block' : 'none' }}>
              <BodyEditor body={body} setBody={setBody} />
            </Box>
          </Box>
        </Paper>
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
      </Box>
    </Box>
  );
};

export default Dashboard;
