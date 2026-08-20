import type { ChangeEvent, JSX } from 'react';
import { Form, Spinner, Image, Alert } from 'react-bootstrap';
import { useUploadFileMutation } from '../../api/adminApi';
import { getMediaUrl } from '../../utils/mediaUrl';

export interface ImageUploadFieldProps {
  label?: string;
  value?: string | null;
  onChange: (url: string) => void;
}

/**
 * A file input that immediately uploads to POST /api/admin/uploads and
 * writes the returned public URL into `value` via onChange. Used for hero
 * banners, news thumbnails, and staff photos.
 */
export default function ImageUploadField({
  label = 'Image',
  value,
  onChange,
}: ImageUploadFieldProps): JSX.Element {
  const [uploadFile, { isLoading, error }] = useUploadFileMutation();

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await uploadFile(formData).unwrap();
      onChange(result.url);
    } catch {
      // error state surfaced below via the `error` variable
    }
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
      {isLoading && <Spinner size="sm" animation="border" className="mt-2" style={{ color: '#0d2d62' }} />}
      {error !== undefined && (
        <Alert variant="danger" className="mt-2 py-1 px-2 small">Upload failed. Try a smaller image.</Alert>
      )}
      {value && (
        <div className="mt-2">
          <Image src={getMediaUrl(value)} thumbnail style={{ maxHeight: 120 }} />
        </div>
      )}
    </Form.Group>
  );
}
