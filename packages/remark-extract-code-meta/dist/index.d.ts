import * as unified from 'unified';
import { Root } from 'remark-parse/lib';

declare const remarkExtractCodeMeta: unified.Plugin<[], Root>;

export { remarkExtractCodeMeta as default, remarkExtractCodeMeta };
