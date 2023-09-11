export enum ProjectType {
    PROJECT = "PROJECT",
}
export enum MachineStatus {
    READY_TO_START = "READY_TO_START",
    RUNNING = "RUNNING",
    OFF = "OFF",
}

export enum ExecutionStatus {
    RUNNING = "RUNNING",
    FINISHED = "FINISHED",
    ERROR = "ERROR",
    CANCELED = "CANCELED",
    READY_TO_START = "READY_TO_START",
}

export enum LogLevel{
    TRACE="TRACE",
    ERROR="ERROR",
}

export interface ILog{
    Message: string;
    LogLevel: LogLevel;
    LogTime: number;
}

export interface IMachineDetails {
    Id: string;
    MachineStatus: MachineStatus;
    Message: string;
    index: number;
    MachineLogs: ILog[];
}

export interface IExecutionDetails {
    Id: string;
    ExecutionStatus: ExecutionStatus;
    index: number;
    machinesNumber: number;
    Machines:(IMachineDetails|Partial<IMachineDetails>)[];
}

export default interface IProjectDetails {
    PartitionKey: string;
    S3_BUCKET: string;
    S3_PROJECT_ZIP: string;
    Executions:(IExecutionDetails|Partial<IExecutionDetails>)[]
}