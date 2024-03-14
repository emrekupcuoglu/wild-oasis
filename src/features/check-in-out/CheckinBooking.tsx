import styled from "styled-components";
import BookingDataBox from "../bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import Spinner from "../../ui/Spinner";
import { ChangeEvent, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./useCheckin";
import { useSettings } from "../settings/useSettings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState<null | boolean>(null);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const moveBack = useMoveBack();

  const { checkIn, isCheckingIn } = useCheckin();

  const { booking, isLoading: bookingLoading } = useBooking();
  const { settings, isLoading: settingLoading } = useSettings();

  if (!booking) return null;

  if (bookingLoading || settingLoading) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
    isPaid,
  } = booking;

  if (!booking) return null;
  if (!guests) return null;

  const { fullName } = guests;

  if (
    !fullName ||
    isPaid === null ||
    totalPrice === null ||
    !numNights ||
    !numGuests
  )
    return null;

  const optionalBreakfastPrice = settings?.breakfastPrice
    ? settings.breakfastPrice * numNights * numGuests
    : 0;

  if (
    confirmPaid === null &&
    booking.isPaid !== undefined &&
    booking.isPaid !== null
  ) {
    setConfirmPaid(booking.isPaid);
  }

  if (confirmPaid === null) return null;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast && !hasBreakfast && totalPrice) {
      checkIn({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      checkIn({ bookingId });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && optionalBreakfastPrice && (
        <Box>
          <Checkbox
            id="breakfast"
            checked={addBreakfast}
            onChange={(e: ChangeEvent) => {
              const target = e.target as HTMLInputElement;
              const checked = target.checked;
              setAddBreakfast((prev) => !prev);

              if (!checked) {
                setConfirmPaid(isPaid);
              } else setConfirmPaid(false);
            }}
            disabled={
              settingLoading || !!hasBreakfast || !optionalBreakfastPrice
            }
          >
            {`Add breakfast for the price of ${optionalBreakfastPrice}?`}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((prev) => !prev)}
          id="confirm"
          disabled={(isPaid || isCheckingIn) && !addBreakfast}
        >
          I confirm that {fullName} has paid the total amount of{" "}
          {addBreakfast
            ? `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )})`
            : formatCurrency(totalPrice)}
        </Checkbox>
      </Box>
      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
