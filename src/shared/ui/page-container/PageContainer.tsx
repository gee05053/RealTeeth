import type { PropsWithChildren } from 'react';

const PageContainer = ({ children }: PropsWithChildren) => {
  return (
    <main className="min-h-screen w-full bg-[linear-gradient(160deg,#1a3a5c_0%,#2d6a9f_40%,#4a90c4_70%,#89c4e1_100%)] p-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">{children}</div>
    </main>
  );
};

export default PageContainer;
