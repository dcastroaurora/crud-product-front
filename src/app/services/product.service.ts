import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProductResponse } from '../interfaces/product-response.interface';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  newProduct: EventEmitter<number> = new EventEmitter<number>();
  editProduct: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProductResponse<Product[]>> {
    return this.http.get<IProductResponse<Product[]>>(
      `${environment.base_url}/product`
    );
  }

  createProduct(product: Product): Observable<IProductResponse<number>> {
    return this.http.post<IProductResponse<number>>(
      `${environment.base_url}/product`,
      product
    );
  }

  deleteProduct(id?: number): Observable<IProductResponse<number>> {
    return this.http.delete<IProductResponse<number>>(
      `${environment.base_url}/product/${id}`
    );
  }

  updateProduct(product: Product): Observable<IProductResponse<number>> {
    return this.http.put<IProductResponse<number>>(
      `${environment.base_url}/product`,
      product
    );
  }
}
