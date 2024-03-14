import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";
import { useDarkMode } from "../contexts/useDarkMode";

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  if (!toggleDarkMode) return null;
  return (
    <ButtonIcon onClick={toggleDarkMode}>
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  );
}

export default DarkModeToggle;
