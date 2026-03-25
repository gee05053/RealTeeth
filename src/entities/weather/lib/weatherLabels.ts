const SKY_LABEL: Record<number, string> = { 1: '맑음', 3: '구름 많음', 4: '흐림' }; // 하늘 상태 라벨
const PTY_LABEL: Record<number, string> = { 0: '없음', 1: '비', 2: '비/눈', 3: '눈', 4: '소나기' }; // 강수 형태 라벨

export { SKY_LABEL, PTY_LABEL };
