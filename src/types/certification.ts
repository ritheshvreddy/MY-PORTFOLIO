export type CertificationType =

  | "course"

  | "achievement"

  | "leadership"

  | "award";

export interface Certification {

  id: string;

  title: string;

  organization: string;

  type: CertificationType;

  credential_url: string | null;

  featured: boolean;

  published: boolean;

  display_order: number;

  created_at: string;

  updated_at: string;

  points: CertificationPoint[];

}

export interface CertificationPoint {

  id: string;

  certification_id: string;

  point: string;

  display_order: number;

}