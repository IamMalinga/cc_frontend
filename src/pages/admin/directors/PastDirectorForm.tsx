import { useState, useEffect, type FormEvent, JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ImageUploadField from '../../../components/admin/ImageUploadField';
import ApiErrorAlert from '../../../components/admin/ApiErrorAlert';
import {
  useGetPastDirectorByIdQuery,
  useCreatePastDirectorMutation,
  useUpdatePastDirectorMutation,
} from '../../../api/adminApi';
import type { PastDirectorDto } from '../../../api/types';
import type { WithoutId } from '../../../api/createAdminCrudApi';

type FormState = WithoutId<PastDirectorDto>;

const emptyForm: FormState = {
  name: '',
  photoUrl: '',
  periodFrom: '',
  periodTo: '',
  displayOrder: 1,
  active: true,
};

export default function PastDirectorForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing } = useGetPastDirectorByIdQuery(id ?? '', { skip: !isEdit });
  const [createPastDirector, createState] = useCreatePastDirectorMutation();
  const [updatePastDirector, updateState] = useUpdatePastDirectorMutation();

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
        await updatePastDirector({ id: Number(id), ...form }).unwrap();
      } else {
        await createPastDirector(form).unwrap();
      }
      navigate('/admin/directors');
    } catch {
      // error surfaced via ApiErrorAlert
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h3 className="mb-4" style={{ color: '#0d2d62' }}>{isEdit ? 'Edit' : 'New'} Past Director</h3>
      <ApiErrorAlert error={error} />

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </Form.Group>

        <ImageUploadField
          label="Photo"
          value={form.photoUrl}
          onChange={(url) => handleChange('photoUrl', url)}
        />

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Term Start</Form.Label>
              <Form.Control
                type="date"
                value={form.periodFrom}
                onChange={(e) => handleChange('periodFrom', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Term End</Form.Label>
              <Form.Control
                type="date"
                value={form.periodTo ?? ''}
                onChange={(e) => handleChange('periodTo', e.target.value)}
              />
              <Form.Text muted>Leave blank if still serving.</Form.Text>
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
          <Button variant="outline-secondary" onClick={() => navigate('/admin/directors')} type="button">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
