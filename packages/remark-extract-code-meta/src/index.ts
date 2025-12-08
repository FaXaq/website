import { visit } from "unist-util-visit";
import type * as unified from "unified";
import { Root } from "remark-parse/lib";

export const remarkExtractCodeMeta: unified.Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "code", (node: any) => {
      const lang = node.lang ?? "";
      const meta = node.meta ?? "";

      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};

      if (meta) {
        node.data.hProperties["data-meta"] = meta;
      }

      if (lang) {
        node.data.hProperties["data-language"] = lang;
      }

      console.log(meta)
    });
  };
};

export default remarkExtractCodeMeta;