// src/app/models/product.model.ts
export interface Product {
  proCode: number;
  proIden: string;
  proName: string;
  proDescription: string;
  proPrice: number;
  proStockQuantity: number;
  proIsActive: boolean;
  createdAt: string;
  updatedAt: string;
  wallet?: any;
}