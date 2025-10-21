# sd-select



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute     | Description | Type                         | Default   |
| ---------------- | ------------- | ----------- | ---------------------------- | --------- |
| `clearable`      | `clearable`   |             | `boolean`                    | `false`   |
| `containerStyle` | --            |             | `{ [key: string]: string; }` | `{}`      |
| `disabled`       | `disabled`    |             | `boolean`                    | `false`   |
| `dropdownStyle`  | --            |             | `{ [key: string]: string; }` | `{}`      |
| `label`          | `label`       |             | `string`                     | `''`      |
| `labelStyle`     | --            |             | `{ [key: string]: string; }` | `{}`      |
| `optionStyle`    | --            |             | `{ [key: string]: string; }` | `{}`      |
| `options`        | --            |             | `SelectOption[]`             | `[]`      |
| `placeholder`    | `placeholder` |             | `string`                     | `'선택'`    |
| `searchable`     | `searchable`  |             | `boolean`                    | `false`   |
| `triggerStyle`   | --            |             | `{ [key: string]: string; }` | `{}`      |
| `value`          | `value`       |             | `null \| number \| string`   | `null`    |
| `width`          | `width`       |             | `string`                     | `'200px'` |


## Events

| Event          | Description | Type                                                                              |
| -------------- | ----------- | --------------------------------------------------------------------------------- |
| `dropDownShow` |             | `CustomEvent<{ isOpen: boolean; }>`                                               |
| `valueChanged` |             | `CustomEvent<{ value: string \| number \| null; option: SelectOption \| null; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
