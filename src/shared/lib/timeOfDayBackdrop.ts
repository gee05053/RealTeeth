const ANGLE = '160deg';

const getTimeOfDayBackdropGradient = (): string => {
  const hour = new Date().getHours();

  switch (true) {
    case hour >= 5 && hour < 6:
      return `linear-gradient(${ANGLE}, #060a1a 0%, #101a32 24%, #1c2848 48%, #2d3858 68%, #3d4868 85%, #485878 100%)`;
    case hour >= 6 && hour < 8:
      return `linear-gradient(${ANGLE}, #060a1a 0%, #121c38 18%, #243058 34%, #404878 50%, #685878 64%, #987068 78%, #c09078 88%, #786060 100%)`;
    case hour >= 8 && hour < 12:
      return `linear-gradient(${ANGLE}, #1a3560 0%, #2d5a90 34%, #4a80b0 64%, #5e92b8 82%, #6a9ab8 100%)`;
    case hour >= 12 && hour < 18:
      return `linear-gradient(${ANGLE}, #0f3a68 0%, #1a5fa8 38%, #2a78b8 68%, #3d88b8 88%, #4a8eb0 100%)`;
    case hour >= 18 && hour < 20:
      return `linear-gradient(${ANGLE}, #1c2048 0%, #3a2858 22%, #5c3460 40%, #7a4052 55%, #a06048 70%, #c07848 82%, #884840 92%, #4a3038 100%)`;
    case hour >= 20 && hour < 22:
      return `linear-gradient(${ANGLE}, #1a1a32 0%, #2d3558 40%, #3d4568 72%, #4a4a68 88%, #3a3a52 100%)`;
    default:
      return `linear-gradient(${ANGLE}, #0f1428 0%, #1a2540 45%, #243552 78%, #2a3a50 100%)`;
  }
};

export { getTimeOfDayBackdropGradient };
