export interface Perfume {
  id: string;
  name: string;
  category: 'Homme' | 'Femme' | 'Unisexe';
  size: string;
  price: number;
  image_url: string;
  description: string;
  in_stock: boolean;
}

export interface CartPerfumeItem {
  id: string;
  type: 'perfume';
  perfume: Perfume;
  quantity: number;
}

export interface BouquetPerfumeItem {
  perfume: Perfume;
  quantity: number;
}

export interface CartBouquetItem {
  id: string;
  type: 'bouquet';
  items: BouquetPerfumeItem[];
  quantity: number;
  isGift: boolean;
  giftMessage?: string;
}

export type CartItem = CartPerfumeItem | CartBouquetItem;

export type DeliveryMethod = 'cash_on_delivery';

export interface CustomerDetails {
  fullName: string;
  phone: string;
}

export interface DeliveryDetails {
  method: DeliveryMethod;
  address: string;
  note?: string;
}

export interface OrderIndividualItem {
  perfumeId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderBouquetLineItem {
  perfumeId: string;
  quantityPerBouquet: number;
  unitPrice: number;
}

export interface OrderBouquetItem {
  quantity: number;
  isGift: boolean;
  giftMessage?: string;
  items: OrderBouquetLineItem[];
}

export interface Order {
  customer: CustomerDetails;
  delivery: DeliveryDetails;
  items: {
    individual: OrderIndividualItem[];
    bouquets: OrderBouquetItem[];
  };
  totalAmount: number;
}

export interface OrderConfirmation {
  orderReference: string;
  customerName: string;
  totalAmount: number;
  createdAt: string;
}
