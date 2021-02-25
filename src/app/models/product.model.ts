export class Product {
  constructor(
    public name: string,
    public price: number,
    public stock: number,
    public date?: Date,
    public id?: number
  ) {}
}
