import { Injectable } from "../container/container-decorator";
import { createVNode, DefineComponent, render, VNode } from "vue";
import * as bootstrap from "bootstrap";
import {
  finalize,
  first,
  from,
  fromEvent,
  map,
  Observable,
  of,
  race,
  switchMap,
} from "rxjs";

const ModalContainer = document.querySelector(
  ".modal-container"
) as HTMLDivElement;

@Injectable()
export class ModalControllerService extends Array<{
  id: string;
  userCompletionHandler: (data?: any) => void;
}> {
  public createModal<T = any>(settings: {
    component: DefineComponent<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >;
    props?: {
      [key: string]: any;
    };
    backdropDismiss?: boolean;
  }): Observable<{
    show: () => Observable<{ onDismiss: () => Observable<T | undefined> }>;
  }> {
    return of(true).pipe(
      switchMap(() => {
        const id = this.generateId();
        let div: HTMLDivElement | null = document.createElement("div");

        div.setAttribute("id", id);
        div.classList.add("modal", "fade");

        ModalContainer.append(div);
        let vNode: VNode | null = createVNode(
          settings.component,
          settings.props
        );
        render(vNode, div);

        const modalInstance = bootstrap.Modal.getOrCreateInstance(`#${id}`, {
          backdrop: settings.backdropDismiss === false ? "static" : true,
          focus: true,
        });

        let resolver: (
          value: (T | undefined) | PromiseLike<T | undefined>
        ) => void;
        const userDismiss = new Promise<T | undefined>(
          (res) => (resolver = res)
        );

        const userCompletionHandler = (data?: T) => {
          resolver(data);
          modalInstance.hide();
        };

        this.push({ id, userCompletionHandler });
        const listener = fromEvent(div, "shown.bs.modal").pipe(first());
        return of({
          show: () => {
            modalInstance.show();
            return listener.pipe(
              map(() => ({
                onDismiss: () =>
                  race(
                    from(userDismiss),
                    fromEvent(div as HTMLDivElement, "hidden.bs.modal").pipe(
                      first(),
                      map(() => undefined)
                    )
                  ).pipe(
                    finalize(() => {
                      render(null, div as HTMLDivElement);
                      div?.remove();
                      vNode = null;
                      div = null;
                    })
                  ),
              }))
            );
          },
        });
      })
    );
  }

  private generateId() {
    return window.crypto.randomUUID();
  }

  /**
   * Dismiss modal
   * @param data
   * @param id
   */
  public dismiss(data?: any, id?: string): void {
    const modalInstance = !id
      ? this.pop()
      : this.find((modalInstance) => modalInstance.id === id);
    if (!modalInstance) {
      throw new Error("No modals in view");
    }

    modalInstance.userCompletionHandler(data);
  }
}
