# sd-date-picker

<!-- Auto Generated Below -->


## Properties

| Property     | Attribute  | Description | Type                            | Default     |
| ------------ | ---------- | ----------- | ------------------------------- | ----------- |
| `date`       | `date`     |             | `null \| string`                | `null`      |
| `disabled`   | `disabled` |             | `boolean`                       | `false`     |
| `label`      | `label`    |             | `string \| undefined`           | `undefined` |
| `selectable` | --         |             | `[string, string] \| undefined` | `undefined` |


## Events

| Event      | Description | Type                          |
| ---------- | ----------- | ----------------------------- |
| `sdChange` |             | `CustomEvent<null \| string>` |


## Dependencies

### Depends on

- [sd-input](../sd-input)
- [sd-icon](../sd-icon)
- [sd-portal](../sd-portal)
- [sd-date-box](../sd-date-box)

### Graph
```mermaid
graph TD;
  sd-date-picker --> sd-input
  sd-date-picker --> sd-icon
  sd-date-picker --> sd-portal
  sd-date-picker --> sd-date-box
  sd-input --> sd-icon
  style sd-date-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
