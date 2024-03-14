import { ChangeEvent } from "react";
import styled from "styled-components";

const StyledCheckbox = styled.div`
  display: flex;
  gap: 1.6rem;

  & input[type="checkbox"] {
    height: 2.4rem;
    width: 2.4rem;
    outline-offset: 2px;
    transform-origin: 0;
    accent-color: var(--color-brand-600);
  }

  & input[type="checkbox"]:disabled {
    accent-color: var(--color-brand-600);
  }

  & label {
    flex: 1;

    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
`;

interface CheckBoxProps {
  checked: boolean;
  onChange: (e: ChangeEvent) => void;
  disabled: boolean;
  id: string;
  children: React.ReactElement | React.ReactElement[] | string | string[];
}

function Checkbox({
  checked,
  onChange,
  disabled = false,
  id,
  children,
}: CheckBoxProps) {
  return (
    <StyledCheckbox>
      <input
        type="checkbox"
        id={id.toString()}
        checked={checked}
        onChange={(e: ChangeEvent) => onChange(e)}
        disabled={disabled}
      />
      <label htmlFor={!disabled ? id.toString() : ""}>{children}</label>
    </StyledCheckbox>
  );
}

export default Checkbox;
