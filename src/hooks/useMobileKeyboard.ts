import {
  useEffect,
  useRef,
  useState,
} from "react";

interface MobileKeyboardState {
  isKeyboardOpen: boolean;
  keyboardInset: number;
}

const KEYBOARD_THRESHOLD = 120;

function useMobileKeyboard(): MobileKeyboardState {
  const baselineHeight =
    useRef(0);

  const [
    state,
    setState,
  ] = useState<MobileKeyboardState>({
    isKeyboardOpen: false,
    keyboardInset: 0,
  });

  useEffect(() => {
    const visualViewport =
      window.visualViewport;

    if (!visualViewport) {
      return;
    }

    baselineHeight.current =
      Math.max(
        window.innerHeight,
        visualViewport.height,
      );

    function updateKeyboardState() {
      const viewport =
        window.visualViewport;

      if (!viewport) {
        return;
      }

      const isMobileLayout =
        window.matchMedia(
          "(max-width: 1023px)",
        ).matches;

      if (!isMobileLayout) {
        baselineHeight.current =
          Math.max(
            window.innerHeight,
            viewport.height,
          );

        setState({
          isKeyboardOpen: false,
          keyboardInset: 0,
        });

        return;
      }

      const visualHeight =
        viewport.height;

      const heightDifference =
        baselineHeight.current -
        visualHeight;

      const isKeyboardOpen =
        heightDifference >
        KEYBOARD_THRESHOLD;

      /*
       * Distance between the bottom of the
       * visible viewport and the layout viewport.
       *
       * On some Android browsers this becomes
       * the keyboard height.
       *
       * On browsers that resize the whole
       * viewport it remains 0, which is fine.
       */
      const keyboardInset =
        isKeyboardOpen
          ? Math.max(
              0,
              Math.round(
                window.innerHeight -
                  (
                    viewport.offsetTop +
                    viewport.height
                  ),
              ),
            )
          : 0;

      if (!isKeyboardOpen) {
        baselineHeight.current =
          Math.max(
            window.innerHeight,
            visualHeight,
          );
      }

      setState({
        isKeyboardOpen,
        keyboardInset,
      });
    }

    updateKeyboardState();

    visualViewport.addEventListener(
      "resize",
      updateKeyboardState,
    );

    visualViewport.addEventListener(
      "scroll",
      updateKeyboardState,
    );

    window.addEventListener(
      "resize",
      updateKeyboardState,
    );

    return () => {
      visualViewport.removeEventListener(
        "resize",
        updateKeyboardState,
      );

      visualViewport.removeEventListener(
        "scroll",
        updateKeyboardState,
      );

      window.removeEventListener(
        "resize",
        updateKeyboardState,
      );
    };
  }, []);

  return state;
}

export default useMobileKeyboard;