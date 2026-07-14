import type { PaymentMethod, LocationDetails } from "./common";
import type { DiscountOptions } from "./discount";
 
export interface Amenity {
  amenityName: string;
  amenityId: string;
  amenityDescription?: string;
  isAvailable: boolean;
  isPopular: boolean;
}

export interface PropertyState {
  selectedProperty: AccommodationProperty | undefined;
}
 
export interface Policies {
  isSmokingAllowed: boolean;
  isPetsAllowed: boolean;
  childrenAllowed: boolean;
  additionalPolicies?: string;
}
 
export interface CheckInDetails {
  checkIn: string;
  checkOut: string;
  checkInInfo: string;
  propertyAccessDetails?: string;
  paymentMethods?: PaymentMethod[];
  pets?: string;
}
 
export interface PriceDetails {
  currency: string;
  pricePerNight: number;
  taxesAndFeesIncluded?: boolean;
  taxesAndFees?: number;
}
 
export interface NearbyAttraction {
  attractionId: string;
  name: string;
  distance: number;
  type:
    | "Restaurant"
    | "Museum"
    | "Park"
    | "Landmark"
    | "Shopping Center"
    | "Beach"
    | "Zoo"
    | "Historical Site";
}
 
export interface HealthAndSafetyMeasures {
  enhancedCleaning: boolean;
  contactlessCheckIn: boolean;
  handSanitizerAvailable: boolean;
  [key: string]: boolean | undefined;
}
 
export interface KeyCollection {
  toBeCollectedInProperty: boolean;
  hasSaveBox?: boolean;
  address?: string;
  contactNumber?: string;
  email?: string;
  code?: string;
  keyHolderName?: string;
  details?: string;
}
 
export interface SecurityDetails {
  hasSecurityGuard?: boolean;
  securityGuardCoverage?: string;
  securityFence?: boolean;
  securityCamera?: boolean;
  hasAlarmSystem?: boolean;
  hasSafeBox?: boolean;
  hasVisitorScreening?: boolean;
  neighborhoodSecurityLevel?: "low" | "medium" | "high";
  hasFireExtinguishers?: boolean;
  hasSecurityDogs?: boolean;
  hasBackupGenerator?: boolean;
  hasSecurePerimeterLighting?: boolean;
}
 
export interface ExtraService {
  serviceId: string;
  serviceName: string;
  description: string;
  qty: number;
  price: number;
  currency: string;
  isMandatory: boolean;
  isActive: boolean;
  extraServiceCommission: number;
}
 
export interface FinalCleaning {
  finalCleaningIncluded: boolean;
  cleaningFee: number;
  currency: string;
}
 
export interface TaxesDetails {
  taxRate?: number;
  taxeAmount?: number;
  taxDescription?: string;
  additionalFees?: string;
}
 
export interface PropertyReviewSummary {
  averageRating: number;
  totalReviews: number;
  categoryRatings?: Record<string, number>;
}
 
export interface BedroomDetails {
  name?: string;
  surface: number;
  beds: number;
  bedTypes: string[];
  hasEnsuiteBathroom?: boolean;
}
 
export interface BathroomDetails {
  name?: string;
  surface: number;
  hasBathtub?: boolean;
  hasShower?: boolean;
  hasToilet?: boolean;
  hasDoubleSink?: boolean;
  separateWC?: boolean;
}
 
export interface LivingRoomDetails {
  surface: number;
  hasSofaBed?: boolean;
  hasTV?: boolean;
  hasFireplace?: boolean;
}
 
export interface OutdoorSpaceDetails {
  hasBalcony?: boolean;
  balconySurface?: number;
  hasTerrace?: boolean;
  terraceSurface?: number;
  hasGarden?: boolean;
  gardenSurface?: number;
}
 
export interface KitchenEquipment {
  hasRefrigerator: boolean;
  hasStove: boolean;
  hasOven?: boolean;
  hasMicrowave?: boolean;
  hasElectricKettle: boolean;
  hasCoffeeMaker?: boolean;
  hasToaster?: boolean;
  hasBlender?: boolean;
  hasRiceCooker?: boolean;
  hasCookware: boolean;
  hasDinnerware: boolean;
  hasUtensils: boolean;
  hasCuttingBoard?: boolean;
  hasMortarAndPestle?: boolean;
  hasGrater?: boolean;
  hasBasicSpices?: boolean;
  hasCleaningSupplies?: boolean;
  hasWaterFilter?: boolean;
  hasGasCylinder?: boolean;
  hasCharcoalStove?: boolean;
  hasFirewoodStove?: boolean;
  hasDishwasher?: boolean;
  hasWineGlasses?: boolean;
  hasFoodProcessor?: boolean;
}
 
export interface AvailabilityDetails {
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
  bookingId?: string;
  notes?: string;
}
 
export interface RoomInventory {
  date: Date;
  availableUnits: number;
  bookedUnits: number;
  totalUnits: number;
  lastUpdated: Date;
}
 
export interface RoomType {
  roomId: string;
  propertyId: string;
  type: "Hotel Room" | "Apartment" | "Bungalow" | "House" | "Villa" | "Studio";
  name: string;
  description: string;
  surface: number;
  capacity: number;
  totalUnits: number;
  unitNumber?: string;
  availableUnitsForStay: number;
  roomInventories: RoomInventory[];
  roomContractStartDate: Date;
  roomContractEndDate: Date;
  bedrooms: BedroomDetails[];
  bathrooms?: BathroomDetails[];
  livingRoom?: LivingRoomDetails;
  outdoorSpace?: OutdoorSpaceDetails;
  hasPrivateEntrance?: boolean;
  kitchen?: KitchenEquipment & { hasKitchen?: boolean };
  priceDetails: PriceDetails;
  roomAvailabilities: AvailabilityDetails[];
  roomBookings?: string[];
  roomAcceptedDiscounts?: DiscountOptions;
  isRefundable: boolean;
  amenities: Amenity[];
  roomImages: string[];
  isActive: boolean;
  updatedBy?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}
 
export interface PropertyBookingData {
  userId: string;
  bookingId: string;
  roomTypeIds: string[];
  checkInDate: Date;
  checkOutDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
 
export interface AccommodationProperty {
  propertyId: string;
  propertyName: string;
  propertyType:
    | "Hotel"
    | "Bungalow"
    | "Furnished Apartment"
    | "Furnished House"
    | "Villa"
    | "Cottage"
    | "Guesthouse"
    | "Hostel"
    | "Resort";
  tagMessage: string;
  description: string;
  location: LocationDetails;
  propertyImages: string[];
  propertyAmenities: Amenity[];
  policies: Policies;
  checkInDetails: CheckInDetails;
  isSponsored: boolean;
  sponsoredFrom?: Date;
  sponsoredUntil?: Date;
  sponsorshipAmount?: number;
  sponsorshipCategory:
    | "Platinum"
    | "Gold"
    | "Silver"
    | "Bronze"
    | "Basic"
    | "NonSponsored";
  sponsorshipRank: number;
  sponsorshipCurrency?: string;
  commissionRate: number;
  acceptDiscounts?: DiscountOptions;
  extraServices?: ExtraService[];
  additionalCost?: string;
  taxesAndOthers?: TaxesDetails;
  additionalInfo?: string;
  finalCleaning?: FinalCleaning;
  numberOfStars: number;
  reviewsSummary?: PropertyReviewSummary;
  numberOfReviews: number;
  reviewsRating?: number;
  roomTypes: RoomType[];
  propertyBookings?: PropertyBookingData[];
  distanceFromCityCenter?: number;
  distanceFromSea?: number;
  nearbyAttractions?: NearbyAttraction[];
  popularFacilities?: string;
  healthAndSafetyMeasures?: HealthAndSafetyMeasures;
  cancellationPolicy: string;
  keyCollection?: KeyCollection;
  security?: SecurityDetails;
  hostUserId: string;
  propertyDiscountsList?: string[];
  contractStartDate: Date;
  contractEndDate: Date;
  contractStatus: "Pending" | "Active" | "Terminated" | "Expired";
  updatedBy?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}
 
export interface HostDetails {
  hostUserId: string;
  hostType: "individual" | "company";
  hostName: string;
  phoneNumber1: string;
  emailCustomerService: string;
  emailFinance?: string;
  hostRating?: number;
  responseRate?: string;
  responseTime?: string;
  joinedDate?: Date;
  verified?: boolean;
  description?: string;
  languages: string[];
  profilePicture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  socialMediaLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  companyDetails?: {
    registrationNumber?: string;
    taxId?: string;
    foundingYear?: number;
    numberOfEmployees?: number;
  };
  individualDetails?: {
    dateOfBirth?: Date;
    nationality?: string;
    governmentId?: string;
  };
}