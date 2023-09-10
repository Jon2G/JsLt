export enum ProjectType {
    PROJECT = "PROJECT",
}
export default interface IProjectDetails {
    PartitionKey: string;
    S3_BUCKET: string;
    S3_PROJECT_ZIP: string;
    Type: ProjectType;
}