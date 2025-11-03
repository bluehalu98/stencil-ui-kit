# sd-checkbox



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute  | Description          | Type                      | Default     |
| --------------- | ---------- | -------------------- | ------------------------- | ----------- |
| `checkboxStyle` | --         |                      | `{ [key: string]: any; }` | `{}`        |
| `checked`       | `checked`  | 현재 선택 상태 또는 배열 형태의 값 | `any`                     | `false`     |
| `disabled`      | `disabled` | 비활성화 여부              | `boolean`                 | `false`     |
| `label`         | `label`    | 표시할 라벨 텍스트           | `string`                  | `''`        |
| `val`           | `val`      | 배열 모드에서의 개별 값        | `any`                     | `undefined` |


## Events

| Event      | Description | Type               |
| ---------- | ----------- | ------------------ |
| `sdChange` | 값 변경 이벤트    | `CustomEvent<any>` |


## Dependencies

### Used by

 - [sd-select-option](../sd-select/sd-select-option)
 - [sd-table](../sd-table)

### Depends on

- [sd-icon](../sd-icon)

### Graph
```mermaid
graph TD;
  sd-checkbox --> sd-icon
  sd-select-option --> sd-checkbox
  sd-table --> sd-checkbox
  style sd-checkbox fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
