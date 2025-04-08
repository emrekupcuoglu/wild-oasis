import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

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
interface WindowProps {
  children: React.ReactElement;
  name: string;
}

interface IModalContext {
  close: () => void;
  open: (windowName: string) => void;
  openName: string;
}

const ModalContext = createContext({} as IModalContext);

function Modal({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}
interface OpenProps {
  children: React.ReactElement;
  opens: string;
}
function Open({ children, opens: windowName }: OpenProps) {
  // We have the Button as a child of the Open, because we want to be able use its own custom button component. But when we do this the <Button/> has no way of accessing the open function. It is passed in with the child prop and because of this we can not pass the open function to the <Button/>
  // * To fix this we will use cloneElement.
  // ! cloneElement should not be overused, or not used at all before trying its alternatives in the React docs. We can use renderProps to solve this issue.
  // cloneElement lets us to create a react element based on another one, and when doing this we can also pass in props which will solve the issue of passing the prop
  const { open } = useContext(ModalContext);
  // This also overwrites the current onClick handler on the children
  // e.g. before we used cloneElement the delete buttons on BookingDetail deleted the booking without asking anything because it already was deleting when that button was pressed before we added the modal. But the cloneElement overwritten the delete onClick handler to the open handler

  return cloneElement(children, { onClick: () => open(windowName) });
  // return render(() => open(windowName));
}

// ! Reason to use portal
// Modal was working perfectly before we introduced the portal so why we need it?
// The main reason why portal becomes necessary is in order to avoid conflicts with the CSS property overflow:hidden. Many times we build a component like a modal, and it works just fine, but then some other developer will re-use it somewhere else, and that somewhere else might be a place where the modal will get cut off by the overflow hidden set on the parent. So this is all about re-usability, and making sure that the overflow: hidden on some parent won't cause a cut off issue. So in order to avoid this problem we render the modal outside of the current DOM tree, which in this case we are rendering it as a child of the body, outside of the React application. React is rendered inside another div inside of the body. So React app and the modal are siblings in the DOM tree. This would still might cause a cutting off issue if the body was set to overflow: hidden

// React portal is a feature that allows us render an element outside of the parent components DOM structure while still keeping the element in the original position of the component tree. In other words with a portal we can basically render a component in any place we want inside the DOM tree, but still leave the component at the same place in the React component tree, so that things like props etc. keeps working normally.
// This is great an generally used for all elements that we want to stay on top of other elements, things like modal windows, tooltips, menus, and etc.
function Window({ children, name }: WindowProps) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  // createPortal takes in the JSX as the first argument, and takes the container for where the JSX will be rendered as the second argument. It also takes in an optional argument of key
  return createPortal(
    <Overlay>
      {/* We can use onClick={close} instead of using a ref and get the same result, BUT only for this kind of click detection, because we are not detecting a click outside when we do this, we are actually detecting a click on the overlay, which is fine for this use case because we always have the overlay with the modal, but if we did not or use the outside click detection for something else it would not work. 
      egg. We are also using the outside click detection on the Menus Component and it needs this approach to work correctly
      
       */}
      {/* <Overlay onClick={close}> */}
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    // We have attached the modal to the body, some developers say that this is not ideal but works for this case, we could of also used the querySelector to select another DOM element for the container.
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
