import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

// ! Reason to use portal
// Modal was working perfectly before we introduced the portal so why we need it?
// The main reason why portal becomes necessary is in order to avoid conflicts with the CSS property overflow:hidden. Many times we build a component like a modal, and it works just fine, but then some other developer will re-use it somewhere else, and that somewhere else might be a place where the modal will get cut off by the overflow hidden set on the parent. So this is all about re-usability, and making sure that the overflow: hidden on some parent won't cause a cut off issue. So in order to avoid this problem we render the modal outside of the current DOM tree, which in this case we are rendering it as a child of the body, outside of the React application. React is rendered inside another div inside of the body. So React app and the modal are siblings in the DOM tree. This would still might cause a cutting off issue if the body was set to overflow: hidden

// React portal is a feature that allows us render an element outside of the parent components DOM structure while still keeping the element in the original position of the component tree. In other words with a portal we can basically render a component in any place we want inside the DOM tree, but still leave the component at the same place in the React component tree, so that things like props etc. keeps working normally.
// This is great an generally used for all elements that we want to stay on top of other elements, things like modal windows, tooltips, menus, and etc.
function Modal({ children, onClose }: ModalProps) {
  // createPortal takes in the JSX as the first argument, and takes the container for where the JSX will be rendered as the second argument. It also takes in an optional argument of key
  return createPortal(
    <Overlay>
      <StyledModal>
        <Button onClick={onClose}>
          <HiXMark />
        </Button>
        <div>{children}</div>
      </StyledModal>
    </Overlay>,
    // We have attached the modal to the body, some developers say that this is not ideal, but works for this case. We could of also used the querySelector to select another DOM element for the container.
    document.body
  );
}

export default Modal;
