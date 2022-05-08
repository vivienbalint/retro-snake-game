class Level {
  #speed;
  #size;

  constructor(speed, size) {
    this.#speed = speed;
    this.#size = size;
  }

  getSize() {
    return this.#size;
  }

  getSpeed() {
    return this.#speed;
  }
}
