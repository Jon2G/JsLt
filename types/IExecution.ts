import { Document } from "mongodb";
export enum EExecutionStatus{
    Running = "Running",
    Completed = "Completed",
    Failed = "Failed",
    Pending = "Pending"
}

export interface IExecution {
  _id: string;
  planId: string;
  status: EExecutionStatus;
  startTimestamp?: number;
  endTimestamp?: number;
}

export interface IRequestMetric extends Document {
  _id: string;
  planId: string;
  executionId: string;

  beginTimestamp: number;
  endTimestamp: number;
  duration: number;
  url: string;
  status: number;
  method: string;
  requestHeaders?: Headers | HeadersInit;
  responseHeaders: Headers | HeadersInit;
  body: string;
  response?: Response;
}
