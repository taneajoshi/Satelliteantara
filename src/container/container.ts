import { Container } from "inversify";
import {
  AfterInterceptorInj,
  BeforeInterceptorInj,
  StorageType,
  $DOCUMENT,
} from "./container-tokens.ts";
import { ApplicationJsonInterceptor } from "../interceptors/application-json.interceptor.ts";
import { AjaxResponse } from "rxjs/ajax";
import { ToastService } from "../services/toast.service.ts";
import { ModalControllerService } from "../services/modal-controller.service.ts";

export const applicationContainer = new Container({
  autoBindInjectable: true,
});

applicationContainer.bind(ToastService).to(ToastService).inSingletonScope();
applicationContainer.bind(StorageType).toConstantValue(window.localStorage);

applicationContainer.bind($DOCUMENT).toConstantValue(document);
applicationContainer
  .bind(ModalControllerService)
  .toConstantValue(
    new ModalControllerService(applicationContainer.get($DOCUMENT))
  );

applicationContainer
  .bind(BeforeInterceptorInj)
  .toFunction(ApplicationJsonInterceptor);

applicationContainer
  .bind(AfterInterceptorInj)
  .toFunction((config: AjaxResponse<any>) => config);
