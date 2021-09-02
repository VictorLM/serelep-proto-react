import React, { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';
import { LoginPage } from './pages/login/login';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.scss';

export const App: React.FC = (): ReactElement => (
  <div className="container">
    <ToastContainer />
    <LoginPage />
  </div>
);
