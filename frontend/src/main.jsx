import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

import App from './App';
import ScreenerPage from './pages/ScreenerPage';
import ResultsPage from './pages/ResultsPage.jsx';
import MagicCanvasPage from './pages/MagicCanvasPage';
import EmotionMirrorPage from './pages/EmotionMirrorPage';
import ResourceHubPage from './pages/ResourceHubPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutUsPage from './pages/AboutUsPage';
import SensoryGymPage from './pages/SensoryGymPage';
import ResourceLibraryPage from './pages/ResourceLibraryPage';
import ForumPage from './pages/ForumPage';
import PostDetailPage from './pages/PostDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      { path: 'about', element: <AboutUsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'screener',
        element: <ScreenerPage />,
      },
      {
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: 'gym',
        children: [
          {
            index: true,
            element: <SensoryGymPage />,
          },
          {
            path: 'magic-canvas',
            element: <MagicCanvasPage />,
          },
          {
            path: 'emotion-mirror',
            element: <EmotionMirrorPage />,
          },
        ],
      },
      {
        path: 'resources',
        children: [
          {
            index: true,
            element: <ResourceHubPage />,
          },
          {
            path: 'library',
            element: <ResourceLibraryPage />,
          },
        ]
      },
      { path: 'forum', element: <ForumPage /> },
      { path: 'forum/:postId', element: <PostDetailPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);