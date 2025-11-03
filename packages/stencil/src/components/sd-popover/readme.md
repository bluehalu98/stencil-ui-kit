# sd-tooltip



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type                                                                                                                                                                      | Default         |
| --------------- | ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `buttonSize`    | `button-size`    |             | `"lg" \| "md" \| "sm" \| "xs"`                                                                                                                                            | `'sm'`          |
| `buttonVariant` | `button-variant` |             | `"ghost" \| "outline" \| "primary"`                                                                                                                                       | `'primary'`     |
| `buttons`       | --               |             | `{ [key: string]: any; }[]`                                                                                                                                               | `[]`            |
| `color`         | `color`          |             | `string`                                                                                                                                                                  | `'#01BB4B'`     |
| `icon`          | `icon`           |             | `"arrowDown" \| "arrowLeft" \| "arrowLeftEnd" \| "arrowRight" \| "arrowRightEnd" \| "arrowUp" \| "check" \| "close" \| "date" \| "helpOutline" \| "pageMove" \| "search"` | `'helpOutline'` |
| `iconSize`      | `icon-size`      |             | `number`                                                                                                                                                                  | `12`            |
| `label`         | `label`          |             | `string`                                                                                                                                                                  | `''`            |
| `menuClass`     | `menu-class`     |             | `string`                                                                                                                                                                  | `''`            |
| `menuTitle`     | `title`          |             | `string \| undefined`                                                                                                                                                     | `undefined`     |
| `messages`      | --               |             | `string[]`                                                                                                                                                                | `[]`            |
| `noHover`       | `no-hover`       |             | `boolean`                                                                                                                                                                 | `true`          |
| `placement`     | `placement`      |             | `"bottom" \| "left" \| "right" \| "top"`                                                                                                                                  | `'bottom'`      |
| `show`          | `show`           |             | `boolean`                                                                                                                                                                 | `false`         |
| `useClose`      | `use-close`      |             | `boolean`                                                                                                                                                                 | `false`         |


## Dependencies

### Depends on

- [sd-button](../sd-button)
- [sd-icon](../sd-icon)
- [sd-tooltip-portal](../sd-tooltip-portal)

### Graph
```mermaid
graph TD;
  sd-popover --> sd-button
  sd-popover --> sd-icon
  sd-popover --> sd-tooltip-portal
  sd-button --> sd-icon
  style sd-popover fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
