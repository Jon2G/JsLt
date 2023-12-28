import { reportRequest } from "./requestRepoter";

export async function lt_fetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response | undefined> {
  try {
    const fetchStartTimestamp = Date.now();
    const fetchResponse: Response | undefined = await fetch(input, init);
    const fetchEndTimestamp = Date.now();
    const fetchDuration = fetchEndTimestamp - fetchStartTimestamp;
    await reportRequest({
      timestamp: fetchEndTimestamp,
      beginTimestamp: fetchStartTimestamp,
      endTimestamp: fetchEndTimestamp,
      duration: fetchDuration,
      url: input.toString(),
      status: fetchResponse?.status,
      method: init?.method || "UNKNOWN",
      requestHeaders: init?.headers || undefined,
      responseHeaders: fetchResponse?.headers,
      body: await fetchResponse?.text(),
      response: fetchResponse,
    });
    return fetchResponse;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
