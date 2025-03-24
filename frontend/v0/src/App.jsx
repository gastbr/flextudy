import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;