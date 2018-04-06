
// Creates a pseudo-random value generator. The seed must be an integer.
class Random {
  _seed: number;
  constructor(seed: number) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
  }

  // Returns a pseudo-random value between 1 and 2^32 - 2.
  next() {
    return this._seed = this._seed * 16807 % 2147483647;
  }

  // Returns a pseudo-random value between min (inclusive) and max
  between(min: number, max: number) {
    const mod = max - min;
    return (this.next() % mod) + min;
  }

  // Returns a pseudo-random floating point number in range [0, 1).
  nextFloat() {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.next() - 1) / 2147483646;
  }
}

const random = new Random(1231);

export default random;