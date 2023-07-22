import {
  faMagnifyingGlass,
  faPlus,
  faXmark,
  faArrowUp,
  faRocket,
  faUserAstronaut,
  faArrowRightFromBracket,
  faCircleNotch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import { library } from "@fortawesome/fontawesome-svg-core";

/**
 * Initializes various icons to render in the application
 */
export function fontAwesomeLibrary() {
  library.add(
    faMagnifyingGlass,
    faPlus,
    faXmark,
    faArrowUp,
    faRocket,
    faUserAstronaut,
    faArrowRightFromBracket,
    faCircleNotch,
    faSpinner
  );
}
