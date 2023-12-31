import { IRequest } from "typesafe/IRequest";
import DocumentDbConnection from "../documentDb/connection";

export interface InstanceVar {
  request: IRequest;
  db: DocumentDbConnection;
}

export default class InstanceVars {
  private static vars: { [key: string]: InstanceVar } = {};

  private static get key(): string {
    const key = process.env["executionId"];
    if (key == undefined) {
      throw new Error("executionId is undefined");
    }
    return key;
  }

  public static set var(value: InstanceVar) {
    this.vars[this.key] = value;
  }
  public static get var(): InstanceVar  {
    return this.vars[this.key];
  }
  public static get db(): DocumentDbConnection  {
    return this.vars[this.key].db;
  }
  public static get request(): IRequest {
    const r = this.vars[this.key].request;
    if (r == undefined) {
      throw new Error("request is undefined");
    }
    return r;
  }

}
