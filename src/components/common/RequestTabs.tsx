import React from 'react';
import { Tabs, Tab, Paper, Box } from '@mui/material';
import HeadersEditor from './HeadersEditor';
import ParamsEditor from './ParamsEditor';
import BodyEditor from './BodyEditor';
import { Header, Param } from '../../types/commonTypes';

interface RequestTabsProps {
  tabIndex: number;
  setTabIndex: (index: number) => void;
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
  params: Param[];
  setParams: (params: Param[]) => void;
  body: string;
  setBody: (body: string) => void;
}

const RequestTabs = ({
  tabIndex,
  setTabIndex,
  headers,
  setHeaders,
  params,
  setParams,
  body,
  setBody,
}: RequestTabsProps) => {
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <>
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 1 }}>
        <Tab label="Params" />
        <Tab label="Headers" />
        <Tab label="Body" />
      </Tabs>

      <Paper sx={{ p: 2, mb: 2, minHeight: 100, width: '100%' }}>
        <Box>
          {tabIndex === 0 && <ParamsEditor params={params} setParams={setParams} />}
          {tabIndex === 1 && <HeadersEditor headers={headers} setHeaders={setHeaders} />}
          {tabIndex === 2 && <BodyEditor body={body} setBody={setBody} />}
        </Box>
      </Paper>
    </>
  );
};

export default RequestTabs;
