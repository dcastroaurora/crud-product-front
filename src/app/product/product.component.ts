import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProductResponse } from '../interfaces/product-response.interface';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  productSubscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}
  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getProducts();
    this.newProductListener();
  }

  newProductListener() {
    this.productSubscription = this.productService.newProduct.subscribe(() => {
      this.getProducts();
    });
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (res: IProductResponse<Product[]>) => {
        console.log(res);
        this.products = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteProduct(id?: number) {
    if (confirm('Are you sure you want to delete it?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.getProducts();
          this.toastr.success('Deleted successfully', 'Product Deleted');
        },
        (error) => console.log(error)
      );
    }
  }

  updateProduct(product: Product) {
    console.log(product);
    this.productService.editProduct.emit(product);
  }
}
