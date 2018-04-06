// for getting an arbitrary ordering of a collection without having to 
// keep track of it somewhere else
class Order {
  private current: number;
  constructor() {
    this.current = 0;
  }

  next() {
    this.current += 1;
    return this.current;
  }

  reset() {
    this.current = 0;
  }
}

export const order = new Order();