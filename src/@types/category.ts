import { IProduct } from './product';

export type ICategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type ICategoryState = {
  isLoading: boolean;
  error: Error | string | null;
  categories: ICategory[];
  category: ICategory | null;
};

export type CategoryHomeProps = {
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string;
    products: IProduct[];
  }[];
};
