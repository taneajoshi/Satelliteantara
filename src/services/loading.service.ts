import { map, Observable, of, switchMap } from "rxjs";
import { Inject, Injectable } from "../container/container-decorator.ts";
import { ModalControllerService } from "./modal-controller.service.ts";
import LoadingComponent from "../components/LoadingComponent.vue";

@Injectable()
export class LoadingService {
  constructor(
    @Inject(ModalControllerService) protected modalCtrl: ModalControllerService
  ) {}

  public show(message?: string): Observable<boolean> {
    return this.modalCtrl
      .createModal({
        component: LoadingComponent,
        props: { message },
        backdropDismiss: false,
      })
      .pipe(switchMap((showAction) => showAction.show()))
      .pipe(map(() => true));
  }

  public hide(): Observable<boolean> {
    return of(true).pipe(
      map((result) => {
        this.modalCtrl.dismiss();
        return result;
      })
    );
  }
}
