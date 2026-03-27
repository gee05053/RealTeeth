import { Outlet } from 'react-router-dom';

import PageContainer from '@/shared/ui/page-container/PageContainer';

const PageLayout = () => {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
};

export default PageLayout;
