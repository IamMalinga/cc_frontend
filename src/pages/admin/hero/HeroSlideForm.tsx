import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ImageUploadField from '../../../components/admin/ImageUploadField';
import ApiErrorAlert from '../../../components/admin/ApiErrorAlert';
import {
  useGetHeroSlideByIdQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
} from '../../../api/adminApi';
import type { HeroSlideDto } from '../../../api/types';
import type { WithoutId } from '../../../api/createAdminCrudApi';

type FormState = WithoutId<HeroSlideDto>;

const emptyForm: FormState = {
  title: '',
  subtitle: '',
  imageUrl: '',
  ctaText: '',
  ctaUrl: '',
  displayOrder: 1,
  active: true,
};

export default function HeroSlideForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing } = useGetHeroSlideByIdQuery(id ?? '', { skip: !isEdit });
  const [createHeroSlide, createState] = useCreateHeroSlideMutation();
  const [updateHeroSlide, updateState] = useUpdateHeroSlideMutation();

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
        await updateHeroSlide({ id: Number(id), ...form }).unwrap();
      } else {
        await createHeroSlide(form).unwrap();
      }
      navigate('/admin/hero');
    } catch {
      // error surfaced via ApiErrorAlert
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h3 className="mb-4" style={{ color: '#0d2d62' }}>{isEdit ? 'Edit' : 'New'} Hero Slide</h3>
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
          <Form.Label>Subtitle</Form.Label>
          <Form.Control
            value={form.subtitle ?? ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </Form.Group>

        <ImageUploadField
          label="Hero Image"
          value={form.imageUrl}
          onChange={(url) => handleChange('imageUrl', url)}
        />

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>CTA Button Text</Form.Label>
              <Form.Control
                value={form.ctaText ?? ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                placeholder="e.g. Explore our labs"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>CTA Link</Form.Label>
              <Form.Control
                value={form.ctaUrl ?? ''}
                onChange={(e) => handleChange('ctaUrl', e.target.value)}
                placeholder="/labs"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                value={form.displayOrder}
                onChange={(e) => handleChange('displayOrder', Number(e.target.value))}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end">
            <Form.Check
              type="switch"
              label="Active (visible on the site)"
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
          <Button variant="outline-secondary" onClick={() => navigate('/admin/hero')} type="button">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
