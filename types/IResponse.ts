export enum IResponseStatus {
	SUCCESS = 'SUCCESS',
	INTERNAL_ERROR = 'INTERNAL_ERROR',
	NOT_EXECUTED = 'NOT_EXECUTED',
	JWT_ACCESO_NO_VALIDO = 'JWT_ACCESO_NO_VALIDO',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	NOT_UPDATED = 'NOT_UPDATED',
	UNAUTHORIZED = 'UNAUTHORIZED',
	BAD_REQUEST = 'BAD_REQUEST'
}
export interface IResponseMetaData {
	status: IResponseStatus
	message?: string
}

export interface IResponse<T> {
	metaData: IResponseMetaData
    data: T
}
