declare module 'leaflet';
declare module 'react-leaflet';

declare namespace React.JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      ar?: boolean;
      'camera-controls'?: boolean;
      'auto-rotate'?: boolean;
      style?: React.CSSProperties;
    };
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': any;
  }
}
