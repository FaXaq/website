import { visit } from "unist-util-visit";
import type * as unified from "unified";

export const rehypeExtractCodeMeta: unified.Plugin<[], any> = () => {
  return (tree) => {
    visit(tree, "element", (node: any) => {
      // Check if this is a pre > code structure
      if (
        node.tagName === "pre" &&
        node.children &&
        node.children.length > 0
      ) {
        const firstChild = node.children[0];

        if (
          firstChild?.type === "element" &&
          firstChild?.tagName === "code"
        ) {
          const codeElement = firstChild;

          // Get meta from data-meta if it exists (from remark)
          const meta = codeElement.properties?.["data-meta"] as string || "";
          const language = codeElement.properties?.["data-language"] as string || "";

          // Apply data attributes to the pre element
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

export default rehypeExtractCodeMeta;