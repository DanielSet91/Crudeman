import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/dashboard';
import ApiHistory from '../pages/apiHistory/ApiHistory';

function RootNavigator() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/history" element={<ApiHistory />} />
    </Routes>
  );
}

export default RootNavigator;
