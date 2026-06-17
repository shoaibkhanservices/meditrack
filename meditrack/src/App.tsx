import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen/SplashScreen';
import AuthGate from './screens/AuthGate/AuthGate';
import Login from './screens/Login/Login';
import Register from './screens/Register/Register';
import DashboardLayout from './screens/DashboardLayout/DashboardLayout';
import SymptomDetails from './screens/SymptomDetails/SymptomDetails';
import Analyzing from './screens/Analyzing/Analyzing';
import Results from './screens/Results/Results';
import Doctors from './screens/Doctors/Doctors';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      {/* Background blobs for premium medical-grade glassmorphism overlay */}
      <div className="app-bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthGate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<DashboardLayout />} />
        <Route path="/symptom-details" element={<SymptomDetails />} />
        <Route path="/analyzing" element={<Analyzing />} />
        <Route path="/results" element={<Results />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
