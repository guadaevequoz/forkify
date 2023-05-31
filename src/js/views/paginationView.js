import View from "./View.js";

// icons
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup = function () {
    const numPages = this._data.results / this._data.resultsPerPage;
    console.log(numPages);

    // page 1, there are other pages
    // page 1, there are no other pages
    // last page
    // other page
  };
}

export default new PaginationView();
