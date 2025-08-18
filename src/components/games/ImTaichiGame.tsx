import React, { useState, useEffect } from "react";
import MobileImTaichiGame from "./mobile/MobileImTaichiGame";
import DesktopImTaichiGame from "./desktop/DesktopImTaichiGame";

interface ImTaichiGameProps {
  onGameStart?: () => void;
  onGameEnd?: () => void;
}

const ImTaichiGame: React.FC<ImTaichiGameProps> = ({ onGameStart, onGameEnd }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // デバイス判定
  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);

    };

    // 初期判定
    checkDevice();
    setMounted(true);

    // リサイズ時の再判定
    const handleResize = () => {
      checkDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // SSR対応：マウント前は何も表示しない
  if (!mounted) {
    return null;
  }

  // デバイスに応じたコンポーネントを表示
  if (isMobile) {

    return <MobileImTaichiGame onGameStart={onGameStart} onGameEnd={onGameEnd} />;
  } else {

    return <DesktopImTaichiGame onGameStart={onGameStart} onGameEnd={onGameEnd} />;
  }
};

export default ImTaichiGame;
