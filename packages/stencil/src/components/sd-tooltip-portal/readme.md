# sd-tooltip-portal



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description | Type                                     | Default    |
| ----------- | ----------- | ----------- | ---------------------------------------- | ---------- |
| `offset`    | --          |             | `[number, number]`                       | `[0, 0]`   |
| `open`      | `open`      |             | `boolean`                                | `false`    |
| `parentRef` | --          |             | `HTMLElement \| null`                    | `null`     |
| `placement` | `placement` |             | `"bottom" \| "left" \| "right" \| "top"` | `'bottom'` |
| `to`        | `to`        |             | `HTMLElement \| string`                  | `'body'`   |
| `zIndex`    | `z-index`   |             | `number`                                 | `9999`     |


## Events

| Event     | Description | Type                |
| --------- | ----------- | ------------------- |
| `sdClose` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [sd-popover](../sd-popover)
 - [sd-tooltip](../sd-tooltip)

### Graph
```mermaid
graph TD;
  sd-popover --> sd-tooltip-portal
  sd-tooltip --> sd-tooltip-portal
  style sd-tooltip-portal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
