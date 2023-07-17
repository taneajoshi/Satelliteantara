import { Container } from "inversify";
import { AfterInterceptorInj, $DOCUMENT } from "./container-tokens.ts";

import { AjaxResponse } from "rxjs/ajax";
import { ToastService } from "../services/toast.service.ts";
import { ModalControllerService } from "../services/modal-controller.service.ts";

export const applicationContainer = new Container({
  autoBindInjectable: true,
});

applicationContainer.bind(ToastService).to(ToastService).inSingletonScope();

applicationContainer.bind($DOCUMENT).toConstantValue(document);
applicationContainer
  .bind(ModalControllerService)
  .toConstantValue(
    new ModalControllerService(applicationContainer.get($DOCUMENT))
  );

applicationContainer
  .bind(AfterInterceptorInj)
  .toFunction((config: AjaxResponse<any>) => config);
