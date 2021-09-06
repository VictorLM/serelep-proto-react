import React, { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';
import { Router } from 'react-router-dom';
import history from './history/history';
import { AuthProvider } from './context/AuthContext';
import Routes from './routes/routes';

import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.scss';

export const App: React.FC = (): ReactElement => (
  <AuthProvider>
    <div className="container">
      <ToastContainer />

      <Router history={history}>
        <Routes />
      </Router>

    </div>
  </AuthProvider>

);
