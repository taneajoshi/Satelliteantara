import { Observable, map, of } from "rxjs";
import { Inject, Injectable } from "../container/container-decorator";
import { StorageType } from "../container/container-tokens";

export enum StorageKeys {
  Token = "token",
  User = "user",
}

@Injectable()
export class StorageService {
  constructor(@Inject(StorageType) protected storageDriver: Storage) {}

  /**
   * Returns the value from storage driver for the key
   * @param key
   * @returns
   */
  public get<T>(key: StorageKeys): Observable<T | null> {
    return of(this.storageDriver.getItem(key)).pipe(
      map((result) => (result ? JSON.parse(result) : null))
    );
  }

  /**
   * Saves the value at the key
   *
   * @param key
   * @param value
   * @returns
   */
  public set<T>(key: StorageKeys, value: T): Observable<boolean> {
    return of(this.storageDriver.setItem(key, JSON.stringify(value))).pipe(
      map(() => true)
    );
  }

  /**
   * Removes the key stored in the local storage.
   * @param key
   */
  public remove(key: StorageKeys): Observable<boolean> {
    return of(true).pipe(
      map(() => this.storageDriver.removeItem(key)),
      map(() => true)
    );
  }

  /**
   * Removes all keys
   */
  public clearAll(): Observable<boolean> {
    return of(this.storageDriver.clear()).pipe(map(() => true));
  }
}
