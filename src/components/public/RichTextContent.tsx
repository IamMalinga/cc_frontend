import DOMPurify from 'dompurify';
import { JSX } from 'react/jsx-runtime';

interface RichTextContentProps {
  html?: string | null;
  className?: string;
  maxLength?: number;
}

function htmlToPlainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export default function RichTextContent({ html, className, maxLength }: RichTextContentProps): JSX.Element | null {
  if (!html) return null;

  if (maxLength) {
    const plain = htmlToPlainText(html);
    const truncated = plain.length > maxLength ? `${plain.slice(0, maxLength).trimEnd()}…` : plain;
    return <p className={className}>{truncated}</p>;
  }

  const cleanHtml = DOMPurify.sanitize(html);
  return <div className={className} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}