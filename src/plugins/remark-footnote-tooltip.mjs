import { visit } from 'unist-util-visit';

/**
 * Remark plugin: transforms ^(footnote text) into inline hover tooltips.
 * Syntax: ^(This is a footnote) → numbered superscript with CSS hover tooltip.
 */
export default function remarkFootnoteTooltip() {
  return (tree) => {
    let counter = 0;

    visit(tree, 'paragraph', (node) => {
      const newChildren = [];

      for (const child of node.children) {
        if (child.type !== 'text') {
          newChildren.push(child);
          continue;
        }

        const text = child.value;
        const regex = /\\\^\(([^)]+)\)|\^\(([^)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
          // Push any text before this match
          if (match.index > lastIndex) {
            newChildren.push({ type: 'text', value: text.slice(lastIndex, match.index) });
          }

          // Escaped syntax \^(...) — render as literal ^(...)
          if (match[0].startsWith('\\')) {
            newChildren.push({ type: 'text', value: `^(${match[1]})` });
          } else {
            // Real footnote
            counter++;
            const id = `fn-${counter}`;
            const content = match[2];
            newChildren.push({
              type: 'html',
              value: `<span class="fn-marker" tabindex="0" aria-describedby="${id}" data-fn="${counter}">${counter}<span id="${id}" role="tooltip" class="fn-tooltip" aria-hidden="true">${escapeHtml(content)}</span></span>`,
            });
          }

          lastIndex = match.index + match[0].length;
        }

        // Push remaining text
        if (lastIndex < text.length) {
          newChildren.push({ type: 'text', value: text.slice(lastIndex) });
        }
      }

      node.children = newChildren;
    });
  };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
