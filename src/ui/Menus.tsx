import { MouseEvent, createContext, useContext, useState } from "react";
// import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  /* I have added position relative for scrolling of the contextual menu to work */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

interface StyleListProps {
  $position: IPosition | null;
}
const StyledList = styled.ul<StyleListProps>`
  /* position: fixed; */
  /* I have changed the position to absolute for scrolling of the contextual menu to work */
  position: absolute;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position?.x}px;
  top: ${(props) => props.$position?.y}px;
  z-index: 10000;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;
  flex-grow: 1;
  /* We added this because we have modified the code to allow for the context menu to follow scrolling, and if do not add this the text overlaps itself when there is a space between e.g. "See Details" button in the booking context menu */
  white-space: nowrap;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface IMenusContext {
  openId: string;
  close: () => void;
  open: (id: string) => void;
  position: IPosition | null;
  setPosition: React.Dispatch<null | IPosition>;
}

const MenusContext = createContext({} as IMenusContext);

interface MenusProps {
  children: React.ReactElement;
}

interface IPosition {
  x: number;
  y: number;
}

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState<null | IPosition>(null);
  const close = () => setOpenId("");
  const open = setOpenId;
  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

interface ToggleProps {
  id: number | string;
}

function Toggle({ id }: ToggleProps) {
  id = id.toString();
  const { open, close, openId, setPosition } = useContext(MenusContext);

  function handleClick(e: MouseEvent) {
    // We need this to fix the contextual menu not closing on pressing the menu button bug
    e.stopPropagation();

    openId === "" || openId !== id ? open(id.toString()) : close();

    const target = e.target as HTMLElement;
    const rect = target.closest("button")?.getBoundingClientRect();
    if (!rect) return null;
    setPosition({
      // x: window.innerWidth - rect?.width - rect?.x,
      // This is my implementation, this works when the CSS property of the StyledList is changed to left instead of right
      // x: rect?.x - rect?.width *2.5,
      // y: rect?.y + rect?.height + 8,

      // This is my custom implementation for scrolling of the contextual menu to work, for this we needed to set the position to absolute in the StyledList and we needed to disable set the overflow: hidden in the Table component
      x: -rect?.width / 2,
      y: rect?.height + 8,
    });
  }
  return (
    <StyledToggle onClick={(e) => handleClick(e)}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListProps {
  id: string | number;
  children: React.ReactElement;
}
function List({ id, children }: ListProps) {
  const { openId, position, close } = useContext(MenusContext);

  // const ref = useOutsideClick<HTMLUListElement>(close);
  const ref = useOutsideClick<HTMLUListElement>(() => {
    close();
    // we added false to fix a bug where clicked the contextual menu button was not closing the menu
  }, false);

  if (openId !== id.toString()) return null;

  return (
    <StyledList ref={ref} $position={position}>
      {children}
    </StyledList>
  );
}

interface ButtonProps {
  children: React.ReactElement | string;
  icon: React.ReactElement | string;
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
}
function Button({ children, icon, onClick, disabled }: ButtonProps) {
  const { close } = useContext(MenusContext);
  function handleClick(e: MouseEvent) {
    onClick?.(e);
    close();
  }
  return (
    <li>
      <StyledButton onClick={handleClick} disabled={disabled}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
