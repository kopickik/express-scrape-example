class ExamplesDatabase {
  constructor() {
    this._data = [];
    this._counter = 0;

    this.insert('example 0');
    this.insert('example 1');
  }

  all() {
    return Promise.resolve(this._data);
  }

  byId(id) {
    return Promise.resolve(this._data[id]);
  }

  insert(body) {
    const record = {
      id: this._counter,
      name: body.name,
      year: body.year,
    };

    this._counter += 1;
    this._data.push(record);

    return Promise.resolve(record);
  }
}

export default new ExamplesDatabase();
