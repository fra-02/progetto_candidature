import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
// ... importa un layout e una rotta protetta

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Useremo una rotta protetta per il dashboard */}
        <Route path="/" element={<DashboardPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}
export default App;