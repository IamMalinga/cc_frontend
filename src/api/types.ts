/**
 * Mirrors lk.ac.pdn.eng.cc.dto.* on the backend, field for field. If a DTO
 * changes shape on the backend, update the matching interface here.
 */

export type StaffCategory = 'ACADEMIC' | 'TECHNICAL' | 'ADMINISTRATIVE' | 'SUPPORT';
export type EventCategory = 'STAFF' | 'STUDENT';

export interface HeroSlideDto {
  id: number;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  displayOrder: number;
  active: boolean;
}

export interface NewsPostDto {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  publishedDate: string; // ISO date (yyyy-MM-dd)
  active: boolean;
  pinned: boolean;
}

export interface StaffLinkDto {
  id: number;
  label: string;
  url: string;
  displayOrder: number;
}

export interface StaffMemberDto {
  id: number;
  name: string;
  designation: string;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  category: StaffCategory;
  displayOrder: number;
  active: boolean;
  /** Professional links - capped at 3 by the backend. */
  links: StaffLinkDto[];
}

export interface LabDto {
  id: number;
  name: string;
  description?: string | null;
  networkedComputers?: number | null;
  laptopCapacity?: number | null;
  imageUrl?: string | null;
  displayOrder: number;
  active: boolean;
}

export interface ServiceItemDto {
  id: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  linkUrl?: string | null;
  displayOrder: number;
  active: boolean;
}

export interface QuickLinkDto {
  id: number;
  title: string;
  url: string;
  displayOrder: number;
  active: boolean;
}

export interface VacancyAttachmentDto {
  id: number;
  label: string;
  fileUrl: string;
  displayOrder: number;
}

export interface VacancyDto {
  id: number;
  title: string;
  /** Rich text (HTML) from the admin panel's editor. */
  description?: string | null;
  closingDate?: string | null;
  /** Main advertisement PDF, shown in the public PDF viewer. */
  fileUrl?: string | null;
  active: boolean;
  /** Supplementary downloadable files (application forms, annexures, ...). */
  attachments: VacancyAttachmentDto[];
}

export interface EventImageDto {
  id: number;
  imageUrl: string;
  caption?: string | null;
  displayOrder: number;
}

export interface EventAttachmentDto {
  id: number;
  label: string;
  fileUrl: string;
  displayOrder: number;
}

export interface EventItemDto {
  id: number;
  title: string;
  /** Rich text (HTML) from the admin panel's editor. */
  description?: string | null;
  eventDate: string;
  category: EventCategory;
  /** Cover image shown in listings. */
  imageUrl?: string | null;
  active: boolean;
  images: EventImageDto[];
  attachments: EventAttachmentDto[];
}

export interface PastDirectorDto {
  id: number;
  name: string;
  photoUrl?: string | null;
  periodFrom: string; // ISO date
  /** Null means still serving. */
  periodTo?: string | null;
  displayOrder: number;
  active: boolean;
}

export interface ContactInfoDto {
  id: number;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  mission?: string | null;
  vision?: string | null;
}

/** Spring Data's Page<T> JSON shape, as returned by paginated endpoints. */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index (0-based)
  size: number;
  first: boolean;
  last: boolean;
}

/** Matches lk.ac.pdn.eng.cc.exception.ApiError. */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}
