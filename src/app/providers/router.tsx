import { createBrowserRouter } from 'react-router-dom';

import WeatherHomePage from '@/pages/weather-home/ui/Page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WeatherHomePage />,
  },
]);
