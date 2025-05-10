export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class ResponseBuilder {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return { success: true, message: message, data };
  }

  static error(message: string): ApiResponse<never> {
    return { success: false, message };
  }
}
