'use client';
import useSpotlightEffect from '@/hooks/use-spotlight';
const SpotlightCursor = ({ config = {}, className, ...rest }) => {
  const spotlightConfig = {
    radius: 200,
    brightness: 1,
    color: '#E9A5F1',
    smoothing: 0.9,
    ...config,
  };
  const canvasRef = useSpotlightEffect(spotlightConfig);
  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] w-full h-full ${className}`}
      {...rest}
    />
  );
};
export default SpotlightCursor;
