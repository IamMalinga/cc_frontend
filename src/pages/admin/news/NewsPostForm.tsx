import { useState, useEffect, type FormEvent, JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ImageUploadField from '../../../components/admin/ImageUploadField';
import ApiErrorAlert from '../../../components/admin/ApiErrorAlert';
import {
  useGetNewsPostByIdQuery,
  useCreateNewsPostMutation,
  useUpdateNewsPostMutation,
} from '../../../api/adminApi';
import type { NewsPostDto } from '../../../api/types';
import type { WithoutId } from '../../../api/createAdminCrudApi';

type FormState = WithoutId<NewsPostDto>;

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const emptyForm: FormState = {
  title: '',
  content: '',
  imageUrl: '',
  publishedDate: todayIso(),
  active: true,
  pinned: false,
};

export default function NewsPostForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing } = useGetNewsPostByIdQuery(id ?? '', { skip: !isEdit });
  const [createNewsPost, createState] = useCreateNewsPostMutation();
  const [updateNewsPost, updateState] = useUpdateNewsPostMutation();

  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const error = createState.error ?? updateState.error;
  const isSaving = createState.isLoading || updateState.isLoading;

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateNewsPost({ id: Number(id), ...form }).unwrap();
      } else {
        await createNewsPost(form).unwrap();
      }
      navigate('/admin/news');
    } catch {
      // error surfaced via ApiErrorAlert
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h3 className="mb-4" style={{ color: '#0d2d62' }}>{isEdit ? 'Edit' : 'New'} News Post</h3>
      <ApiErrorAlert error={error} />

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={form.content}
            onChange={(e) => handleChange('content', e.target.value)}
            required
          />
        </Form.Group>

        <ImageUploadField
          label="Thumbnail Image"
          value={form.imageUrl}
          onChange={(url) => handleChange('imageUrl', url)}
        />

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Published Date</Form.Label>
              <Form.Control
                type="date"
                value={form.publishedDate}
                onChange={(e) => handleChange('publishedDate', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Form.Check
              type="switch"
              label="Pinned"
              checked={form.pinned}
              onChange={(e) => handleChange('pinned', e.target.checked)}
              className="mb-3"
            />
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Form.Check
              type="switch"
              label="Active"
              checked={form.active}
              onChange={(e) => handleChange('active', e.target.checked)}
              className="mb-3"
            />
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button type="submit" disabled={isSaving} style={{ backgroundColor: '#0d2d62', border: 'none' }}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/admin/news')} type="button">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
