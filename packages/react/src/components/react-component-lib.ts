import React from 'react';
import { defineCustomElements } from '@sellmate/design-system-core/loader';

type StencilProps<T = {}> = {
  [P in keyof T]?: Omit<T[P], 'ref'> | HTMLAttributes;
};

type ReactProps<T = {}> = {
  [P in keyof T]?: T[P];
};

interface HTMLAttributes {
  className?: string;
  id?: string;
  slot?: string;
}

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
}

interface StencilReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef: React.RefObject<ElementType>;
  ref?: React.Ref<any>;
}

export const createReactComponent = <PropType, ElementType>(
  tagName: string,
  defineCustomElement?: () => void,
) => {
  if (defineCustomElement !== undefined) {
    defineCustomElement();
  }

  const displayName = dashToPascalCase(tagName);

  const ReactComponent = React.forwardRef<ElementType, PropType & React.HTMLAttributes<ElementType>>(
    (userProps, ref) => {
      const elementRef = React.useRef<ElementType>();

      React.useImperativeHandle(ref, () => elementRef.current!);

      const props = React.useMemo(() => {
        const { children, ...restProps } = userProps;

        const forwardedRef = elementRef;
        let propsToPass = Object.keys(restProps).reduce((acc, name) => {
          const value = (restProps as any)[name];

          if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
            const eventName = name.substring(2).toLowerCase();
            acc[`on${eventName}`] = value;
          } else {
            acc[dashToCamelCase(name)] = value;
          }

          return acc;
        }, {} as any);

        return { ...propsToPass, forwardedRef };
      }, [userProps]);

      return React.createElement(
        tagName,
        {
          ...props,
          ref: elementRef,
        },
        userProps.children,
      );
    },
  );

  ReactComponent.displayName = displayName;

  return ReactComponent as any;
};

const dashToPascalCase = (str: string) =>
  str.toLowerCase().split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');

const dashToCamelCase = (str: string) => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

// Auto define custom elements
defineCustomElements();