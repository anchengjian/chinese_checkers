class LocalStorage {
  constructor() {

  }

  get(key) {
    let val = localStorage.hasOwnProperty(key) ? localStorage.getItem(key) : null;
    if (!val && val !== 0) return;
    let res;
    try {
      res = JSON.parse(val);
    } catch (e) {
      console.log(e);
    }
    return res;
  }

  set(key, val) {
    if (Object.prototype.toString.call(val) === '[object String]') return localStorage.setItem(key, val);
    localStorage.setItem(key, JSON.stringify(val));
  }

  delete(key) {
    delete localStorage[key];
  }
}

export default new LocalStorage();
