export class ExceptionUtils {
	static getExceptionMessage(e: Error | unknown | any): string {
		if (e && e.message) {
			return e.message
		}
		return e
	}
}