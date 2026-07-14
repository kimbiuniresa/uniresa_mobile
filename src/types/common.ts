export type PaymentMethod =
  | "Credit_Card"
  | "MobileMoney"
  | "Manual"
  | "Uniresa_Wallet"
  | "Paypal"
  | "Bank_Transfer"
  | "Bank_Deposit"
  | "Cash";


export type BookingStatus = "Confirmed" | "Cancelled" | "Completed" | "Pending";
export type BookingPaymentStatus = "Unpaid" | "Paid" | "Refunded" | "Failed";
export type Timestamp = {
  _seconds: number;
  _nanoseconds: number;
};

export interface RoomTypeRequest {
  roomTypeId: string;
  units: number;
  roomName: string;
}

export type PropertyType =
  | "Hotel"
  | "Bungalow"
  | "Furnished Apartment"
  | "Furnished House"
  | "Villa"
  | "Cottage"
  | "Guesthouse"
  | "Hostel"
  | "Resort";

export interface Address {
  street?: string;
  city?: string;
  district?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}

export interface LocationDetails {
  street?: string;
  city: string;
  cityNormalized?: string;
  district?: string;
  region?: string;
  regionNormalized?: string;
  postalCode?: string;
  country: string;
  countryNormalized?: string;
  latitude?: number;
  longitude?: number;
}

export interface Destination {
  street?: string;
  city: string;
  district?: string;
  region?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Guests {
  adults: number;
  children: number;
}

export interface Photo {
  id: string;
  image: string;
}

export interface ParsedLocation {
  city: string;
  country: string;
  region?: string;
  district?: string;
  slug: string;
  fullName: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Country {
  cca2: string;
  callingCode: string;
  name: {
    common: string;
  };
}

export type CountryCode = string;
