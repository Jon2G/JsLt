import { ExecutionMode } from "./ExecutionMode";

export interface IPlan {
    _id: string;
    numberOfExecutions: number;
    spaceBetween: number;
    mode: ExecutionMode
}