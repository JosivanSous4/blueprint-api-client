import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export const useKeyboardShortcuts = ({
  sendRequest,
  saveToCollection,
  saveResponse,
  focusUrlInput,
  toggleTheme,
}) => {
  useHotkeys("ctrl+enter, cmd+enter", (e) => {
    e.preventDefault();
    sendRequest();
  });

  useHotkeys("ctrl+s, cmd+s", (e) => {
    e.preventDefault();
    saveToCollection();
  });

  useHotkeys("ctrl+shift+s, cmd+shift+s", (e) => {
    e.preventDefault();
    saveResponse();
  });

  useHotkeys("ctrl+l, cmd+l", (e) => {
    e.preventDefault();
    focusUrlInput();
  });

  useHotkeys("ctrl+shift+t, cmd+shift+t", (e) => {
    e.preventDefault();
    toggleTheme();
  });

  useHotkeys("ctrl+/, cmd+/", (e) => {
    e.preventDefault();
    alert(
      "Keyboard Shortcuts:\n\n" +
        "Ctrl+Enter: Send Request\n" +
        "Ctrl+S: Save to Collection\n" +
        "Ctrl+Shift+S: Save Response\n" +
        "Ctrl+L: Focus URL Input\n" +
        "Ctrl+Shift+T: Toggle Theme\n" +
        "Ctrl+/: Show Help",
    );
  });

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .keyboard-hint {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .keyboard-hint.show {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    const hint = document.createElement("div");
    hint.className = "keyboard-hint";
    hint.textContent = "Press Ctrl+/ for shortcuts";
    document.body.appendChild(hint);

    let hintTimeout;
    const showHint = () => {
      hint.classList.add("show");
      clearTimeout(hintTimeout);
      hintTimeout = setTimeout(() => {
        hint.classList.remove("show");
      }, 3000);
    };

    setTimeout(showHint, 2000);

    return () => {
      clearTimeout(hintTimeout);
      if (style.parentNode) style.parentNode.removeChild(style);
      if (hint.parentNode) hint.parentNode.removeChild(hint);
    };
  }, []);
};
