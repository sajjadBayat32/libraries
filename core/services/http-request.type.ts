export declare type HttpVerb = "GET" | "POST" | "DELETE" | "PUT";

export interface Response<T = any> {
  data: T;
  message: string;
  success: boolean;
}

export interface BaseHttpConfig {
  baseUrl: string;
  ignoreNullParams?: boolean;
  replaceSamePendingRequest?: boolean;
  messageShow?: boolean;
  hasLoading?: boolean;
  ignoreAuthToken?: boolean;
}
