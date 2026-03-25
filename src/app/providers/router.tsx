import { createBrowserRouter } from 'react-router-dom';

import BookmarkDetailPage from '@/pages/bookmark-detail/ui/Page';
import WeatherHomePage from '@/pages/weather-home/ui/Page';

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
