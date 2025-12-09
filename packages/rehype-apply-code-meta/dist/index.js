// src/index.ts
import { visit } from "unist-util-visit";
var rehypeExtractCodeMeta = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "pre" && node.children && node.children.length > 0) {
        const firstChild = node.children[0];
        if (firstChild?.type === "element" && firstChild?.tagName === "code") {
          const codeElement = firstChild;
          const meta = codeElement.properties?.["data-meta"] || "";
          const language = codeElement.properties?.["data-language"] || "";
          node.properties = node.properties || {};
          if (language) {
            node.properties["data-language"] = language;
          }
          if (meta) {
            node.properties["data-meta"] = meta;
          }
        }
      }
    });
  };
};
var index_default = rehypeExtractCodeMeta;
export {
  index_default as default,
  rehypeExtractCodeMeta
};
