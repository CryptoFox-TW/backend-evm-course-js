class Printer {
  constructor() {
    this.print = this.print.bind(this);
  }

  static print(key, value) {
    console.log(`\n====================\n`);
    if (typeof value === 'object') {
      console.log(
        `${key}: ${JSON.stringify(
          value,
          (key, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          2
        )}`
      );
    } else {
      console.log(`${key}: ${value}`);
    }
  }
}

module.exports = Printer;
