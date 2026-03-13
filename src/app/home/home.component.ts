import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  showValidationError = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    if (params['contactNumber']) {
      this.productService.setContactNumber(params['contactNumber']);
    }
    if (params['products']) {
      const parsed = JSON.parse(params['products']);
      this.products = this.productService.setProductsFromQuery(parsed);
    } else {
      this.products = this.productService.getProducts();
    }
  }

  addQty(product: Product, type: 'loose' | 'box') {
    product.qty[type]++;
    this.productService.updateProducts(this.products);
  }

  removeQty(product: Product, type: 'loose' | 'box') {
    if (product.qty[type] > 0) {
      product.qty[type]--;
      this.productService.updateProducts(this.products);
    }
  }

  getTotal(): number {
    return this.products.reduce(
      (sum, p) => sum + p.qty.loose * p.price.loose + p.qty.box * p.price.box,
      0
    );
  }

  getTotalItems(): number {
    return this.products.reduce((count, p) => {
      return count + p.qty.loose + p.qty.box;
    }, 0);
  }

  isInvalid(product: Product): boolean {
    return product.qty.loose === 0 && product.qty.box === 0;
  }

  goToCart() {
    const hasInvalid = this.products.some((p) => this.isInvalid(p));

    if (hasInvalid) {
      this.showValidationError = true;
      return;
    }

    this.showValidationError = false;
    this.router.navigate(['/cart']);
  }

  goToInventory() {
    this.router.navigate(['/inventory']);
  }

  removeProduct(product: Product) {
    this.productService.removeProduct(product.id);
    this.products = this.productService.getProducts();
  }
}
