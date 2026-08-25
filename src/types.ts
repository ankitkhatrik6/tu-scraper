/**
 * Tribhuvan University (TU) Official Notice Sources
 */
export type NoticeSource =
  | 'iost'
  | 'fohss'
  | 'ioe'
  | 'ac'
  | 'iaas'
  | 'iof'
  | 'foe'
  | 'fol';

export type SourceQuery = NoticeSource | 'all';

/**
 * Standardized Notice Media Attachment (PDF, image scan, document, etc.)
 */
export interface NoticeAttachment {
  type: 'pdf' | 'image' | 'doc' | 'link';
  url: string;
  filename: string;
  title?: string;
  fileType?: string; // e.g. "pdf", "jpeg", "jpg", "png", "doc", "docx"
}

/**
 * Standardized Notice Object
 */
export interface Notice {
  id: string;
  title: string;
  source: NoticeSource;
  date?: string;
  url: string;
  /** Primary direct PDF document link if available */
  pdf?: string;
  /** All direct PDF document links */
  pdfs?: string[];
  /** Primary scanned notice image / photo link (e.g. jpeg, jpg, png) */
  image?: string;
  /** All scanned notice image links attached to the notice */
  images?: string[];
  /** Detailed list of all attachments (PDFs, images, documents) */
  attachments?: NoticeAttachment[];
}

/**
 * Detailed Notice Object with body content and full metadata
 */
export interface NoticeDetail extends Notice {
  content?: string;
  nepaliDate?: string;
  englishDate?: string;
  author?: string;
}

/**
 * Options for scraping requests
 */
export interface ScrapeOptions {
  /** Request timeout in milliseconds (default: 10000ms) */
  timeout?: number;
  /** Whether to bypass the in-memory cache (default: false) */
  bypassCache?: boolean;
  /** Custom user-agent header if needed */
  userAgent?: string;
  /** Raw HTML string for offline parsing / testing */
  htmlFixture?: string;
}

/**
 * Metadata descriptor for each TU source institution
 */
export interface SourceMeta {
  id: NoticeSource;
  code: string;
  name: string;
  nepaliName: string;
  url: string;
  baseUrl: string;
  category: 'Institute' | 'Faculty' | 'Campus';
  location: string;
  verified: boolean;
  notes?: string;
}
