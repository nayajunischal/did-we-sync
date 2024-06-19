import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage';
import Accounts from './pages/links/Accounts';
import Opportunities from './pages/links/Opportunities';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<HomePage />}>
          <Route path="/" element={<Accounts />}></Route>
          <Route path="/opportunities" element={<Opportunities />}></Route>
        </Route>
        <Route path="/auth/login" element={<LoginPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
