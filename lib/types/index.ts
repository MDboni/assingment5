export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";

export type PropertyStatus =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "RENTED"
  | "ARCHIVED";

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PAYMENT_PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"; 

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELED" 
  | "REFUNDED";

export type PaymentProvider = "STRIPE" | "SSLCOMMERZ";


export type ApiMeta = { page: number; limit: number; total: number };

export type ApiSuccess<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiError = {
  success: false;
  statusCode: number;
  message: string;
  errorDetails?: { path: string; message: string }[];
};


export type ApiResult<T> = ApiSuccess<T> | ApiError;


export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  propertyCount?: number;
};

export type Property = {
  id: string;
  landlordId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  area: string;
  monthlyRent: number;
  securityDeposit: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  availableFrom: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Pick<Category, "id" | "name" | "slug">;
  landlord?: Pick<User, "id" | "name" | "phone" | "bio">;
  reviewCount?: number;
};

export type RentalRequest = {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  moveInDate: string;
  moveOutDate: string | null;
  message: string | null;
  landloardNote: string | null;
  quotedAmount: number;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  property?: Partial<Property>;
  tenant?: Pick<User, "id" | "name" | "email" | "phone">;
  landlord?: Pick<User, "id" | "name" | "phone">;
};

export type Payment = {
  id: string;
  rentalRequestId: string;
  tenantId: string;
  transactionId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  tenant?: Pick<User, "id" | "name">;
};



export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};



export type PropertyDetail = Property & {
  reviews: Review[];
  ratingSummary: {
    average: number;
    total: number;
  };
};


export type LandlordProperty = Property & {
  pendingRequestCount: number;
};
