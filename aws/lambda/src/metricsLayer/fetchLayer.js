"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lt_fetch = void 0;
const requestRepoter_1 = require("./requestRepoter");
function lt_fetch(input, init) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fetchStartTimestamp = Date.now();
            const fetchResponse = yield fetch(input, init);
            const fetchEndTimestamp = Date.now();
            const fetchDuration = fetchEndTimestamp - fetchStartTimestamp;
            yield (0, requestRepoter_1.reportRequest)({
                timestamp: fetchEndTimestamp,
                beginTimestamp: fetchStartTimestamp,
                endTimestamp: fetchEndTimestamp,
                duration: fetchDuration,
                url: input.toString(),
                status: fetchResponse === null || fetchResponse === void 0 ? void 0 : fetchResponse.status,
                method: (init === null || init === void 0 ? void 0 : init.method) || "UNKNOWN",
                requestHeaders: (init === null || init === void 0 ? void 0 : init.headers) || undefined,
                responseHeaders: fetchResponse === null || fetchResponse === void 0 ? void 0 : fetchResponse.headers,
                body: yield (fetchResponse === null || fetchResponse === void 0 ? void 0 : fetchResponse.text()),
                response: fetchResponse,
            });
            return fetchResponse;
        }
        catch (e) {
            console.error(e);
            return undefined;
        }
    });
}
exports.lt_fetch = lt_fetch;
