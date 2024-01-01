import InstanceVars from "../lambdaContext/instanceVars";
import { reportRequest } from "./requestRepoter";
import { Guid } from "guid-typescript";

export async function lt_fetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response | undefined> {
  try {
    console.log("fetch", input, init);
    const fetchStartTimestamp = Date.now();
    const fetchResponse: Response | undefined = await fetch(input, init);
    const fetchEndTimestamp = Date.now();
    const fetchDuration = fetchEndTimestamp - fetchStartTimestamp;
    await reportRequest({
      _id: Guid.create().toString(),
      planId: InstanceVars.request.planId,
      executionId: InstanceVars.request.executionId,
      timestamp: fetchEndTimestamp,
      beginTimestamp: fetchStartTimestamp,
      endTimestamp: fetchEndTimestamp,
      duration: fetchDuration,
      url: input.toString(),
      status: fetchResponse?.status,
      method: init?.method || "UNKNOWN",
      requestHeaders: init?.headers || undefined,
      responseHeaders: fetchResponse?.headers,
      response: fetchResponse,
    });
    return fetchResponse;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
