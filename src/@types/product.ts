// ----------------------------------------------------------------------

export type IProductReview = {
  id: string;
  name: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  isPurchased: boolean;
  helpful: number;
  postedAt: Date | string | number;
};

export type IProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date | string | number;
};

export type IProductBrand = {
  id: string;
  name: string;
  slug: string;
  phone: string;
  site: string;
  fax: string;
  mail: string;
  description: string;
  photo: IProductPhoto;
  address: string;
  createdAt: Date | string | number;
};
export type IProductCountry = {
  name: string;
  code: string;
  createdAt: Date | string | number;
  id: string;
};

export type IProductPhoto = {
  id: string;
  path: string;
};
export type IProduct = {
  id: string;
  slug: string;
  cover: string;
  barCode: string;
  brand: IProductBrand | null;
  category: IProductCategory | null;
  country: IProductCountry | null;
  photo: IProductPhoto;
  photos: IProductPhoto[];
  images: string[];
  name: string;
  price: number;
  quantity: number;
  code: string;
  sku: string;
  tags: string[];
  priceSale: number | null;
  totalRating: number;
  totalReview: number;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  reviews: IProductReview[];
  colors: string[];
  status: string;
  inventoryType: string;
  sizes: string[];
  available: number;
  description: string;
  introduction: string;
  sold: number;
  createdAt: Date | string | number;
  gender: string;
};

export type IProductFilter = {
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
  rating: string;
  sortBy: string;
};

// ----------------------------------------------------------------------

export type ICheckoutCartItem = {
  id: string;
  name: string;
  cover: string;
  photo: IProductPhoto;
  available: number;
  price: number;
  colors: string[];
  size: string;
  quantity: number;
  subtotal: number;
};

export type ICheckoutBillingAddress = {
  receiver: string;
  email: string;
  phoneNumber: string;
  fullAddress: string;
  addressType: string;
  isDefault: boolean;
};

export type ICheckoutDeliveryOption = {
  value: number;
  title: string;
  description: string;
};

export type ICheckoutPaymentOption = {
  value: string;
  title: string;
  description: string;
  icons: string[];
};

export type ICheckoutCardOption = {
  value: string;
  label: string;
};

// ----------------------------------------------------------------------

export type IProductCheckoutState = {
  activeStep: number;
  cart: ICheckoutCartItem[];
  subtotal: number;
  total: number;
  discount: number;
  shipping: number;
  billing: ICheckoutBillingAddress | null;
  totalItems: number;
};

export type IProductState = {
  isLoading: boolean;
  error: Error | string | null;
  products: IProduct[];
  product: IProduct | null;
  checkout: IProductCheckoutState;
};
