import { Button, Form, Row, Col, Card, Image } from 'react-bootstrap';
import { FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useUploadFileMutation } from '../../api/adminApi';
import { JSX } from 'react/jsx-runtime';
import { getMediaUrl } from '@/utils/mediaUrl';

export interface GalleryImageItem {
  id?: number;
  imageUrl: string;
  caption?: string | null;
  displayOrder?: number;
}

export interface ImageGalleryEditorProps {
  items: GalleryImageItem[];
  onChange: (items: GalleryImageItem[]) => void;
}

/** Add/caption/reorder/remove photos in an event's gallery. */
export default function ImageGalleryEditor({ items, onChange }: ImageGalleryEditorProps): JSX.Element {
  const [uploadFile, { isLoading }] = useUploadFileMutation();

  function updateItem(index: number, patch: Partial<GalleryImageItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  async function handleAddImages(files: FileList) {
    const uploaded: GalleryImageItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const result = await uploadFile((() => {
          const fd = new FormData();
          fd.append('file', file);
          return fd;
        })()).unwrap();
        uploaded.push({ imageUrl: result.url, caption: '' });
      } catch {
        // skip failed upload, continue with the rest
      }
    }
    onChange([...items, ...uploaded]);
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>Photo Gallery</Form.Label>

      <Row className="g-3 mb-3">
        {items.map((item, index) => (
          <Col md={4} key={index}>
            <Card className="p-2 h-100">
              <Image src={getMediaUrl(item.imageUrl)} rounded style={{ height: 140, objectFit: 'cover' }} />
              <Form.Control
                size="sm"
                className="mt-2"
                placeholder="Caption (optional)"
                value={item.caption ?? ''}
                onChange={(e) => updateItem(index, { caption: e.target.value })}
              />
              <div className="d-flex justify-content-between mt-2">
                <div className="d-flex gap-1">
                  <Button variant="outline-secondary" size="sm" disabled={index === 0} onClick={() => moveItem(index, -1)} type="button">
                    <FaArrowUp />
                  </Button>
                  <Button variant="outline-secondary" size="sm" disabled={index === items.length - 1} onClick={() => moveItem(index, 1)} type="button">
                    <FaArrowDown />
                  </Button>
                </div>
                <Button variant="outline-danger" size="sm" onClick={() => removeItem(index)} type="button">
                  <FaTrash />
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Form.Control
        type="file"
        accept="image/*"
        multiple
        disabled={isLoading}
        onChange={(e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) handleAddImages(files);
        }}
      />
      <Form.Text muted>You can select multiple photos at once.</Form.Text>
    </Form.Group>
  );
}
