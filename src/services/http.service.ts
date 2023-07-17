import { ajax, AjaxConfig, AjaxResponse } from "rxjs/ajax";
import { from, Observable, of, OperatorFunction, switchMap } from "rxjs";
import { Injectable, InjectMulti } from "../container/container-decorator.ts";
import {
  AfterInterceptorInj,
  BeforeInterceptorInj,
} from "../container/container-tokens.ts";

export type BeforeInterceptor = (
  config: AjaxConfig
) => Promise<AjaxConfig> | AjaxConfig | Observable<AjaxConfig>;
export type AfterInterceptor<T = any> = (
  response: AjaxResponse<T>
) => Observable<AjaxResponse<T>> | AjaxResponse<T> | Promise<AjaxResponse<T>>;

@Injectable()
export class HttpService {
  protected ajaxInstance;

  constructor(
    @InjectMulti(BeforeInterceptorInj)
    protected beforeInterceptors: BeforeInterceptor[] = [],
    @InjectMulti(AfterInterceptorInj)
    protected afterInterceptors: AfterInterceptor[] = []
  ) {
    this.ajaxInstance = ajax;
  }

  /**
   * Get request
   * @param url
   * @param config
   */
  public get<T>(
    url: string,
    config?: Omit<AjaxConfig, "url" | "body">
  ): Observable<AjaxResponse<T>> {
    return this.executeRequest({ url, method: "GET", ...config });
  }

  /**
   * Post request
   * @param url
   * @param body
   * @param config
   */
  public post<T>(
    url: string,
    body: any,
    config?: Omit<AjaxConfig, "url" | "body">
  ): Observable<AjaxResponse<T>> {
    return this.executeRequest({ url, body, method: "POST", ...config });
  }

  /**
   * Post request
   * @param url
   * @param body
   * @param config
   */
  public put<T>(
    url: string,
    body: any,
    config?: Omit<AjaxConfig, "url" | "body">
  ): Observable<AjaxResponse<T>> {
    return this.executeRequest({ url, body, method: "PUT", ...config });
  }

  /**
   * Put request
   * @param url
   * @param body
   * @param config
   */
  public patch<T>(
    url: string,
    body: any,
    config?: Omit<AjaxConfig, "url" | "body">
  ): Observable<AjaxResponse<T>> {
    return this.executeRequest({ url, body, method: "PATCH", ...config });
  }

  /**
   * Delete request
   * @param url
   * @param config
   */
  public delete<T>(
    url: string,
    config?: Omit<AjaxConfig, "url" | "body">
  ): Observable<AjaxResponse<T>> {
    return this.executeRequest({ url, method: "DELETE", ...config });
  }

  protected executeRequest<T>(config: AjaxConfig): Observable<AjaxResponse<T>> {
    const beforeInterceptors: OperatorFunction<AjaxConfig, AjaxConfig>[] =
      this.beforeInterceptors.map((interceptor) =>
        switchMap((requestConfig: AjaxConfig) => {
          const result = interceptor(requestConfig);

          if (result instanceof Promise) {
            return from(result);
          }

          if (result instanceof Observable) {
            return result;
          }

          return of(result);
        })
      );

    let execution: Observable<AjaxConfig> | Observable<AjaxResponse<T>> =
      of(config);

    for (const interceptor of beforeInterceptors) {
      execution = execution.pipe(interceptor);
    }

    execution = execution.pipe<AjaxResponse<T>>(
      switchMap((requestConfig) => this.ajaxInstance<T>(requestConfig))
    );

    const afterInterceptors: OperatorFunction<
      AjaxResponse<T>,
      AjaxResponse<T>
    >[] = this.afterInterceptors.map((interceptor) =>
      switchMap((response: AjaxResponse<T>) => {
        const result = interceptor(response);

        if (result instanceof Promise) {
          return from(result);
        }

        if (result instanceof Observable) {
          return result;
        }

        return of(result);
      })
    );

    for (const interceptor of afterInterceptors) {
      execution = execution.pipe(interceptor);
    }

    return execution;
  }
}
