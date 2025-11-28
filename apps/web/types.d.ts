interface Window {
  webkitAudioContext: typeof AudioContext;
  AudioContext: typeof AudioContext;
}

declare module '@mdx-js/react' {
  import * as React from 'react';
  type ComponentType =
    | 'a'
    | 'blockquote'
    | 'code'
    | 'delete'
    | 'em'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'hr'
    | 'img'
    | 'inlineCode'
    | 'li'
    | 'ol'
    | 'p'
    | 'pre'
    | 'strong'
    | 'sup'
    | 'table'
    | 'td'
    | 'thematicBreak'
    | 'tr'
    | 'ul'
    | 'thead'
    | 'tbody'
    | 'tr'
    | 'th'
    | 'td'
    | 'pre'
    | 'code'
    | 'img'
  export type Components = Omit<{
    [key in ComponentType]?: React.ComponentType<{ children: React.ReactNode }>
  }, "pre"> & {
    "pre"?: React.ComponentType<{ children: React.Component<{ children: string, "data-meta"?: string, "data-language": string }> }>
  }

  export interface MDXProviderProps {
    children: React.ReactNode
    components: Components
  }
  export class MDXProvider extends React.Component<MDXProviderProps> { }
}

declare module '*.mdx' {
  import type * as React from 'react';

  import type { MDXComponentsType } from './src/components/blog/MDXComponents';

  interface MDXComponentProps {
    components?: MDXComponentsType;
    [key: string]: unknown;
  }

  let MDXComponent: (props: MDXComponentProps) => React.JSX.Element;
  export const meta: {
    title: string;
    description: string;
    date: string;
    tags: string[];
    slug: string;
    published?: boolean;
  };
  export default MDXComponent;
}

// Vite import.meta.glob type definitions
interface ImportMeta {
  glob<Module = { [key: string]: unknown }>(
    pattern: string,
    options?: {
      eager?: boolean;
      import?: string;
      query?: string | Record<string, string | string[]>;
      as?: string;
    }
  ): Record<string, () => Promise<Module>>;
}
