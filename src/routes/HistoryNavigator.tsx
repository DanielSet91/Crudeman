import { Routes, Route } from 'react-router-dom'
import ApiHistory from '../pages/apiHistory/ApiHistory'

function HistoryNavigator() {
  return (
    <Routes>
      <Route path="/" element={<ApiHistory />} />
    </Routes>
  )
}

export default HistoryNavigator
