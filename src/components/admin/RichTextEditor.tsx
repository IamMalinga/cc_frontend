import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Form } from 'react-bootstrap';
import { JSX } from 'react/jsx-runtime';

export interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

/**
 * Used for any content field the admin panel treats as rich text (Vacancy
 * and Event descriptions). Stores/emits HTML - the public site renders it
 * with dangerouslySetInnerHTML (see RichTextContent.tsx), so keep the
 * toolbar restricted to safe, simple formatting.
 */
export default function RichTextEditor({ label, value, onChange, placeholder }: RichTextEditorProps): JSX.Element {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </Form.Group>
  );
}
