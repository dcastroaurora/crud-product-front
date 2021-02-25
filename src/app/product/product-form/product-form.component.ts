import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProductResponse } from 'src/app/interfaces/product-response.interface';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup = new FormGroup({});
  editProductSubscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnDestroy(): void {
    this.editProductSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm();
    this.editProductListener();
  }

  editProductListener() {
    this.editProductSubscription = this.productService.editProduct.subscribe(
      (res: Product) => {
        console.log('lolkkk');
        console.log(res);
        this.setFormProduct(res);
      }
    );
  }

  setFormProduct(product: Product) {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  }

  get id() {
    return this.productForm.get('id');
  }

  get name() {
    return this.productForm.get('name');
  }

  get validName() {
    return this.name?.invalid && (this.name?.dirty || this.name?.touched);
  }

  get price() {
    return this.productForm.get('price');
  }

  get validPrice() {
    return this.price?.invalid && (this.price?.dirty || this.price?.touched);
  }

  get validPriceRequired() {
    return (
      this.price?.errors?.required && (this.price?.dirty || this.price?.touched)
    );
  }

  get validPricePattern() {
    return (
      this.price?.errors?.pattern && (this.price?.dirty || this.price?.touched)
    );
  }

  get stock() {
    return this.productForm.get('stock');
  }

  get validStockRequired() {
    return (
      this.stock?.errors?.required && (this.stock?.dirty || this.stock?.touched)
    );
  }

  get validStockPattern() {
    return (
      this.stock?.errors?.pattern && (this.stock?.dirty || this.stock?.touched)
    );
  }

  get validStock() {
    return this.stock?.invalid && (this.stock?.dirty || this.stock?.touched);
  }

  onSubmit() {
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      if (this.id?.value) {
        this.productService
          .updateProduct({
            id: this.id.value,
            name: this.name?.value,
            price: Number(this.price?.value),
            stock: Number(this.stock?.value),
          })
          .subscribe(
            (res: IProductResponse<number>) => {
              this.productService.newProduct.emit(res.data);
              this.toastr.success('Submitted successfully', 'Product Updated');
              this.productForm.reset();
            },
            (error) => {
              this.toastr.success('Submitted error', 'An occurred error');
            }
          );
      } else {
        delete this.productForm.value.id;
        this.productService
          .createProduct({
            name: this.name?.value,
            price: Number(this.price?.value),
            stock: Number(this.stock?.value),
          })
          .subscribe(
            (res: IProductResponse<number>) => {
              this.productService.newProduct.emit(res.data);
              this.toastr.success('Submitted successfully', 'Product Register');
              this.productForm.reset();
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }

  createForm() {
    const numRegex = /^-?\d*[.,]?\d{0,2}$/;
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(numRegex)]],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }
}
