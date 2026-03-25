import type { PropsWithChildren } from 'react';

const PageContainer = ({ children }: PropsWithChildren) => {
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col gap-4 bg-[linear-gradient(160deg,#1a3a5c_0%,#2d6a9f_40%,#4a90c4_70%,#89c4e1_100%)] p-8">
      {children}
    </main>
  );
};

export default PageContainer;
