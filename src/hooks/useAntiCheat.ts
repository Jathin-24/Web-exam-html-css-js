import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface AntiCheatConfig {
  maxTabSwitches: number;
  allowCopyPaste: boolean;
  onMaxTabSwitchesReached: () => void;
  onTabSwitch: (count: number) => void;
}

export const useAntiCheat = (config: AntiCheatConfig) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isInitializedRef = useRef(false);

  // Handle fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.error('Fullscreen request failed:', error);
      toast.error('Please enable fullscreen to continue the exam');
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  }, []);

  // Handle visibility change (tab switching)
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        config.onTabSwitch(newCount);

        if (newCount >= config.maxTabSwitches) {
          toast.error(`Maximum tab switches reached (${config.maxTabSwitches})! Your exam will be auto-submitted.`);
          config.onMaxTabSwitchesReached();
        } else {
          toast.warning(`Tab switch detected! ${config.maxTabSwitches - newCount} switches remaining.`);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [tabSwitchCount, config]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      if (!isNowFullscreen && isInitializedRef.current) {
        toast.warning('Please stay in fullscreen mode during the exam!');
        // Auto re-enter fullscreen after a brief delay
        setTimeout(() => {
          enterFullscreen();
        }, 1000);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [enterFullscreen]);

  // Disable copy/paste if not allowed
  useEffect(() => {
    if (config.allowCopyPaste) return;

    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.warning('Copy/Paste is disabled for this exam');
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [config.allowCopyPaste]);

  // Disable keyboard shortcuts
  useEffect(() => {
    const preventShortcuts = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+V, Ctrl+X if copy/paste not allowed
      if (!config.allowCopyPaste && e.ctrlKey && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast.warning('Keyboard shortcuts are disabled');
      }
      
      // Prevent Alt+Tab, Ctrl+Tab (these may not work in all browsers)
      if ((e.altKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'Tab')) {
        e.preventDefault();
      }
      
      // Prevent F11 (fullscreen toggle)
      if (e.key === 'F11') {
        e.preventDefault();
      }
      
      // Prevent Escape to some degree
      if (e.key === 'Escape') {
        e.preventDefault();
        toast.warning('Please stay in fullscreen mode!');
      }
    };

    document.addEventListener('keydown', preventShortcuts);
    return () => document.removeEventListener('keydown', preventShortcuts);
  }, [config.allowCopyPaste]);

  return {
    tabSwitchCount,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    setTabSwitchCount,
  };
};
