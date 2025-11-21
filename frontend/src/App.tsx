import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import MeetingDetail from './pages/MeetingDetail';
import ProcessingStatus from './pages/ProcessingStatus';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meeting/:meetingId" element={<MeetingDetail />} />
        <Route path="/processing" element={<ProcessingStatus />} />
      </Routes>
    </Router>
  );
}

export default App;

