import { createBrowserRouter } from 'react-router-dom';

import BookmarkDetailPage from '@/pages/bookmark-detail/Page';
import WeatherHomePage from '@/pages/weather-home/Page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WeatherHomePage />,
  },
  {
    path: '/bookmarks/:id',
    element: <BookmarkDetailPage />,
  },
]);
