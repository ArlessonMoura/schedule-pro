import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProfileList from './pages/ProfileList';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/list" element={<ProfileList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
