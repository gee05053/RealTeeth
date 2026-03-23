import PageContainer from '@/shared/ui/page-container/PageContainer';

const WeatherHomePage = () => {
  return (
    <PageContainer>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">RealTeeth Weather</h1>
        <p className="mt-1 text-sm text-slate-600">
          FSD 구조 기반으로 화면을 조합한 홈 페이지입니다.
        </p>
      </header>
    </PageContainer>
  );
};

export default WeatherHomePage;
