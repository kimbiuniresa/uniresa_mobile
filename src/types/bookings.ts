export interface SearchCriteria {
  destination: Destination;
  checkInDate: string;
  checkOutDate: string;
  guests: Guests;
  minGuests: number;
  minRooms: number;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  minStars?: number;
  amenities?: Amenity[];
  propertyType?:
    | "Hotel Room"
    | "Apartment"
    | "Bungalow"
    | "House"
    | "Villa"
    | "Studio";
  propertyName?: string;
  sortBy?: string;
  limit: number;
  startAfter?: string;
  startBefore?: string;
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

export interface Amenity {
  amenityName: string;
  amenityId: string;
  amenityDescription?: string;
  isAvailable: boolean;
  isPopular: boolean;
}
