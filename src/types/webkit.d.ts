// WebKit vendor-prefixed CSS properties
interface CSSStyleDeclaration {
  webkitTapHighlightColor?: string;
  webkitTouchCallout?: string;
  webkitUserSelect?: string;
  WebkitTapHighlightColor?: string;
  WebkitTouchCallout?: string;
  WebkitUserSelect?: string;
  MozUserSelect?: string;
  msUserSelect?: string;
}

// React CSS Properties with WebKit extensions
declare module 'react' {
  interface CSSProperties {
    WebkitTapHighlightColor?: string;
    WebkitTouchCallout?: string;
    WebkitUserSelect?: string;
    MozUserSelect?: string;
    msUserSelect?: string;
  }
}
