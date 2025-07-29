import { Tabs, Tab, Box } from '@mui/material';
import { METHODS } from '../../../common/constants';

interface MethodTabsProps {
  tab: string;
  setTab: (tab: string) => void;
}

const MethodTabs = ({ tab, setTab }: MethodTabsProps) => {
  return (
    <Box>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
        <Tab label="All" value="all" />
        {METHODS.map((method) => (
          <Tab key={method} label={method} value={method} />
        ))}
      </Tabs>
    </Box>
  );
};

export default MethodTabs;
