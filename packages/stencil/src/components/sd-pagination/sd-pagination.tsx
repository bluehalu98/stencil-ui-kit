import { Component, Prop, Event, EventEmitter, h, Watch, Fragment } from '@stencil/core';

const BUTTON_WIDTH: Record<number, number> = {
 1: 26,
 2: 36,
 3: 42,
 4: 50,
 5: 58,
};

const PER_PAGE = 10;

@Component({
 tag: 'sd-pagination',
 styleUrl: 'sd-pagination.scss',
 shadow: true,
})
export class SdPagination {
 @Prop() currentPage: number = 1;
 @Prop() lastPage: number = 1;
 @Prop() simple: boolean = false;

 @Event() pageChange!: EventEmitter<number>;

 @Watch('currentPage')
 @Watch('lastPage')
 onPropChange() {
  console.log('Pagination props changed', {
   currentPage: this.currentPage,
   lastPage: this.lastPage,
  });
 }

 private get paginationClasses() {
  const classes = ['sd-pagination'];

  if (this.simple) {
   classes.push('sd-pagination--simple');
  }
  return classes.join(' ');
 }

 private get pageNumbers() {
  const start = Math.floor((this.currentPage - 1) / PER_PAGE) * PER_PAGE + 1;
  const end = Math.min(start + PER_PAGE - 1, this.lastPage);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
 }

 private get buttonWidth() {
  const lastPageNum = this.pageNumbers.at(-1) ?? 1;
  const maxPageLength: number = lastPageNum.toString().length;
  return BUTTON_WIDTH[maxPageLength] || BUTTON_WIDTH[1];
 }

 private handlePageChange(page: number) {
  if (page < 1 || page > this.lastPage) return;
  this.pageChange.emit(page);
 }

 private handleGroupChange(direction: 'forward' | 'backward') {
  const delta = direction === 'forward' ? PER_PAGE : -PER_PAGE;
  const newPage = Math.min(Math.max(this.currentPage + delta, 1), this.lastPage);
  this.handlePageChange(newPage);
 }

 private get isFirstGroup() {
  return this.currentPage <= PER_PAGE;
 }

 private get isLastGroup() {
  const startPageGroup = Math.floor((this.currentPage - 1) / PER_PAGE) * PER_PAGE + 1;
  return startPageGroup + PER_PAGE - 1 >= this.lastPage;
 }

 private renderPrevButtons() {
  if (this.simple) {
   if (this.currentPage <= 1) return null;

   return (
    <Fragment>
     <button aria-label="Go to first page" onClick={() => this.handlePageChange(1)}>
      <sd-icon name="arrowLeftEnd" size="12" color="#222222" />
     </button>
     <button
      aria-label="Go to previous page"
      onClick={() => this.handlePageChange(this.currentPage - 1)}
     >
      <sd-icon name="arrowLeft" size="12" color="#222222" />
     </button>
    </Fragment>
   );
  }

  if (!this.isFirstGroup) {
   return (
    <Fragment>
     <button aria-label="Go to first page" onClick={() => this.handlePageChange(1)}>
      <sd-icon name="arrowLeftEnd" size="12" color="#222222" />
     </button>
     <button
      aria-label="Go to previous page group"
      onClick={() => this.handleGroupChange('backward')}
     >
      <sd-icon name="arrowLeft" size="12" color="#222222" />
     </button>
    </Fragment>
   );
  }
 }

 private renderNextButtons() {
  if (this.simple) {
   if (this.currentPage >= this.lastPage) return null;

   return (
    <Fragment>
     <button
      aria-label="Go to next page"
      onClick={() => this.handlePageChange(this.currentPage + 1)}
     >
      <sd-icon name="arrowRight" size="12" color="#222222" />
     </button>
     <button aria-label="Go to last page" onClick={() => this.handlePageChange(this.lastPage)}>
      <sd-icon name="arrowRightEnd" size="12" color="#222222" />
     </button>
    </Fragment>
   );
  }

  if (!this.isLastGroup) {
   return (
    <Fragment>
     <button aria-label="Go to next page group" onClick={() => this.handleGroupChange('forward')}>
      <sd-icon name="arrowRight" size="12" color="#222222" />
     </button>
     <button aria-label="Go to last page" onClick={() => this.handlePageChange(this.lastPage)}>
      <sd-icon name="arrowRightEnd" size="12" color="#222222" />
     </button>
    </Fragment>
   );
  }
 }

 render() {
  return (
   <div class={this.paginationClasses}>
    <div class="prepend-btns">{this.renderPrevButtons()}</div>

    {this.simple ? (
     <div class="pagination-info">
      <span class="current-page">{this.currentPage}</span>
      <span>/</span>
      <span class="last-page">{this.lastPage}</span>
     </div>
    ) : (
     this.pageNumbers.map(n => (
      <button
       type="button"
       aria-current={this.currentPage === n ? 'page' : undefined}
       class={{
        'pagination-btn': true,
        'pagination-btn--selected': this.currentPage === n,
       }}
       disabled={this.currentPage === n}
       style={{
        '--pagination-btn-width': `${this.buttonWidth}px`,
       }}
       onClick={() => this.handlePageChange(n)}
      >
       {n}
      </button>
     ))
    )}

    <div class="append-btns">{this.renderNextButtons()}</div>
   </div>
  );
 }
}
