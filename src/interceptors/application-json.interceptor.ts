import { BeforeInterceptor } from "../services/http.service.ts";

export const ApplicationJsonInterceptor: BeforeInterceptor = (config) => {
  config.headers = config.headers || {};
  (config.headers as any)["Accept"] = "application/json";
  return config;
};
