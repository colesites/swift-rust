import type { Rule } from "eslint";

interface JSXLikeNode {
  type: string;
  name?: { type: string; name?: string };
  attributes?: Array<{
    type: string;
    name?: { type: string; name?: string };
    value?: { type: string; value?: unknown } | null;
  }>;
}

const noServerSideImageRule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw <img> tags in favor of the <Image> component.",
    },
    schema: [],
    messages: {
      useImage: 'Use the <Image> component from "swift-rust/image" instead of a raw <img> tag.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node: unknown) {
        const el = node as JSXLikeNode;
        if (el.name?.type === "JSXIdentifier" && el.name.name === "img") {
          context.report({ node: node as never, messageId: "useImage" });
        }
      },
    };
  },
};

const noAnchorTargetBlankRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: 'Require rel="noopener" on <a target="_blank"> tags.',
    },
    schema: [],
    messages: {
      missingRel: 'Anchor with target="_blank" must include rel="noopener".',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node: unknown) {
        const el = node as JSXLikeNode;
        if (el.name?.name !== "a") return;
        const hasTarget = (el.attributes ?? []).some((a) => a.name?.name === "target");
        const hasRel = (el.attributes ?? []).some((a) => {
          if (a.name?.name !== "rel") return false;
          const v = a.value;
          return (
            v?.type === "Literal" && typeof v.value === "string" && v.value.includes("noopener")
          );
        });
        if (hasTarget && !hasRel) {
          context.report({ node: node as never, messageId: "missingRel" });
        }
      },
    };
  },
};

export const rules: Record<string, Rule.RuleModule> = {
  "no-img-element": noServerSideImageRule,
  "no-anchor-target-blank": noAnchorTargetBlankRule,
};

export const configs = {
  recommended: {
    plugins: ["@swift-rust"],
    rules: {
      "@swift-rust/no-img-element": "error",
      "@swift-rust/no-anchor-target-blank": "warn",
    },
  },
};

export default { rules, configs };
