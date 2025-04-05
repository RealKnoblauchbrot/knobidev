import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ErrorPage from './components/ErrorPage';
import ItemGalleryPage from './pages/ItemGallery/ItemGalleryPage';

export const redirects: Record<string, string> = {
  
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/itemgallery',
    element: <ItemGalleryPage />,
  },
  ...Object.entries(redirects).map(([path, target]) => ({
    path: `/${path}`,
    element: <Navigate to={target} replace />,
  })),
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
