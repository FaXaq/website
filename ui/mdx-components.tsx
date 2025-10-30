import type { MDXComponents } from 'mdx/types';

import {
  MDXBlockquote,
  MDXCode,
  MDXHeading1,
  MDXHeading2,
  MDXHeading3,
  MDXHeading4,
  MDXHeading5,
  MDXHeading6,
  MDXLink,
  MDXList,
  MDXListItem,
  MDXTable,
  MDXTableBody,
  MDXTableCell,
  MDXTableColumnHeader,
  MDXTableHeader,
  MDXTableRow,
  MDXText,
} from './app/[locale]/blog/components/MDXComponents';

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.import type { MDXComponents } from 'mdx/types';
    ...components,
    h1: MDXHeading1,
    h2: MDXHeading2,
    h3: MDXHeading3,
    h4: MDXHeading4,
    h5: MDXHeading5,
    h6: MDXHeading6,
    p: MDXText,
    code: MDXCode,
    ul: MDXList,
    li: MDXListItem,
    blockquote: MDXBlockquote,
    table: MDXTable,
    thead: MDXTableHeader,
    tbody: MDXTableBody,
    tr: MDXTableRow,
    th: MDXTableColumnHeader,
    td: MDXTableCell,
    a: MDXLink,
  };
}
