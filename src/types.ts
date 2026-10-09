export interface Product {
  id: number;
  name: string;
  price: number | string;
  description: string;
  inStock: boolean;
  rare?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}