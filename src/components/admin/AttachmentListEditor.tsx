import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FaTrash, FaFilePdf } from 'react-icons/fa';
import { useUploadFileMutation } from '../../api/adminApi';
import { JSX } from 'react/jsx-runtime';

export interface AttachmentItem {
  id?: number;
  label: string;
  fileUrl: string;
  displayOrder?: number;
}

export interface AttachmentListEditorProps {
  label: string;
  items: AttachmentItem[];
  onChange: (items: AttachmentItem[]) => void;
  accept?: string;
}

/**
 * Add/remove/label a list of downloadable files. Used for a Vacancy's
 * supplementary files (application forms, annexures) and an Event's
 * optional PDFs (programme, flyer, report).
 */
export default function AttachmentListEditor({
  label,
  items,
  onChange,
  accept = 'application/pdf',
}: AttachmentListEditorProps): JSX.Element {
  const [uploadFile, { isLoading }] = useUploadFileMutation();

  function updateItem(index: number, patch: Partial<AttachmentItem>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, { label: '', fileUrl: '' }]);
  }

  async function handleFileSelect(index: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await uploadFile(formData).unwrap();
      updateItem(index, { fileUrl: result.url });
    } catch {
      // swallow - the field just stays empty and the admin can retry
    }
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      {items.map((item, index) => (
        <Card key={index} className="mb-2 p-3">
          <Row className="g-2 align-items-center">
            <Col md={4}>
              <Form.Control
                placeholder="Label (e.g. Application Form)"
                value={item.label}
                onChange={(e) => updateItem(index, { label: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Control
                type="file"
                accept={accept}
                disabled={isLoading}
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(index, file);
                }}
              />
              {item.fileUrl && (
                <a href={item.fileUrl} target="_blank" rel="noreferrer" className="small d-inline-flex align-items-center gap-1 mt-1">
                  <FaFilePdf /> current file
                </a>
              )}
            </Col>
            <Col md={3} className="text-end">
              <Button variant="outline-danger" size="sm" onClick={() => removeItem(index)} type="button">
                <FaTrash />
              </Button>
            </Col>
          </Row>
        </Card>
      ))}
      <Button variant="outline-secondary" size="sm" onClick={addItem} type="button">
        + Add file
      </Button>
    </Form.Group>
  );
}
