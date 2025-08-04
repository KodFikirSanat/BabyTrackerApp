// declarations.d.ts

/**
 * @file This file provides TypeScript type definitions for static assets,
 * allowing them to be imported as modules in the application.
 *
 * @format
 */

declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
