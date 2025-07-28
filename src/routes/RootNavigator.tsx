import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/dashboard';
import HistoryNavigator from './HistoryNavigator';

function RootNavigator() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/history/*" element={<HistoryNavigator />} />
    </Routes>
  );
}

export default RootNavigator;
