import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  API_TOKEN,
  ORDER_API_URL,
  ORDER_DEFAULTS,
  WHATSAPP_REDIRECT_URL,
} from '../constants/api.constants';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  products: Product[] = [];
  isSubmitting = false;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
  }

  getCartItems(): Product[] {
    return this.products.filter((p) => p.qty.loose > 0 || p.qty.box > 0);
  }

  getItemTotal(product: Product): number {
    return (
      product.qty.loose * product.price.loose +
      product.qty.box * product.price.box
    );
  }

  getTotal(): number {
    return this.products.reduce(
      (total, p) =>
        total + p.qty.loose * p.price.loose + p.qty.box * p.price.box,
      0,
    );
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const contactNumber = this.productService.getContactNumber();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: API_TOKEN,
    });

    const cartItems = this.getCartItems();
    const body = {
      items: cartItems.map((item) => ({
        item_name: item.name,
        loose_qty: item.qty?.loose ?? 0,
        box_qty: item.qty?.box ?? 0,
        amount_inr: this.getItemTotal(item),
      })),
      total_amount_inr: this.getTotal(),
      retailerName: ORDER_DEFAULTS.retailerName,
      distributorName: ORDER_DEFAULTS.distributorName,
      orderNumber: ORDER_DEFAULTS.orderNumber,
      orderDate: new Date().toLocaleDateString(),
      contactNumber,
    };

    this.http.post<any>(ORDER_API_URL, body, { headers }).subscribe({
      next: (res) => {
        window.location.href = WHATSAPP_REDIRECT_URL;
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
      },
    });
  }
}
