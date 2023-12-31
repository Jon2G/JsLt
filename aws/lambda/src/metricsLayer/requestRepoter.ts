import { Document } from "mongodb";
import DocumentDbConnection from "../documentDb/connection";
import InstanceVars from "../lambdaContext/instanceVars";

export enum Collections {
  Executions = "Executions",
  RequestMetrics = "RequestMetrics",
  Plans = "Plans",
}

export interface RequestMetric extends Document {
  _id: string;
  planId: string;
  executionId: string;

  timestamp: number;
  beginTimestamp: number;
  endTimestamp: number;
  duration: number;
  url: string;
  status: number;
  method: string;
  requestHeaders?: Headers | HeadersInit;
  responseHeaders: Headers | HeadersInit;
  body?: string;
  response?: Response;
};

export async function reportRequest(metric: RequestMetric): Promise<void> {
  console.log("reporting request");
  const db= InstanceVars.var.db;
  if(db == undefined){
    throw new Error("db is undefined");
  }
  const collection = await db.getCollection<RequestMetric>(Collections.RequestMetrics);
  await collection.insertOne(metric);
}
