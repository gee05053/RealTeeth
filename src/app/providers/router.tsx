import { createBrowserRouter } from 'react-router-dom';

import PageLayout from '@/app/layouts/PageLayout';
import BookmarkDetailPage from '@/pages/bookmark-detail/Page';
import WeatherHomePage from '@/pages/weather-home/Page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { index: true, element: <WeatherHomePage /> },
      { path: 'bookmarks/:id', element: <BookmarkDetailPage /> },
    ],
  },
]);
