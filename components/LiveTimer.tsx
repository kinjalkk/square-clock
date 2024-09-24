import React, { useEffect, useState } from "react";
interface LiveTimerProps {
  checkInTime: string;
}
const LiveTimer: React.FC<LiveTimerProps> = ({ checkInTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);
  const calculateElapsedTime = () => {
    const checkInDate = new Date(checkInTime);
    const elapsedTime = currentTime.getTime() - checkInDate.getTime();
    const hours = Math.floor(elapsedTime / 10006060);
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  return <p>{calculateElapsedTime()}</p>;
};
export default LiveTimer;
