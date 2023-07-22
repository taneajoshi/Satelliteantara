import { Observable, map } from "rxjs";
import { Inject, Injectable } from "../container/container-decorator";
import { SatelliteInterface } from "../interfaces/SatelliteInterface";
import { HttpService } from "./http.service";
import { PaginationQuery } from "../interfaces/paginatedInterface";
import { FilterInterface } from "../interfaces/filterInterface";

@Injectable()
export class SatelliteService {
  constructor(@Inject(HttpService) protected readonly http: HttpService) {}

  /**
   * Returns a paginated list of satellites
   * @param page Page number (starting from 1)
   * @param pageSize Number of elements per page
   * @returns paginated list of satellites depending on page size.
   **/
  public listPaginated(
    pagination: Required<PaginationQuery> = {
      page: 1,
      pageSize: 15,
    },
    filterOption: FilterInterface = {}
  ): Observable<SatelliteInterface[]> {
    // Calculate the start index based on the page number and page size
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    return this.http
      .get<SatelliteInterface[]>("/src/assets/data/satellites.json")
      .pipe(
        map((result) => {
          console.log(filterOption);
          return result.response.slice(
            startIndex,
            startIndex + pagination.pageSize
          );
        })
      );
  }
}
