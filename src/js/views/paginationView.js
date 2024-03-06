import View from './View';
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest(".btn--inline");
      if(!btn) return;
      const goto = +btn.dataset.goto;
      console.log(goto);
      handler(goto);
      

    })
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const results = this._data.results.length;
    const pages = Math.ceil(results / this._data.resultsPerPage);
    // page 1 and others
    console.log(pages);
    if (curPage === 1 && pages > 1) {
      return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    //page 1 no others
    if (curPage === 1 && pages <= 1) return '';
    ///last page
    if (curPage === pages && pages > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
          </button>
          
      `;
    }
    // other page
    if (curPage < pages)
      return `
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
          </button>
          <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
  }
}

export default new PaginationView();