import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { JSX } from 'react/jsx-runtime';

export interface StaffLinkItem {
  id?: number;
  label: string;
  url: string;
  displayOrder?: number;
}

export interface StaffLinksEditorProps {
  items: StaffLinkItem[];
  onChange: (items: StaffLinkItem[]) => void;
}

const MAX_LINKS = 3;

const SUGGESTED_LABELS = ['LinkedIn', 'Google Scholar', 'ORCID', 'Personal Website', 'ResearchGate'];

/** Add/remove up to 3 professional links (LinkedIn, Scholar, personal site, ...) for a staff member's card. */
export default function StaffLinksEditor({ items, onChange }: StaffLinksEditorProps): JSX.Element {
  function updateItem(index: number, patch: Partial<StaffLinkItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    if (items.length >= MAX_LINKS) return;
    onChange([...items, { label: '', url: '' }]);
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>Professional Links ({items.length}/{MAX_LINKS})</Form.Label>
      {items.map((item, index) => (
        <Row key={index} className="g-2 align-items-center mb-2">
          <Col md={4}>
            <Form.Control
              list="staff-link-labels"
              placeholder="Label (e.g. LinkedIn)"
              value={item.label}
              onChange={(e) => updateItem(index, { label: e.target.value })}
            />
          </Col>
          <Col md={7}>
            <Form.Control
              placeholder="https://..."
              value={item.url}
              onChange={(e) => updateItem(index, { url: e.target.value })}
            />
          </Col>
          <Col md={1} className="text-end">
            <Button variant="outline-danger" size="sm" onClick={() => removeItem(index)} type="button">
              <FaTrash />
            </Button>
          </Col>
        </Row>
      ))}
      <datalist id="staff-link-labels">
        {SUGGESTED_LABELS.map((l) => <option value={l} key={l} />)}
      </datalist>

      {items.length < MAX_LINKS ? (
        <Button variant="outline-secondary" size="sm" onClick={addItem} type="button">
          + Add link
        </Button>
      ) : (
        <Alert variant="light" className="border py-1 px-2 small mb-0">Maximum of {MAX_LINKS} links reached.</Alert>
      )}
    </Form.Group>
  );
}
