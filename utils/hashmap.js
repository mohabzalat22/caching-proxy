import { generateKey } from "./generateKey.js";

class Record {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

export class HashMap {
  constructor() {
    this.records = [];
  }

  hash(key) {
    if (!process.env.secret) {
      throw new Error("SECRET environment variable is not set");
    }
    if (!key) {
      throw new Error("Key cannot be empty");
    }
    return generateKey(process.env.secret, key);
  }

  set(key, value) {
    const exists = this.records.find((item) => item.key === this.hash(key));
    if (!exists) {
      const hashedKey = this.hash(key);
      this.records.push(new Record(hashedKey, value));
    }
  }

  get(key) {
    const item = this.records.find((item) => item.key === this.hash(key));
    return item ? item.value : undefined;
  }

  remove() {
    let index = -1;
    const item = this.records.find((item, index) => {
      const exists = item.key === key;
      if (exists) {
        index = index;
      }
      return exists;
    });

    if (item && index != -1) {
      this.records.splice(index, 1);
    }
  }

  clear(){
    this.records = [];
  }
}
