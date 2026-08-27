import { supabase } from "../lib/supabase";

import type {
  Certification,
  CertificationPoint,
  CertificationType,
} from "../types/certification";


/* =========================================================
   INPUT TYPES
========================================================= */

export interface CertificationInput {
  title: string;
  organization: string;
  type: CertificationType;
  credential_url: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
}

export interface CertificationPointInput {
  point: string;
  display_order: number;
}


/* =========================================================
   PUBLIC - GET PUBLISHED CERTIFICATIONS
========================================================= */

export async function getCertifications(): Promise<
  Certification[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("certifications")
    .select(`
      *,
      points:certification_points(*)
    `)
    .eq(
      "published",
      true
    )
    .order(
      "display_order",
      {
        ascending: true,
      }
    );


  if (error) {
    console.error(
      "Error fetching certifications:",
      error
    );

    return [];
  }


  return normalizeCertifications(
    data ?? []
  );
}


/* =========================================================
   ADMIN - GET ALL CERTIFICATIONS
========================================================= */

export async function getAdminCertifications(): Promise<
  Certification[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("certifications")
    .select(`
      *,
      points:certification_points(*)
    `)
    .order(
      "display_order",
      {
        ascending: true,
      }
    );


  if (error) {
    console.error(
      "Error fetching admin certifications:",
      error
    );

    throw error;
  }


  return normalizeCertifications(
    data ?? []
  );
}


/* =========================================================
   NORMALIZE CERTIFICATIONS
========================================================= */

function normalizeCertifications(
  data: unknown[]
): Certification[] {

  return data.map(
    (item) => {

      const certification =
        item as Record<string, unknown>;


      const rawPoints =
        Array.isArray(
          certification.points
        )
          ? certification.points
          : [];


      const points =
        rawPoints
          .map(
            (point) =>
              point as Record<string, unknown>
          )
          .map(
            (point) => ({
              id:
                String(
                  point.id ?? ""
                ),

              certification_id:
                String(
                  point.certification_id ?? ""
                ),

              point:
                String(
                  point.point ?? ""
                ),

              display_order:
                Number(
                  point.display_order ?? 0
                ),
            })
          )
          .sort(
            (a, b) =>
              a.display_order -
              b.display_order
          );


      return {
        id:
          String(
            certification.id ?? ""
          ),

        title:
          String(
            certification.title ?? ""
          ),

        organization:
          String(
            certification.organization ?? ""
          ),

        type:
          certification.type as CertificationType,

        credential_url:
          certification.credential_url
            ? String(
                certification.credential_url
              )
            : null,

        featured:
          Boolean(
            certification.featured
          ),

        published:
          Boolean(
            certification.published
          ),

        display_order:
          Number(
            certification.display_order ?? 0
          ),

        created_at:
          String(
            certification.created_at ?? ""
          ),

        updated_at:
          String(
            certification.updated_at ?? ""
          ),

        points,
      };
    }
  );
}


/* =========================================================
   CREATE CERTIFICATION
========================================================= */

export async function createCertification(
  input: CertificationInput
): Promise<Certification> {

  const {
    data,
    error,
  } = await supabase
    .from(
      "certifications"
    )
    .insert({
      title:
        input.title,

      organization:
        input.organization,

      type:
        input.type,

      credential_url:
        input.credential_url,

      featured:
        input.featured,

      published:
        input.published,

      display_order:
        input.display_order,
    })
    .select("*")
    .single();


  if (error) {
    console.error(
      "Error creating certification:",
      error
    );

    throw error;
  }


  return {
    ...(
      data as Certification
    ),
    points: [],
  };
}


/* =========================================================
   UPDATE CERTIFICATION
========================================================= */

export async function updateCertification(
  id: string,
  input: Partial<CertificationInput>
): Promise<Certification> {

  const {
    data,
    error,
  } = await supabase
    .from(
      "certifications"
    )
    .update(input)
    .eq(
      "id",
      id
    )
    .select("*")
    .single();


  if (error) {
    console.error(
      "Error updating certification:",
      error
    );

    throw error;
  }


  const existing =
    await getCertificationById(
      id
    );


  return {
    ...(data as Certification),
    points:
      existing?.points ?? [],
  };
}


/* =========================================================
   DELETE CERTIFICATION
========================================================= */

export async function deleteCertification(
  id: string
): Promise<void> {

  const {
    error,
  } = await supabase
    .from(
      "certifications"
    )
    .delete()
    .eq(
      "id",
      id
    );


  if (error) {
    console.error(
      "Error deleting certification:",
      error
    );

    throw error;
  }
}


/* =========================================================
   GET CERTIFICATION BY ID
========================================================= */

export async function getCertificationById(
  id: string
): Promise<Certification | null> {

  const {
    data,
    error,
  } = await supabase
    .from(
      "certifications"
    )
    .select(`
      *,
      points:certification_points(*)
    `)
    .eq(
      "id",
      id
    )
    .maybeSingle();


  if (error) {
    console.error(
      "Error fetching certification:",
      error
    );

    throw error;
  }


  if (!data) {
    return null;
  }


  return normalizeCertifications(
    [data]
  )[0];
}


/* =========================================================
   ADD CERTIFICATION POINT
========================================================= */

export async function createCertificationPoint(
  certificationId: string,
  input: CertificationPointInput
): Promise<CertificationPoint> {

  const {
    data,
    error,
  } = await supabase
    .from(
      "certification_points"
    )
    .insert({
      certification_id:
        certificationId,

      point:
        input.point,

      display_order:
        input.display_order,
    })
    .select("*")
    .single();


  if (error) {
    console.error(
      "Error creating certification point:",
      error
    );

    throw error;
  }


  return data as CertificationPoint;
}


/* =========================================================
   UPDATE CERTIFICATION POINT
========================================================= */

export async function updateCertificationPoint(
  id: string,
  input: Partial<CertificationPointInput>
): Promise<CertificationPoint> {

  const {
    data,
    error,
  } = await supabase
    .from(
      "certification_points"
    )
    .update(input)
    .eq(
      "id",
      id
    )
    .select("*")
    .single();


  if (error) {
    console.error(
      "Error updating certification point:",
      error
    );

    throw error;
  }


  return data as CertificationPoint;
}


/* =========================================================
   DELETE CERTIFICATION POINT
========================================================= */

export async function deleteCertificationPoint(
  id: string
): Promise<void> {

  const {
    error,
  } = await supabase
    .from(
      "certification_points"
    )
    .delete()
    .eq(
      "id",
      id
    );


  if (error) {
    console.error(
      "Error deleting certification point:",
      error
    );

    throw error;
  }
}


/* =========================================================
   REPLACE ALL CERTIFICATION POINTS
========================================================= */

export async function replaceCertificationPoints(
  certificationId: string,
  points: string[]
): Promise<CertificationPoint[]> {

  const {
    error:
      deleteError,
  } = await supabase
    .from(
      "certification_points"
    )
    .delete()
    .eq(
      "certification_id",
      certificationId
    );


  if (deleteError) {
    console.error(
      "Error clearing certification points:",
      deleteError
    );

    throw deleteError;
  }


  const cleanedPoints =
    points
      .map(
        (point) =>
          point.trim()
      )
      .filter(
        (point) =>
          point.length > 0
      );


  if (
    cleanedPoints.length === 0
  ) {
    return [];
  }


  const rows =
    cleanedPoints.map(
      (
        point,
        index
      ) => ({
        certification_id:
          certificationId,

        point,

        display_order:
          index,
      })
    );


  const {
    data,
    error,
  } = await supabase
    .from(
      "certification_points"
    )
    .insert(rows)
    .select("*");


  if (error) {
    console.error(
      "Error creating certification points:",
      error
    );

    throw error;
  }


  return (
    (data ?? []) as CertificationPoint[]
  ).sort(
    (a, b) =>
      a.display_order -
      b.display_order
  );
}