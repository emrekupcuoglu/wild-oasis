import { useEffect, useRef } from "react";

export function useOutsideClick<T = HTMLDivElement>(
  handler: () => void,
  listenCapturing = true
) {
  // ? Detecting a click outside of the Modal

  const ref = useRef<T extends HTMLElement | null ? T : null>(null);

  useEffect(() => {
    function handleClick(e: Event) {
      // The contain method returns true if the whenever the ref.current DOM element contains the the element we pass in.
      // This works for detecting and closing the modal when we click outside, but it also prevent us from opening the modal in the first place. The reason for this is that event bubble up. So, whenever we click the button to open the modal, the modal window will be attached to the DOM, it will be attached as a direct child of the body. When we click on the button that event bubbles up all the way through the DOM until it reaches the modal window that was just attached. So then the click is basically detected outside of the DOM in the eyes of the browser and it will immediately close the window. Because the e.target is outside of the modal, even though it was clicked before the modal was open, it is still detected in the modal because the event bubbles up.
      // To fix this we listen to the events on the capturing phase instead of the bubbling phase and for that we pass in a third argument to the addEventListener and the value of the argument is "true".
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    }
    document.addEventListener("click", handleClick, listenCapturing);

    return () => document.removeEventListener("click", handleClick);
  }, [handler, listenCapturing]);

  return ref;
}
