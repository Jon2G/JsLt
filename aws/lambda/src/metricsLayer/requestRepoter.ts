export type RequestMetric = {
  timestamp: number;
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
};

export async function reportRequest(metric: RequestMetric): Promise<void> {
  console.log("reporting request");
}
