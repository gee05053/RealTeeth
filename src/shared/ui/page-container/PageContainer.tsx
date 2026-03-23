import type { PropsWithChildren } from 'react';

const PageContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gray-900">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 bg-[linear-gradient(160deg,#1a3a5c_0%,#2d6a9f_40%,#4a90c4_70%,#89c4e1_100%)] px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
