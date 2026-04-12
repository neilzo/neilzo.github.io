import { visit } from 'unist-util-visit';

/**
 * Remark plugin: adds target="_blank" rel="noopener noreferrer" to all
 * external links (http/https) in MDX body content.
 */
export default function remarkExternalLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (!node.url.startsWith('http://') && !node.url.startsWith('https://')) return;
      if (!node.data) node.data = {};
      if (!node.data.hProperties) node.data.hProperties = {};
      node.data.hProperties.target = '_blank';
      node.data.hProperties.rel = 'noopener noreferrer';
    });
  };
}
