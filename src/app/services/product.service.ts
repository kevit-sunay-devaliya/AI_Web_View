import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];
  private contactNumber: string | null = null;

  constructor(private http: HttpClient) {}

  setContactNumber(num: string | null) {
    this.contactNumber = num;
  }

  getContactNumber(): string | null {
    return this.contactNumber;
  }

  setProductsFromQuery(apiResponse: any): Product[] {
    this.products =
      apiResponse?.items?.flatMap((item: any) => {
        if (!Array.isArray(item.variants)) return [];

        return item.variants.map((variant: any) => ({
          id: `${variant.item_name}_${variant.item_code}`,
          name: variant.item_name,
          image: variant.image,
          price: {
            loose: Number(variant.unit_price) || 0,
            box: Number(variant.box_price) || 0,
          },
          qty: {
            loose: item?.loose_quantity || 0,
            box: item?.box_quantity || 0,
          },
        }));
      }) || [];

    this.persist();
    return this.products;
  }

  getProducts(): Product[] {
    if (this.products.length) {
      return this.products;
    }

    const stored = localStorage.getItem('products');
    this.products = stored ? JSON.parse(stored) : [];
    return this.products;
  }

  updateProducts(products: Product[]) {
    this.products = products;
    this.persist();
  }

  private persist() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  private mapInventoryResponse(apiResponse: any): Product[] {
    return apiResponse.data.flatMap((product: any) => {
      if (!Array.isArray(product.variants)) return [];

      return product.variants.map((variant: any) => ({
        id: `${variant.itemName}_${variant.itemCode}`,
        name: variant.itemName,
        image: variant.image,
        price: {
          loose: Number(variant.unitPrice) || 0,
          box: Number(variant.boxPrice) || 0,
        },
        qty: {
          loose: 0,
          box: 0,
        },
      }));
    });
  }

  getInventoryProducts() {
    const apiResponse = {
      data: [
        {
          productId: 'DAB-001',
          itemName: 'Chyawanprash',
          variants: [
            {
              itemCode: '1',
              itemName: 'Chyawanprash 1kg',
              shortName: '1kg',
              unitType: 'Piece',
              unitSize: '1kg Jar',
              piecesPerBox: 12,
              unitPrice: 350,
              boxPrice: 4000,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073101250_chamaan.jpg',
            },
            {
              itemCode: '2',
              itemName: 'Chyawanprash 750g',
              shortName: '750g',
              unitType: 'Piece',
              unitSize: '750g Jar',
              piecesPerBox: 12,
              unitPrice: 320,
              boxPrice: 3600,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073101250_chamaan.jpg',
            },
            {
              itemCode: '3',
              itemName: 'Chyawanprash Sugarfree 500g',
              shortName: '500g Sugarfree',
              unitType: 'Piece',
              unitSize: '500g Jar',
              piecesPerBox: 24,
              unitPrice: 290,
              boxPrice: 6400,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073415558_sugar-free-chyawanprash-500x500.jpg',
            },
          ],
        },
        {
          productId: 'DAB-002',
          itemName: 'Honey 500g',
          variants: [
            {
              itemCode: '1',
              itemName: 'Honey 500g',
              shortName: '500g',
              unitType: 'Piece',
              unitSize: '500g Bottle',
              piecesPerBox: 24,
              unitPrice: 250,
              boxPrice: 5800,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073056670_honey.jpg',
            },
          ],
        },
        {
          productId: 'DAB-003',
          itemName: 'Toothpaste',
          variants: [
            {
              itemCode: '1',
              itemName: 'Red Toothpaste 200g',
              shortName: '200g Red',
              unitType: 'Piece',
              unitSize: '200g Tube',
              piecesPerBox: 48,
              unitPrice: 95,
              boxPrice: 4200,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764072761069_toothpaste.jpg',
            },
            {
              itemCode: '2',
              itemName: 'Meswak Toothpaste 200g',
              shortName: '200g Meswak',
              unitType: 'Piece',
              unitSize: '200g Tube',
              piecesPerBox: 48,
              unitPrice: 90,
              boxPrice: 3800,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073018591_mesvak.jpg',
            },
          ],
        },
        {
          productId: 'DAB-004',
          itemName: 'Amla Hair Oil 450m',
          variants: [
            {
              itemCode: '1',
              itemName: 'Amla Hair Oil 450ml',
              shortName: '450ml',
              unitType: 'Piece',
              unitSize: '450ml Bottle',
              piecesPerBox: 24,
              unitPrice: 150,
              boxPrice: 3200,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764074893241_amlahairoil_1_.jpg',
            },
          ],
        },
        {
          productId: 'DAB-005',
          itemName: 'Giloy Neem Juice 1L',
          variants: [
            {
              itemCode: '1',
              itemName: 'Giloy Neem Juice 1L',
              shortName: '1L',
              unitType: 'Piece',
              unitSize: '1L Bottle',
              piecesPerBox: 12,
              unitPrice: 220,
              boxPrice: 2500,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764072970134_neem.jpg',
            },
          ],
        },
        {
          productId: 'DAB-006',
          itemName: 'Shampoo',
          variants: [
            {
              itemCode: '1',
              itemName: 'Vatika Shampoo 650ml',
              shortName: '650ml Vatika',
              unitType: 'Piece',
              unitSize: '650ml Bottle',
              piecesPerBox: 12,
              unitPrice: 220,
              boxPrice: 2400,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764072733486_vatika.jpg',
            },
            {
              itemCode: '2',
              itemName: 'Baby Shampoo 200ml',
              shortName: '200ml Baby',
              unitType: 'Piece',
              unitSize: '200ml Bottle',
              piecesPerBox: 48,
              unitPrice: 95,
              boxPrice: 4000,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073124547_baby.jpg',
            },
          ],
        },
        {
          productId: 'DAB-007',
          itemName: 'Pudin Hara 30ml',
          variants: [
            {
              itemCode: '1',
              itemName: 'Pudin Hara 30ml',
              shortName: '30ml',
              unitType: 'Piece',
              unitSize: '30ml Bottle',
              piecesPerBox: 48,
              unitPrice: 45,
              boxPrice: 1900,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764072880598_pudinhara_1_.jpg',
            },
          ],
        },
        {
          productId: 'DAB-008',
          itemName: 'Lal Tail 100ml',
          variants: [
            {
              itemCode: '1',
              itemName: 'Lal Tail 100ml',
              shortName: '100ml',
              unitType: 'Piece',
              unitSize: '100ml Bottle',
              piecesPerBox: 48,
              unitPrice: 70,
              boxPrice: 2800,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073207787_image.jpeg',
            },
          ],
        },
        {
          productId: 'DAB-009',
          itemName: 'Honitus Cough Syrup 100ml',
          variants: [
            {
              itemCode: '1',
              itemName: 'Honitus Cough Syrup 100ml',
              shortName: '100ml',
              unitType: 'Piece',
              unitSize: '100ml Bottle',
              piecesPerBox: 48,
              unitPrice: 75,
              boxPrice: 3200,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764072782930_syrip.jpg',
            },
          ],
        },
        {
          productId: 'DAB-010',
          itemName: 'Hajmola Regular 120 Tabs',
          variants: [
            {
              itemCode: '1',
              itemName: 'Hajmola Regular 120 Tabs',
              shortName: '120 Tabs',
              unitType: 'Piece',
              unitSize: '120 Tablet Bottle',
              piecesPerBox: 24,
              unitPrice: 65,
              boxPrice: 1400,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073038728_image_1_.jpeg',
            },
          ],
        },
        {
          productId: 'DAB-011',
          itemName: 'Shilajit Gold Capsules 20 pcs',
          variants: [
            {
              itemCode: '1',
              itemName: 'Shilajit Gold Capsules 20 pcs',
              shortName: '20 pcs',
              unitType: 'Piece',
              unitSize: '20 Capsules Pack',
              piecesPerBox: 24,
              unitPrice: 250,
              boxPrice: 5000,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764072858811_shilajit.jpg',
            },
          ],
        },
        {
          productId: 'DAB-012',
          itemName: 'Stresscom Capsules 30 pcs',
          variants: [
            {
              itemCode: '1',
              itemName: 'Stresscom Capsules 30 pcs',
              shortName: '30 pcs',
              unitType: 'Piece',
              unitSize: '30 Capsules Pack',
              piecesPerBox: 24,
              unitPrice: 170,
              boxPrice: 3600,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073237810_stress.jpg',
            },
          ],
        },
        {
          productId: 'DAB-013',
          itemName: 'Real Juice',
          variants: [
            {
              itemCode: '1',
              itemName: 'Real Mixed Fruit Juice 1L',
              shortName: '1L Mixed Fruit',
              unitType: 'Piece',
              unitSize: '1L Tetra Pak',
              piecesPerBox: 12,
              unitPrice: 110,
              boxPrice: 1200,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764074824018_mix_1_.jpg',
            },
            {
              itemCode: '2',
              itemName: 'Real Orange Juice 1L',
              shortName: '1L Orange',
              unitType: 'Piece',
              unitSize: '1L Tetra Pak',
              piecesPerBox: 12,
              unitPrice: 110,
              boxPrice: 1200,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764072917053_orange.jpg',
            },
          ],
        },
        {
          productId: 'DAB-014',
          itemName: 'Odomos Mosquito Repellent Cream 100g',
          variants: [
            {
              itemCode: '1',
              itemName: 'Odomos Mosquito Repellent Cream 100g',
              shortName: '100g',
              unitType: 'Piece',
              unitSize: '100g Tube',
              piecesPerBox: 48,
              unitPrice: 75,
              boxPrice: 3100,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764072949494_odomus.jpg',
            },
          ],
        },
        {
          productId: 'DAB-015',
          itemName: 'Glucose-D 500g',
          variants: [
            {
              itemCode: '1',
              itemName: 'Glucose-D 500g',
              shortName: '500g',
              unitType: 'Piece',
              unitSize: '500g Pouch',
              piecesPerBox: 48,
              unitPrice: 70,
              boxPrice: 2800,
              image:
                'https://d224vx500f9iwr.cloudfront.net/image/image_1764073084969_glucodi.jpg',
            },
          ],
        },
      ],
    };
    return this.mapInventoryResponse(apiResponse);
  }

  addOrUpdateFromInventory(
    product: Product,
    type: 'loose' | 'box',
    delta: number,
  ) {
    this.products = this.getProducts();
    const existing = this.products.find((p) => p.id === product.id);
    if (!existing && delta > 0) {
      this.products.push({
        ...product,
        qty: {
          loose: type === 'loose' ? 1 : 0,
          box: type === 'box' ? 1 : 0,
        },
      });
    } else if (existing) {
      existing.qty[type] = Math.max(0, existing.qty[type] + delta);
    }

    this.persist();
  }

  getQty(productId: string, type: 'loose' | 'box'): number {
    const product = this.products.find((p) => p.id === productId);
    return product ? product.qty[type] : 0;
  }

  getTotalItems(): number {
    return this.products.reduce((sum, p) => sum + p.qty.loose + p.qty.box, 0);
  }

  getTotalAmount(): number {
    return this.products.reduce(
      (sum, p) => sum + p.qty.loose * p.price.loose + p.qty.box * p.price.box,
      0,
    );
  }

  removeProduct(productId: string) {
    this.products = this.products.filter((p) => p.id !== productId);
    this.persist();
  }
}
