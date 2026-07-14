export interface DiscountOptions {
  includeSponsored?: boolean;
  lastMinute?: boolean;
  seasonal?: boolean;
  loyaltyProgram?: boolean;
  longStay?: boolean;
  earlyBird?: boolean;
  group?: boolean;
  flash?: boolean;
  corporate?: boolean;
  geographic?: boolean;
  dynamicPricing?: boolean;
  nonRefundable?: boolean;
  repeatCustomer?: boolean;
  eventBased?: boolean;
  socialMedia?: boolean;
  firstTimeCustomer?: boolean;
}

export interface BlackOutRange {
  startPeriod: Date;
  endPeriod: Date;
}

export interface TimeConditions {
  startDate: Date;
  endDate: Date;
  bookingPeriod?: {
    startArrivalDate: Date;
    endArrivalDate: Date;
  };
  periodicity?: {
    type: "OneTime" | "Recurring";
    recurrencePattern?: "Daily" | "Weekly" | "Monthly" | "Yearly";
    specificDates?: Date[];
    daysOfWeek?: number[];
    monthsOfYear?: number[];
    blackoutPeriod?: BlackOutRange[];
  };
}

export interface EligibilityConditions {
  location?: {
    city?: string;
    country?: string;
    region?: string;
  };
  propertyTypes?: string[];
  minStarRating?: number;
  maxStarRating?: number;
  minPricePerNight?: number;
  maxPricePerNight?: number;
  minStay?: number;
  maxStay?: number;
  eligibilityFlags?: DiscountOptions;
}

export interface RuleCondition {
  type:
    | "MinStay"
    | "MaxStay"
    | "CheckInDay"
    | "CheckOutDay"
    | "BookingLeadTime"
    | "WeekdayDiscount"
    | "WeekendDiscount"
    | "AdvanceBooking"
    | "SameDayBooking"
    | "MinBookingAmount"
    | "MaxBookingAmount";
  value: number | string;
}

export interface SegmentConditions {
  loyaltyLevel?: "Bronze" | "Silver" | "Gold" | "Platinum";
  isFirstTimeCustomer?: boolean;
  totalBookings?: { min?: number; max?: number };
  totalSpent?: { min?: number; max?: number };
  country?: string[];
  ageRange?: { min?: number; max?: number };
  userType?: "Corporate" | "Leisure" | "Student" | "Senior" | "Military";
  customTags?: string[];
  requireAllConditions?: boolean;
}

export interface Discount {
  id: string;
  appliesTo: (
    | "AllProperties"
    | "SpecificProperties"
    | "SpecificRoomTypes"
    | "ByConditions"
    | "ByUserSegment"
  )[];
  propertyIds?: string[];
  roomTypeIds?: string[];
  time?: TimeConditions;
  eligibility?: EligibilityConditions;
  rules?: RuleCondition[];
  exclusions?: {
    propertyIds?: string[];
    roomTypeIds?: string[];
    excludeNonRefundable?: boolean;
    userSegments?: SegmentConditions;
  };
  lastMinuteDiscount?: {
    enabled: boolean;
    daysBeforeArrival: number;
    requireAvailability?: boolean;
    minAvailabilityPercentage?: number;
    maxDiscountPercentage?: number;
  };
  userSegment?: SegmentConditions;
  referralDiscount?: { isActive: boolean; referralCode?: string };
  promoCode?: { isActive: boolean; code?: string; maxUses?: number };
  priority?: number;
  combinable?: boolean;
  discountType: "Percentage" | "FixedAmount" | "FreeNight" | "Bundle";
  discountValue: number;
  status?:
    | "Active"
    | "Pending"
    | "Cancelled"
    | "Expired"
    | "Draft"
    | "Paused"
    | "Archived";
  discountDescription?: string;
  timezone?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface GetPaginatedDiscountsResponse {
  data: Discount[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface DiscountedPropertyInfo {
  discountedPrice: number;
  initialPrice: number;
  discountPercentage: number;
}

export interface CityDiscountSummary {
  cheapestRoomPrice: number;
  initialRoomPrice: number;
  discountPercentage: number;
  discountedProperties: DiscountedPropertyInfo[];
}
