import { useState, useEffect, type FormEvent, JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ImageUploadField from '../../../components/admin/ImageUploadField';
import StaffLinksEditor from '../../../components/admin/StaffLinksEditor';
import ApiErrorAlert from '../../../components/admin/ApiErrorAlert';
import {
  useGetStaffMemberByIdQuery,
  useCreateStaffMemberMutation,
  useUpdateStaffMemberMutation,
} from '../../../api/adminApi';
import type { StaffMemberDto, StaffCategory } from '../../../api/types';
import type { WithoutId } from '../../../api/createAdminCrudApi';

type FormState = WithoutId<StaffMemberDto>;

const categories: StaffCategory[] = ['ACADEMIC', 'TECHNICAL', 'ADMINISTRATIVE', 'SUPPORT'];

const emptyForm: FormState = {
  name: '',
  designation: '',
  email: '',
  phone: '',
  imageUrl: '',
  category: 'ACADEMIC',
  displayOrder: 1,
  active: true,
  links: [],
};

export default function StaffMemberForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing } = useGetStaffMemberByIdQuery(id ?? '', { skip: !isEdit });
  const [createStaffMember, createState] = useCreateStaffMemberMutation();
  const [updateStaffMember, updateState] = useUpdateStaffMemberMutation();

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
        await updateStaffMember({ id: Number(id), ...form }).unwrap();
      } else {
        await createStaffMember(form).unwrap();
      }
      navigate('/admin/staff');
    } catch {
      // error surfaced via ApiErrorAlert
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h3 className="mb-4" style={{ color: '#0d2d62' }}>{isEdit ? 'Edit' : 'New'} Staff Member</h3>
      <ApiErrorAlert error={error} />

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                value={form.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email ?? ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={form.phone ?? ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <ImageUploadField
          label="Photo"
          value={form.imageUrl}
          onChange={(url) => handleChange('imageUrl', url)}
        />

        <StaffLinksEditor
          items={form.links}
          onChange={(items) => handleChange('links', items as StaffMemberDto['links'])}
        />

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value as StaffCategory)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
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
          <Button variant="outline-secondary" onClick={() => navigate('/admin/staff')} type="button">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
