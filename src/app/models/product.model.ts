export interface Product {
  id: string;
  name: string;
  image: string;
  price: {
    loose: number;
    box: number;
  };
  qty: {
    loose: number;
    box: number;
  };
}
