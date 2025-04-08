import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import { IBooking } from "../../types";
import Menus from "../../ui/Menus";
import {
  HiArrowDownOnSquare,
  HiArrowUp,
  HiEye,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../check-in-out/useCheckout";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./useDeleteBooking";
import CreateBookingForm from "./CreateBookingForm";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

interface BookingRowProps {
  booking: IBooking;
}

function BookingRow({ booking }: BookingRowProps) {
  const {
    id: bookingId,

    startDate,
    endDate,
    numNights,

    totalPrice,
    status,
    guests,
    cabins,
  } = booking;
  const { deleteBooking, isDeleting } = useDeleteBooking();
  const navigate = useNavigate();
  const { checkOut, isCheckingOut } = useCheckout();
  const guestName = Array.isArray(guests)
    ? guests[0]?.fullName
    : guests?.fullName;
  const email = Array.isArray(guests) ? guests[0]?.email : guests?.email;

  const cabinName = Array.isArray(cabins) ? cabins[0]?.name : cabins?.name;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  if (!startDate || !endDate || !status || !totalPrice || !bookingId)
    return null;

  return (
    <Table.Row>
      <>
        <Cabin>{cabinName}</Cabin>

        <Stacked>
          <span>{guestName}</span>
          <span>{email}</span>
        </Stacked>

        <Stacked>
          <span>
            {isToday(new Date(startDate))
              ? "Today"
              : formatDistanceFromNow(startDate)}
            &rarr; {numNights} night stay
          </span>
          <span>
            {format(new Date(startDate), "MMM dd yyyy")} &mdash;
            {format(new Date(endDate), "MMM dd yyyy")}
          </span>
        </Stacked>

        <Tag type={statusToTagName[status as keyof typeof statusToTagName]}>
          {status.replace("-", " ")}
        </Tag>

        <Amount>{formatCurrency(totalPrice)}</Amount>
        {/* Modal needs to be outside of the menu because menu closes after we click on a button, and if modal is inside the menu modal unmounts with the menu as well */}
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={bookingId} />
            <Menus.List id={bookingId}>
              <>
                <Menus.Button
                  icon={<HiEye />}
                  onClick={() => navigate(`/bookings/${bookingId}`)}
                >
                  See Details
                </Menus.Button>
                {status === "unconfirmed" && (
                  <Menus.Button
                    icon={<HiArrowDownOnSquare />}
                    onClick={() => navigate(`/checkin/${bookingId}`)}
                  >
                    Check in
                  </Menus.Button>
                )}
                {status === "checked-in" && (
                  <Menus.Button
                    icon={<HiArrowUp />}
                    onClick={() => {
                      checkOut(bookingId);
                    }}
                    disabled={isCheckingOut}
                  >
                    Check out
                  </Menus.Button>
                )}

                <Modal.Open
                  opens="edit-booking"
                  // This is an example for using render props instead of cloneElement, the render prop is not in use right now but this shows how to do it
                  render={(onClick: () => void) => {
                    // console.log("open", open);
                    return (
                      <Menus.Button
                        onClick={() => onClick()}
                        icon={<HiPencil />}
                      >
                        Edit
                      </Menus.Button>
                    );
                  }}
                >
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>
                <Modal.Open opens="confirm-delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </>
            </Menus.List>

            <Modal.Window name="edit-booking">
              <CreateBookingForm bookingToEdit={booking} />
            </Modal.Window>

            <Modal.Window name="confirm-delete">
              <ConfirmDelete
                resourceName="booking"
                disabled={isDeleting}
                onConfirm={() => deleteBooking(bookingId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </>
    </Table.Row>
  );
}

export default BookingRow;
