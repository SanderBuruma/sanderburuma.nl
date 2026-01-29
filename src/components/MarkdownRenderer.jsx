import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import ImageLightbox from './ImageLightbox';

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function extractText(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children?.props?.children) return extractText(children.props.children);
  return '';
}

function HeadingWithAnchor({ level, children }) {
  const Tag = `h${level}`;
  const id = slugify(extractText(children));
  return (
    <Tag id={id}>
      <a href={`#${id}`} className="heading-anchor" aria-hidden="true">#</a>
      {children}
    </Tag>
  );
}

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : null;
  const codeText = extractText(children).replace(/\n$/, '');

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [codeText]);

  // Inline code (no language class, not inside pre)
  if (!className) {
    return <code className={className}>{children}</code>;
  }

  const lines = codeText.split('\n');

  return (
    <div className="code-block-wrapper">
      {language && <span className="code-language-label">{language}</span>}
      <button
        className="code-copy-btn"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div className="code-block-inner">
        <div className="code-line-numbers" aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <pre>
          <code className={className}>{children}</code>
        </pre>
      </div>
    </div>
  );
}

function MarkdownImage({ src, alt }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <figure className="markdown-figure">
        <div className="markdown-img-placeholder">
          {alt || 'Image failed to load'}
        </div>
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
    );
  }

  return (
    <>
      <figure className="markdown-figure">
        <img
          src={src}
          alt={alt || ''}
          className="markdown-img"
          onClick={() => setLightboxOpen(true)}
          onError={() => setError(true)}
          style={{ cursor: 'pointer' }}
        />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

function MarkdownLink({ href, children }) {
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <a href={href}>{children}</a>;
}

const components = {
  h1: ({ children }) => <HeadingWithAnchor level={1}>{children}</HeadingWithAnchor>,
  h2: ({ children }) => <HeadingWithAnchor level={2}>{children}</HeadingWithAnchor>,
  h3: ({ children }) => <HeadingWithAnchor level={3}>{children}</HeadingWithAnchor>,
  h4: ({ children }) => <HeadingWithAnchor level={4}>{children}</HeadingWithAnchor>,
  h5: ({ children }) => <HeadingWithAnchor level={5}>{children}</HeadingWithAnchor>,
  h6: ({ children }) => <HeadingWithAnchor level={6}>{children}</HeadingWithAnchor>,
  code: ({ children, className }) => (
    <CodeBlock className={className}>{children}</CodeBlock>
  ),
  img: ({ src, alt }) => <MarkdownImage src={src} alt={alt} />,
  a: ({ href, children }) => <MarkdownLink href={href}>{children}</MarkdownLink>,
};

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
