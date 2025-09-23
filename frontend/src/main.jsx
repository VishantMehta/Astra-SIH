import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

// This is the root layout component that includes our theme toggle logic
import App from './App';
import ScreenerPage from './pages/ScreenerPage';
import ResultsPage from './pages/ResultsPage.jsx';
import MagicCanvasPage from './pages/MagicCanvasPage';
import EmotionMirrorPage from './pages/EmotionMirrorPage';
import ResourceHubPage from './pages/ResourceHubPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App now acts as the root, providing theme logic
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      { // <-- Add this new route object
        path: 'screener',
        element: <ScreenerPage />,
      },
      { // <-- Add this new route object
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: 'gym',
        children: [
          {
            path: 'magic-canvas', // Path: /gym/magic-canvas
            element: <MagicCanvasPage />,
          },
          { // <-- Add this new route object
            path: 'emotion-mirror',
            element: <EmotionMirrorPage />,
          },
          // Other gym games will go here later, e.g., 'emotion-mirror'
        ],
      },
      { // <-- Add this new route object
        path: 'resources',
        element: <ResourceHubPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);