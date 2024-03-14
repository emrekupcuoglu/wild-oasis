import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";
import { useEffect } from "react";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

interface ConfirmDeleteProps {
  resourceName: string;
  disabled: boolean;
  onConfirm: () => void;
  onCloseModal?: () => void;
}

function ConfirmDelete({
  resourceName,
  onConfirm,
  disabled,
  // this comes from the parent component Modal
  onCloseModal,
}: ConfirmDeleteProps) {
  useEffect(() => {
    function keyPressHandler(e: KeyboardEvent) {
      console.log("ekey", e.key);
      if (e.key === "Enter") {
        onConfirm();
      }
    }
    document.addEventListener("keypress", keyPressHandler);
    return () => document.removeEventListener("keypress", keyPressHandler);
  });
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName}</Heading>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div>
        <Button
          $variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button $variation="danger" disabled={disabled} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
