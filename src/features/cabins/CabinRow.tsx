import styled from "styled-components";
import { ICabin } from "../../types";
import { formatCurrency, getImageNameFromUrl } from "../../utils/helpers";

import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateCabin } from "./useCreateCabin";
import Modal from "../../ui/Modal";

import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

interface CabinRowProps {
  cabin: ICabin;
}
function CabinRow({ cabin }: CabinRowProps) {
  const {
    name,
    maxCapacity,
    id: cabinId,
    image,
    regularPrice,
    discount,
    description,
  } = cabin;

  const { deleteCabin, isDeleting } = useDeleteCabin();
  const { isCreating, createCabin } = useCreateCabin();
  if (!cabin) return null;

  if (!cabinId || !regularPrice || !image) return null;

  const imageName = getImageNameFromUrl(image);

  function handleDuplicate() {
    if (!name || !maxCapacity || !image || !regularPrice || !description)
      return;
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      image,
      regularPrice,
      discount,
      description,
    });
  }

  return (
    <Table.Row>
      <>
        <Img src={image} />
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={cabinId} />
              <Menus.List id={cabinId}>
                <>
                  <Menus.Button
                    icon={<HiSquare2Stack />}
                    onClick={handleDuplicate}
                    disabled={isCreating}
                  >
                    Duplicate
                  </Menus.Button>

                  <Modal.Open opens="edit-form">
                    <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                  </Modal.Open>

                  <Modal.Open opens="confirm-delete">
                    <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                  </Modal.Open>
                </>
              </Menus.List>

              <Modal.Window name="edit-form">
                <CreateCabinForm cabinToEdit={cabin} />
              </Modal.Window>

              <Modal.Window name="confirm-delete">
                <ConfirmDelete
                  disabled={isDeleting}
                  resourceName="cabin"
                  onConfirm={() => deleteCabin({ id: cabinId, imageName })}
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </>
    </Table.Row>
  );
}

export default CabinRow;