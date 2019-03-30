class AppContext {
  constructor() {
    this.beanMap = new Map();
  }

  getBean(beanName) {
    return this.beanMap.get(beanName);
  }

  put(beaName, beanObj) {
    this.beanMap.set(beaName, beanObj);
  }
}

export default new AppContext();
