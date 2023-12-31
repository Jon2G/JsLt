import { IPlan } from './IPlan';
export enum RequestAction {
    CreatePlan = "CreatePlan",
    Execute = "Execute"
}

export interface IRequest {
    action: RequestAction
    planId:string
    executionId:string
    plan?: IPlan
}