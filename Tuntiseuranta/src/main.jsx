import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Statistics from './Pages/Statistics.jsx';
import AddShift from './Pages/AddShift.jsx';
import { Auth } from './components/auth.jsx';
import { Register } from './components/Register.jsx';
import UserManagement from './Pages/UserManagement.jsx';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute.jsx';

const router = (
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={
          <PrivateRoute>
            <AddShift />
          </PrivateRoute>
        } />
        <Route path="statistics" element={
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        } />
        <Route path="register" element={
          <AdminRoute> {/* Muokkaa tämä */}
            <Register />
          </AdminRoute>
        } />
        <Route path="auth" element={<Auth />} />
        <Route path="users" element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  </HashRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {router}
    </AuthProvider>
  </React.StrictMode>
);