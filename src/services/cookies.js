import Cookies from "universal-cookie";

const cookies = new Cookies();

class CookieService {
  // get
  get(name) {
    return cookies.get(name);
  }
  // set
  set(name, value, options) {
    return cookies.set(name, value, { ...options });
  }
  // remove
  remove(name, options) {
    return cookies.remove(name, { ...options });
  }
}

export default new CookieService();
