import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Statistics from './Pages/Statistics.jsx';
import AddShift from './Pages/AddShift.jsx';
import { Auth } from './components/auth.jsx';
import UserManagement from './Pages/UserManagement.jsx';

const router = (
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<AddShift />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="auth" element={<Auth />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
    </Routes>
  </HashRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {router}
  </React.StrictMode>
);
