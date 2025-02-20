import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import EmailDashboard from './components/EmailDashboard';
import LinkAnalysis from './components/LinkAnalysis';
import Threats from './components/Threats';
import Settings from './components/Settings';
import { Box } from '@chakra-ui/react';

const App = () => {
  return (
    <Router>
      <Box display="flex">
        <Sidebar onNavigate={function (route: string): void {
                  throw new Error('Function not implemented.');
              } } />
        <Box flex="1">
          <Routes>
            <Route path="/emails" element={<EmailDashboard />} />
            <Route path="/link-analysis" element={<LinkAnalysis />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<EmailDashboard />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App; 