import { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { getTimeOfDayBackdropGradient } from '@/app/lib/timeOfDayBackdrop';

const PageLayout = () => {
  const [backgroundGradient, setBackgroundGradient] = useState(() =>
    getTimeOfDayBackdropGradient()
  );

  useEffect(() => {
    const update = () => setBackgroundGradient(getTimeOfDayBackdropGradient());
    update();
    const id = window.setInterval(update, 60000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main
      className="min-h-screen w-full p-4 sm:p-6 md:p-8"
      style={{ background: backgroundGradient }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:gap-4">
        <Outlet />
      </div>
    </main>
  );
};

export default PageLayout;
