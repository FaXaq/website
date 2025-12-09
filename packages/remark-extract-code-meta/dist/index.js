// src/index.ts
import { visit } from "unist-util-visit";
var remarkExtractCodeMeta = () => {
  return (tree) => {
    visit(tree, "code", (node) => {
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
    });
  };
};
var index_default = remarkExtractCodeMeta;
export {
  index_default as default,
  remarkExtractCodeMeta
};
