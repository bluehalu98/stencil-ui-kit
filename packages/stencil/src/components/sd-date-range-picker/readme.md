# sd-date-range-picker



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute   | Description | Type                            | Default     |
| ------------ | ----------- | ----------- | ------------------------------- | ----------- |
| `date`       | --          |             | `[string, string]`              | `['', '']`  |
| `disabled`   | `disabled`  |             | `boolean`                       | `false`     |
| `label`      | `label`     |             | `string \| undefined`           | `undefined` |
| `maxRange`   | `max-range` |             | `number \| undefined`           | `undefined` |
| `selectable` | --          |             | `[string, string] \| undefined` | `undefined` |


## Events

| Event      | Description | Type                            |
| ---------- | ----------- | ------------------------------- |
| `sdChange` |             | `CustomEvent<[string, string]>` |


## Dependencies

### Depends on

- [sd-input](../sd-input)
- [sd-icon](../sd-icon)
- [sd-portal](../sd-portal)
- [sd-date-box](../sd-date-box)

### Graph
```mermaid
graph TD;
  sd-date-range-picker --> sd-input
  sd-date-range-picker --> sd-icon
  sd-date-range-picker --> sd-portal
  sd-date-range-picker --> sd-date-box
  sd-input --> sd-icon
  style sd-date-range-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
