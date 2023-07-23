import { interval, map, Observable, of } from "rxjs";
import { Inject, Injectable } from "../container/container-decorator.ts";
import { $DOCUMENT } from "../container/container-tokens.ts";
import { Toast } from "bootstrap";

enum ToastTypes {
  Primary = "text-bg-primary",
  Success = "text-bg-success",
  Danger = "text-bg-danger",
  Warning = "text-bg-warning",
  Info = "text-bg-info",
}

const ToastIcon: Record<ToastTypes, string> = {
  [ToastTypes.Primary]: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="white" d="M342.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 402.7 54.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg>`,
  [ToastTypes.Success]: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="white" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`,
  [ToastTypes.Danger]:
    '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="white" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
  [ToastTypes.Warning]:
    '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="white" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
  [ToastTypes.Info]:
    '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="white" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
};

@Injectable()
export class ToastService {
  constructor(@Inject($DOCUMENT) protected readonly $document: Document) {}

  /**
   * Success Toast message
   * @param message
   */
  public success(message: string): Observable<boolean> {
    return of(null).pipe(
      map(() => {
        const id = this.generateId();
        this.renderToast(
          this.createToastElement(message, id, ToastTypes.Success)
        );
        return true;
      })
    );
  }

  /**
   * Primary Toast message
   * @param message
   */
  public primary(message: string): Observable<boolean> {
    return of(null).pipe(
      map(() => {
        const id = this.generateId();
        this.renderToast(
          this.createToastElement(message, id, ToastTypes.Primary)
        );
        return true;
      })
    );
  }

  /**
   * Danger Toast message
   * @param message
   */
  public danger(message: string): Observable<boolean> {
    return of(null).pipe(
      map(() => {
        const id = this.generateId();
        this.renderToast(
          this.createToastElement(message, id, ToastTypes.Danger)
        );
        return true;
      })
    );
  }

  /**
   * Warning Toast message
   * @param message
   */
  public warning(message: string): Observable<boolean> {
    return of(null).pipe(
      map(() => {
        const id = this.generateId();
        this.renderToast(
          this.createToastElement(message, id, ToastTypes.Warning)
        );
        return true;
      })
    );
  }

  /**
   * Info Toast message
   * @param message
   */
  public info(message: string): Observable<boolean> {
    return of(null).pipe(
      map(() => {
        const id = this.generateId();
        this.renderToast(this.createToastElement(message, id, ToastTypes.Info));
        return true;
      })
    );
  }

  /**
   * Renders the toast element using bootstrap framework
   * @param toastElement
   * @protected
   */
  protected renderToast(toastElement: HTMLDivElement) {
    (
      this.$document.body.querySelector(".toast-container") as HTMLDivElement
    ).append(toastElement);
    const modalInstance = new Toast(toastElement, {
      autohide: false,
    });

    modalInstance.show();
    interval(3000).subscribe(() => {
      modalInstance.hide();
      toastElement.remove();
    });
  }

  /**
   * Generates a unique id
   * @protected
   */
  protected generateId(): string {
    return window.crypto.randomUUID();
  }

  /**
   * Creates the toast element
   * @param message
   * @param id
   * @param background
   * @protected
   */
  protected createToastElement(
    message: string,
    id: string,
    background: ToastTypes
  ): HTMLDivElement {
    const toastContent = `
      <div class="toast ${background} border-0" role="alert" aria-live="assertive" aria-atomic="true" id="${id}">
        <div class="toast-body">
          <div class="row gx-0">
            <div class="col-1 flex-center">
                ${ToastIcon[background]}
            </div>
            <div class="col-10 message">${message}</div>
          </div>
        </div>
      </div>
        `;
    const toastContainerElement = document.createElement("div");
    toastContainerElement.innerHTML = toastContent;
    return toastContainerElement.querySelector(".toast") as HTMLDivElement;
  }
}
