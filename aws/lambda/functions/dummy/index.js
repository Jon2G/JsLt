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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handlerWrapper_1 = __importDefault(require("./lambdaContext/handlerWrapper"));
const test_1 = require("./test");
function handler(event, context) {
    return handlerWrapper_1.default.run(event, context, () => __awaiter(this, void 0, void 0, function* () {
        //
        //User test code here
        yield (0, test_1.testRun)();
        //
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "hello world",
            }),
        };
    }));
}
exports.handler = handler;
