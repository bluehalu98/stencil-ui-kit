import { Component, Element, Prop, State, Event, Watch, h, EventEmitter } from '@stencil/core';

export type SdTableSortDir = 'asc' | 'desc' | 'none';

export interface SdTableColumn {
 name: string;
 label: string;
 field: string | ((row: any) => any);
 align?: 'left' | 'center' | 'right';
 width?: string;
 format?: (value: any, row: any) => string;
 visible?: boolean;
 usePageMoveIcon?: boolean;
 tooltip?: string[];
}

export interface Row {
 [key: string]: any;
}

@Component({
 tag: 'sd-table',
 styleUrl: 'sd-table.scss',
})
export class SdTable {
 @Element() el!: HTMLElement;

 @Prop() columns: SdTableColumn[] = [];
 @Prop({ mutable: true }) rows: Row[] = [];
 @Prop({ mutable: true }) selected: Set<Row> = new Set();
 @Prop() rowKey: string = 'id';
 @Prop() selectable: boolean = false;
 @Prop() resizable: boolean = false;
 @Prop() stickyHeader: boolean = false;
 @Prop() noDataLabel: string = '데이터가 없습니다.';
 @Prop() pagination?: {
  page: number;
  rowsPerPage: number;
  lastPage?: number;
 };
 @Prop() bodyCellRenderer?: (
  column: SdTableColumn,
  row: Row,
 ) => HTMLElement | string | null | undefined;

 @Event() sdSelectChange!: EventEmitter<Row[]>;
 @Event() sdPageChange!: EventEmitter<number>;

 @State() currentPage: number = this.pagination?.page || 1;
 @State() innerRows: { [key: string]: any }[] = this.rows;
 @State() innerSelected: Set<{ [key: string]: any }> = new Set(this.selected);
 @State() columnWidths: number[] = [];

 @Watch('columns')
 watchColumns(newCols: SdTableColumn[]) {
  this.columnWidths = newCols.map(c => parseInt(c.width || '120', 10));
 }

 @Watch('selected')
 watchSelected(newSelected: Set<Row>) {
  this.innerSelected = new Set(newSelected);
 }

 @Watch('pagination')
 watchPagination(newVal: { page: number; rowsPerPage: number; lastPage?: number } | undefined) {
  if (newVal?.page && newVal.page !== this.currentPage) this.currentPage = newVal.page;
 }

 componentWillLoad() {
  this.innerRows = [...this.rows];
  this.innerSelected = new Set(this.selected);
  this.columnWidths = this.columns.map(c => parseInt(c.width || '120', 10));
 }

 private get paginatedRows(): { [key: string]: any }[] {
  if (!this.pagination) return this.innerRows;

  const { rowsPerPage = this.rows.length } = this.pagination || {};

  const result = this.innerRows.slice(
   (this.currentPage - 1) * rowsPerPage,
   this.currentPage * rowsPerPage,
  );

  return result;
 }

 private get lastPageNumber(): number {
  const { lastPage, rowsPerPage = this.rows.length } = this.pagination || {};

  return lastPage ?? Math.max(1, Math.ceil(this.rows.length / rowsPerPage));
 }

 private get sdTableClasses() {
  return [
   'sd-table',
   this.stickyHeader && 'sd-table--sticky-header',
   this.selectable && 'sd-table--selectable',
   this.resizable && 'sd-table--resizable',
   !this.innerRows.length && 'sd-table--no-data',
  ]
   .filter(Boolean)
   .join(' ');
 }

 private get visibleColumns(): SdTableColumn[] {
  return this.columns.filter(col => col.visible !== false);
 }

 private updateRowSelect(row: Row) {
  const selectedArray = Array.from(this.innerSelected);
  const exists = this.isRowSelected(row);
  const newSelected = exists
   ? selectedArray.filter(r => r[this.rowKey] !== row[this.rowKey])
   : [...selectedArray, row];

  // 동일 상태면 set하지 않음 → 불필요 렌더 방지
  if (newSelected.length === selectedArray.length) return;

  this.innerSelected = new Set(newSelected);
  this.sdSelectChange.emit(Array.from(this.innerSelected));
 }

 private get isAllChecked(): boolean | null {
  const total = this.paginatedRows.length;
  const selectedCount = this.paginatedRows.filter(row =>
   Array.from(this.innerSelected).some(
    selectedRow => selectedRow[this.rowKey] === row[this.rowKey],
   ),
  ).length;

  if (selectedCount === 0) return false; // 아무것도 안 선택됨
  if (selectedCount === total) return true; // 전부 선택됨
  return null; // 일부만 선택됨
 }

 private get selectedKeyMap(): Map<any, boolean> {
  return new Map(Array.from(this.innerSelected).map(r => [r[this.rowKey], true]));
 }

 private isRowSelected(row: Row): boolean {
  return this.selectedKeyMap.has(row[this.rowKey]);
 }

 private toggleSelectAll(checked: boolean | any[]) {
  if (checked) {
   const pageRows = new Set([...this.paginatedRows]);
   this.innerSelected = new Set([...this.innerSelected, ...pageRows]);
  } else {
   const currentPageKeys = this.paginatedRows.map(r => r[this.rowKey]);
   this.innerSelected = new Set(
    [...this.innerSelected].filter(r => !currentPageKeys.includes(r[this.rowKey])),
   );
  }

  this.sdSelectChange.emit(Array.from(this.innerSelected));
 }

 private handleResize(index: number, event: MouseEvent) {
  const startX = event.clientX;
  const startWidth = this.columnWidths[index];

  const handleMouseMove = (moveEvent: MouseEvent) => {
   const newWidth = Math.max(startWidth + moveEvent.clientX - startX, 50);

   this.columnWidths = this.columnWidths.map((width, idx) => (idx === index ? newWidth : width));
  };

  const handleMouseUp = () => {
   document.removeEventListener('mousemove', handleMouseMove);
   document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
 }

 private renderHeader() {
  return (
   <thead>
    <tr>
     {this.selectable && (
      <th
       class="sd-th sd-th--selected"
       style={{
        width: '52px',
        minWidth: '52px',
        maxWidth: '52px',
       }}
      >
       <sd-checkbox
        checked={this.isAllChecked}
        disabled={!this.paginatedRows.length}
        onSdChange={(e: CustomEvent<boolean | any[]>) => this.toggleSelectAll(e.detail)}
       ></sd-checkbox>
      </th>
     )}
     {this.visibleColumns.map((col, colIdx) => (
      <th
       class="sd-th"
       key={col.name}
       style={{
        minWidth: `${this.columnWidths[colIdx] as number}px`,
        maxWidth: `${this.columnWidths[colIdx] as number}px`,
        width: `${this.columnWidths[colIdx] as number}px`,
       }}
      >
       <div class={`sd-th__content sd-th__content--${col.align || 'left'}`}>
        <div class="sd-th__content--label">{col.label}</div>

        {col.usePageMoveIcon && <sd-icon name="pageMove" size="12" color="#006AC1" />}

        {col.tooltip && (
         // TODO: sd-tooltip 추가 예정
         <div></div>
        )}
       </div>

       {this.resizable && (
        <div
         class="sd-th__resizer"
         onMouseDown={(evt: MouseEvent) => this.handleResize(colIdx, evt)}
        ></div>
       )}
      </th>
     ))}
    </tr>
   </thead>
  );
 }

 private getRowData = (column: SdTableColumn, row: Row) => {
  const { field, format, name } = column;

  // 기본 필드 선택
  const value = field ? (typeof field === 'string' ? row[field] : field(row)) : row[name];

  // 포맷 적용
  return format ? format(value, row) : value;
 };

 private renderBody() {
  if (!this.paginatedRows.length)
   return (
    <tbody part="tbody-empty">
     <tr>
      <td colSpan={this.visibleColumns.length + (this.selectable ? 1 : 0)}>{this.noDataLabel}</td>
     </tr>
    </tbody>
   );

  return (
   <tbody>
    {this.paginatedRows.map(row => (
     <tr key={row[this.rowKey]} class="hover:bg-Grey_Lighten-6">
      {this.selectable && (
       <td class="sd-td sd-td--selected">
        <sd-checkbox
         checked={this.isRowSelected(row)}
         disabled={!this.paginatedRows.length}
         onSdChange={() => this.updateRowSelect(row)}
        ></sd-checkbox>
       </td>
      )}
      {this.visibleColumns.map(column => {
       const rendered = this.bodyCellRenderer?.(column, row);

       return (
        <td
         key={column.name}
         part={`td-${column.name}`}
         class={`sd-td sd-td--${column.align || 'left'}`}
        >
         {rendered ? (
          typeof rendered === 'string' ? (
           <span innerHTML={rendered}></span>
          ) : (
           rendered
          )
         ) : (
          this.getRowData(column, row)
         )}
        </td>
       );
      })}
     </tr>
    ))}
   </tbody>
  );
 }

 render() {
  return (
   <>
    <div class={`sd-table__container`}>
     <div class="sd-table__middle">
      <table part="table" class={this.sdTableClasses}>
       {this.renderHeader()}

       {this.renderBody()}
      </table>
     </div>

     <div class="sd-table__bottom"></div>
    </div>
    {this.pagination && this.innerRows.length > 0 && (
     <div class="sd-table__pagination">
      <sd-pagination
       currentPage={this.currentPage}
       lastPage={this.lastPageNumber}
       onPageChange={(e: CustomEvent<number>) => {
        this.currentPage = e.detail;
        this.sdPageChange.emit(this.currentPage);
       }}
      ></sd-pagination>
     </div>
    )}
   </>
  );
 }
}
