export interface ICabin {
  created_at?: string;
  description?: string | null;
  discount?: number | null;
  id?: number | null;
  image?: string | null;
  maxCapacity?: number | null;
  name?: string | null;
  regularPrice?: number | null;
}

export interface ICabinFormData {
  created_at?: Date;
  description?: string | null;
  discount?: number | null;
  id?: number;
  image?: FileList | undefined;
  maxCapacity?: number;
  name?: string;
  regularPrice?: number;
}

export interface ICabinSupabaseUploadData {
  description?: string | null;
  discount?: number | null;
  image?: File | string | null;
  maxCapacity?: number | null;
  name?: string | null;
  regularPrice?: number | null;
}

export interface ISettings {
  id?: number | null;
  created_at?: string | null;
  breakfastPrice?: number | null;
  maxGuestPerBooking?: number | null;
  maxBookingLength?: number | null;
  minBookingLength?: number | null;
}

export interface IUpdateSettings {
  id?: number;
  created_at?: string;
  breakfastPrice?: number;
  maxGuestPerBooking?: number;
  maxBookingLength?: number;
}

export interface IGuest {
  created_at?: string | null;
  fullName?: string | null;
  email?: string | null;
  nationality?: string | null;
  nationalID?: string | null;
  countryFlag?: string | null;
  country?: string | null;
}

export interface IBooking {
  id?: number;
  created_at?: string;
  startDate?: string | null;
  endDate?: string | null;
  numNights?: number | null;
  numGuests?: number | null;
  totalPrice?: number | null;
  cabinPrice?: number | null;
  extrasPrice?: number | null;
  hasBreakfast?: boolean | null;
  observations?: string | null;
  isPaid?: boolean | null;
  status?: string | null;
  guests?: IGuest | null;
  cabins?: ICabin | ICabin[] | null;
}

export type FilterMethod =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "like"
  | "ilike"
  | "is"
  | "in";

export interface IBookingFilter {
  field: string;
  value: string;
  method: FilterMethod;
}

export interface IBookingForm {
  // cabin: string;
  // guest: string;
  status: string;
  totalPrice: string;
}
