export class ParamsHandler {
  private params: Record<string, any> = {};

  constructor() {}

  public addParam(key: string, value: any, ignoreNull = true) {
    if (!ignoreNull || value != null) {
      this.params[key] = value;
    }
    return this;
  }

  public getParams(): Record<string, any> {
    return this.params;
  }

  public clear() {
    delete this.params;
    this.params = {};
  }

  public count() {
    return Object.keys(this.params).length;
  }

  public get urlParameters(): string {
    let objStr = "";
    Object.keys(this.params).forEach((key) => {
      if (this.params[key] !== "") {
        objStr += key + "=" + encodeURIComponent(this.params[key]) + "&";
      }
    });
    return objStr.substring(0, objStr.length - 1);
  }
}
