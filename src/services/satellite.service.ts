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
   * @param page Page number
   * @param pageSize Number of elements per page
   * @returns paginated list of satellites depending on page size.
   **/
  public listPaginated(
    pagination: Required<PaginationQuery> = {
      page: 1,
      pageSize: 10,
    },
    filterOptions: FilterInterface = {} // Corrected parameter name
  ): Observable<SatelliteInterface[]> {
    // Calculate the start index based on the page number and page size
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    return this.http.get<SatelliteInterface[]>("./data/satellites.json").pipe(
      map((result) => {
        const paginatedList = result.response.slice(
          startIndex,
          startIndex + pagination.pageSize
        );

        let filteredList = paginatedList.filter((satellite) => {
          const searchTerm = filterOptions.search
            ? filterOptions.search.trim().toLowerCase()
            : "";
          if (searchTerm) {
            return (
              satellite.name.toLowerCase().includes(searchTerm) ||
              satellite.noradCatId.includes(searchTerm)
            );
          }
          return true;
        });

        // Apply additional filtering based on the selected options in the dropdowns
        if (filterOptions.countryCode) {
          filteredList = filteredList.filter(
            (satellite) => satellite.countryCode === filterOptions.countryCode
          );
        }
        if (filterOptions.orbitCode) {
          filteredList = filteredList.filter(
            (satellite) => satellite.orbitCode === filterOptions.orbitCode
          );
        }
        if (filterOptions.objectType) {
          filteredList = filteredList.filter(
            (satellite) => satellite.objectType === filterOptions.objectType
          );
        }

        return filteredList;
      })
    );
  }
}
