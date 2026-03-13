import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  search = '';
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.allProducts = await this.productService.getInventoryProducts();
    this.applyFilter();
  }
  normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  tokenize(text: string): string[] {
    return this.normalize(text).split(' ');
  }

  levenshtein(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, () =>
      Array(b.length + 1).fill(0),
    );

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + 1,
              );
      }
    }

    return dp[a.length][b.length];
  }

  isFuzzyMatch(word: string, target: string): boolean {
    const len = word.length;

    if (len <= 2) return false;

    const targetPrefix = target.slice(0, len);

    const distance = this.levenshtein(word, targetPrefix);

    if (len <= 4) return distance <= 2;
    if (len <= 7) return distance <= 2;
    return distance <= 3;
  }

  applyFilter() {
    const query = this.normalize(this.search);

    if (!query) {
      this.filteredProducts = this.allProducts;
      return;
    }

    const queryWords = this.tokenize(query);
    const resultMap = new Map<string, Product>();

    for (const product of this.allProducts) {
      const productWords = this.tokenize(product.name);

      for (const qWord of queryWords) {
        if (productWords.some((pw) => pw.startsWith(qWord))) {
          resultMap.set(product.id, product);
          continue;
        }

        if (productWords.some((pw) => this.isFuzzyMatch(qWord, pw))) {
          resultMap.set(product.id, product);
        }
      }
    }

    this.filteredProducts = Array.from(resultMap.values());
  }

  addQty(product: Product, type: 'loose' | 'box') {
    this.productService.addOrUpdateFromInventory(product, type, +1);
  }

  removeQty(product: Product, type: 'loose' | 'box') {
    this.productService.addOrUpdateFromInventory(product, type, -1);
  }

  getQty(product: Product, type: 'loose' | 'box'): number {
    return this.productService.getQty(product.id, type);
  }

  trackById(index: number, item: Product) {
    return item.id;
  }

  getTotalItems(): number {
    return this.productService.getTotalItems();
  }

  getTotal(): number {
    return this.productService.getTotalAmount();
  }

  // goToCart() {
  //   this.router.navigate(['/cart']);
  // }

  // get hasSelectedItems(): boolean {
  //   return this.productService.getTotalItems() > 0;
  // }

  onContinue() {
    this.router.navigate(['/']);
  }
}
