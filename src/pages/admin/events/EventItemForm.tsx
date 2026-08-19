import { useState, useEffect, type FormEvent, JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';

import RichTextEditor from '../../../components/admin/RichTextEditor';
import ImageUploadField from '../../../components/admin/ImageUploadField';
import ImageGalleryEditor, {
  type GalleryImageItem,
} from '../../../components/admin/ImageGalleryEditor';
import AttachmentListEditor, {
  type AttachmentItem,
} from '../../../components/admin/AttachmentListEditor';
import ApiErrorAlert from '../../../components/admin/ApiErrorAlert';

import {
  useGetEventItemByIdQuery,
  useCreateEventItemMutation,
  useUpdateEventItemMutation,
} from '../../../api/adminApi';

import type { EventItemDto, EventCategory } from '../../../api/types';
import type { WithoutId } from '../../../api/createAdminCrudApi';

type FormState = WithoutId<EventItemDto>;

const categories: EventCategory[] = ['STAFF', 'STUDENT'];

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const emptyForm: FormState = {
  title: '',
  description: '',
  eventDate: todayIso(),
  category: 'STUDENT',
  imageUrl: '',
  active: true,
  images: [],
  attachments: [],
};

export default function EventItemForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing } = useGetEventItemByIdQuery(id ?? '', {
    skip: !isEdit,
  });

  const [createEventItem, createState] =
    useCreateEventItemMutation();

  const [updateEventItem, updateState] =
    useUpdateEventItemMutation();

  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (existing) {
      setForm({
        ...existing,

        // Normalize existing image order
        images: (existing.images ?? []).map((image, index) => ({
          ...image,
          displayOrder: index,
        })),

        // Normalize existing attachment order
        attachments: (existing.attachments ?? []).map(
          (attachment, index) => ({
            ...attachment,
            displayOrder: index,
          }),
        ),
      });
    }
  }, [existing]);

  const error = createState.error ?? updateState.error;

  const isSaving =
    createState.isLoading || updateState.isLoading;

  function handleChange<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /**
   * Normalize collection display orders before sending
   * the request to the backend.
   *
   * This guarantees:
   *
   * images:
   *   0, 1, 2, 3...
   *
   * attachments:
   *   0, 1, 2, 3...
   */
  function normalizeForm(formData: FormState): FormState {
    return {
      ...formData,

      images: (formData.images ?? []).map(
        (image, index) => ({
          ...image,
          displayOrder: index,
        }),
      ),

      attachments: (formData.attachments ?? []).map(
        (attachment, index) => ({
          ...attachment,
          displayOrder: index,
        }),
      ),
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Always make sure displayOrder is present
    // before sending data to Spring Boot.
    const normalizedForm = normalizeForm(form);

    try {
      if (isEdit && id) {
        await updateEventItem({
          id: Number(id),
          ...normalizedForm,
        }).unwrap();
      } else {
        await createEventItem(normalizedForm).unwrap();
      }

      navigate('/admin/events');
    } catch {
      // Error is displayed through ApiErrorAlert
    }
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <h3
        className="mb-4"
        style={{ color: '#0d2d62' }}
      >
        {isEdit ? 'Edit' : 'New'} Event
      </h3>

      <ApiErrorAlert error={error} />

      <Form onSubmit={handleSubmit}>
        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>

          <Form.Control
            value={form.title}
            onChange={(e) =>
              handleChange('title', e.target.value)
            }
            required
          />
        </Form.Group>

        {/* Description */}
        <RichTextEditor
          label="Description"
          value={form.description ?? ''}
          onChange={(html) =>
            handleChange('description', html)
          }
          placeholder="What happened at this event..."
        />

        {/* Date / Category / Active */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>

              <Form.Control
                type="date"
                value={form.eventDate}
                onChange={(e) =>
                  handleChange(
                    'eventDate',
                    e.target.value,
                  )
                }
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>

              <Form.Select
                value={form.category}
                onChange={(e) =>
                  handleChange(
                    'category',
                    e.target.value as EventCategory,
                  )
                }
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col
            md={3}
            className="d-flex align-items-end"
          >
            <Form.Check
              type="switch"
              label="Active"
              checked={form.active}
              onChange={(e) =>
                handleChange(
                  'active',
                  e.target.checked,
                )
              }
              className="mb-3"
            />
          </Col>
        </Row>

        {/* Cover Image */}
        <ImageUploadField
          label="Cover Image"
          value={form.imageUrl}
          onChange={(url) =>
            handleChange('imageUrl', url)
          }
        />

        {/* Image Gallery */}
        <ImageGalleryEditor
          items={
            form.images as GalleryImageItem[]
          }
          onChange={(items) => {
            const normalizedItems = items.map(
              (item, index) => ({
                ...item,
                displayOrder: index,
              }),
            );

            handleChange(
              'images',
              normalizedItems as EventItemDto['images'],
            );
          }}
        />

        {/* Attachments */}
        <AttachmentListEditor
          label="Downloadable Files (programme, flyer, report, ...)"
          items={
            form.attachments as AttachmentItem[]
          }
          onChange={(items) => {
            const normalizedItems = items.map(
              (item, index) => ({
                ...item,
                displayOrder: index,
              }),
            );

            handleChange(
              'attachments',
              normalizedItems as EventItemDto['attachments'],
            );
          }}
        />

        {/* Buttons */}
        <div className="d-flex gap-2">
          <Button
            type="submit"
            disabled={isSaving}
            style={{
              backgroundColor: '#0d2d62',
              border: 'none',
            }}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </Button>

          <Button
            variant="outline-secondary"
            onClick={() =>
              navigate('/admin/events')
            }
            type="button"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}