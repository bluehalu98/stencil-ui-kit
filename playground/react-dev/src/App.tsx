import { useState } from 'react';
import './App.css';
import {
 SdTable,
 type SdTableColumn,
 SdDatePicker,
 SdDateRangePicker,
 SdTooltip,
 SdPopover,
 SdButton,
 SdInput,
 SdCheckbox,
} from '@stencil-test/react';

interface TableRow {
 id: number;
 name: string;
 age: number;
 location: string;
}

function App() {
 const TABLE_COLUMNS: SdTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'center', width: '80px' },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  {
   name: 'age',
   label: 'Age',
   field: 'age',
   align: 'right',
   format: (value: number) => `${value} years`,
   usePageMoveIcon: true,
  },
  { name: 'location', label: 'Location', field: 'location', align: 'left' },
  {
   name: 'actions',
   label: 'Actions',
   field: '',
   align: 'center',
   width: '150px',
  },
 ];

 const TABLE_ROWS: TableRow[] = [
  { id: 1, name: 'Alice', age: 30, location: 'New York' },
  { id: 2, name: 'Bob', age: 25, location: 'San Francisco' },
  { id: 3, name: 'Charlie', age: 35, location: 'Chicago' },
  { id: 4, name: 'Diana', age: 28, location: 'Los Angeles' },
  { id: 5, name: 'Ethan', age: 32, location: 'Seattle' },
 ];

 const [date, setDate] = useState<string | null>('2025-10-27');
 const [dateRange, setDateRange] = useState<[string, string]>([
  '2025-10-27',
  '2025-10-30',
 ]);

 return (
  <div className="flex flex-col p-6 gap-4">
   <div style={{ margin: '20px 0' }}>
    <SdButton label="Click Me" />
   </div>

   <div style={{ margin: '20px 0' }}>
    <SdInput placeholder="Enter text..." />
   </div>

   <div style={{ margin: '20px 0' }}>
    <SdCheckbox label="Check me" />
   </div>
   <div className="table">
    <SdTable
     columns={TABLE_COLUMNS}
     rows={TABLE_ROWS}
     bodyCellRenderer={(column, row) => {
      if (column.name === 'name') {
       return `<b>${row.name}</b>`;
      }
     }}
     selectable
     resizable
     pagination={{
      page: 2,
      rowsPerPage: 50,
      lastPage: 10,
     }}
     onSdSelectChange={(event) => {
      console.log('Selected rows:', event.detail);
     }}
     onSdPageChange={(event) => {
      console.log('Page changed to:', event.detail);
     }}
    ></SdTable>
   </div>

   <div className="date-picker">
    {date}
    <SdDatePicker date={date} onSdChange={(event) => setDate(event.detail)} />
   </div>

   <div className="date-range-picker">
    {dateRange}
    <SdDateRangePicker
     date={dateRange}
     onSdChange={(event) => setDateRange(event.detail)}
    />
   </div>

   <div className="flex w-full items-center justify-center gap-x-4">
    <SdTooltip placement="right">This is tooltip -- right</SdTooltip>
    <SdTooltip placement="bottom">This is tooltip -- bottom</SdTooltip>
    <SdTooltip placement="top">This is tooltip -- top</SdTooltip>
    <SdTooltip placement="left">This is tooltip -- left</SdTooltip>

    <SdTooltip label="tooltip" icon="" placement="right">
     This is tooltip -- right
    </SdTooltip>
    <SdTooltip
     label="tooltip"
     buttonSize="md"
     placement="bottom"
     trigger="click"
    >
     This is tooltip -- bottom
    </SdTooltip>
    <SdTooltip label="tooltip" buttonVariant="outline" placement="top">
     This is tooltip -- top
    </SdTooltip>
    <SdTooltip
     label="tooltip"
     placement="left"
     useClose
     title="Tooltip Title"
     trigger="click"
    >
     This is tooltip -- left
    </SdTooltip>
   </div>

   <div className="flex w-full items-center justify-center gap-x-4">
    <SdPopover label="popover" icon="" placement="right">
     This is popover -- right
    </SdPopover>
    <SdPopover label="popover" buttonSize="md" placement="bottom">
     This is popover -- bottom
    </SdPopover>
    <SdPopover
     label="popover"
     buttonVariant="outline"
     placement="top"
     messages={['This is popover -- top']}
     buttons={[{ label: 'Confirm' }]}
    ></SdPopover>
    <SdPopover
     label="popover"
     placement="left"
     useClose
     title="Popover Title"
     messages={[
      'Popovers provide contextual help or',
      'additional information.',
      'They are similar to tooltips, but can include',
      'more content and interactivity.',
     ]}
     buttons={[
      { label: 'Cancel', variant: 'ghost', color: '#ffffff' },
      { label: 'Confirm' },
     ]}
    ></SdPopover>
   </div>
  </div>
 );
}

export default App;
