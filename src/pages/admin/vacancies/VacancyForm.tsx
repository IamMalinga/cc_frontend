import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import RichTextEditor from '../../../components/admin/RichTextEditor';
import AttachmentListEditor, { type AttachmentItem } from '../../../components/admin/AttachmentListEditor';
import ApiErrorAlert from '../../../components/admin/ApiErrorAlert';
import PdfViewer from '../../../components/public/PdfViewer';
import { useUploadFileMutation } from '../../../api/adminApi';
import {
  useGetVacancyByIdQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
} from '../../../api/adminApi';
import type { VacancyDto } from '../../../api/types';
import type { WithoutId } from '../../../api/createAdminCrudApi';

type FormState = WithoutId<VacancyDto>;

const emptyForm: FormState = {
  title: '',
  description: '',
  closingDate: '',
  fileUrl: '',
  active: true,
  attachments: [],
};

export default function VacancyForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing } = useGetVacancyByIdQuery(id ?? '', { skip: !isEdit });
  const [createVacancy, createState] = useCreateVacancyMutation();
  const [updateVacancy, updateState] = useUpdateVacancyMutation();
  const [uploadFile, { isLoading: isUploadingMainFile }] = useUploadFileMutation();

  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const error = createState.error ?? updateState.error;
  const isSaving = createState.isLoading || updateState.isLoading;

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleMainFileChange(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await uploadFile(formData).unwrap();
      handleChange('fileUrl', result.url);
    } catch {
      // field stays empty, admin can retry
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateVacancy({ id: Number(id), ...form }).unwrap();
      } else {
        await createVacancy(form).unwrap();
      }
      navigate('/admin/vacancies');
    } catch {
      // error surfaced via ApiErrorAlert
    }
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <h3 className="mb-4" style={{ color: '#0d2d62' }}>{isEdit ? 'Edit' : 'New'} Vacancy</h3>
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

        <RichTextEditor
          label="Description"
          value={form.description ?? ''}
          onChange={(html) => handleChange('description', html)}
          placeholder="Vacancy details, responsibilities, qualifications..."
        />

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Closing Date</Form.Label>
              <Form.Control
                type="date"
                value={form.closingDate ?? ''}
                onChange={(e) => handleChange('closingDate', e.target.value)}
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

        <Form.Group className="mb-3">
          <Form.Label>Main Advertisement (PDF)</Form.Label>
          <Form.Control
            type="file"
            accept="application/pdf"
            disabled={isUploadingMainFile}
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleMainFileChange(file);
            }}
          />
          <Form.Text muted>Shown to applicants in an embedded PDF viewer.</Form.Text>
          {form.fileUrl && (
            <div className="mt-2">
              <PdfViewer url={form.fileUrl} title="Vacancy advertisement" height={360} />
            </div>
          )}
        </Form.Group>

        <AttachmentListEditor
          label="Supplementary Files (application forms, annexures, ...)"
          items={form.attachments as AttachmentItem[]}
          onChange={(items) => handleChange('attachments', items as VacancyDto['attachments'])}
        />

        <div className="d-flex gap-2">
          <Button type="submit" disabled={isSaving} style={{ backgroundColor: '#0d2d62', border: 'none' }}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/admin/vacancies')} type="button">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
