import { z } from "zod";
import { insertUploadSchema, uploads } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  uploads: {
    list: {
      method: "GET" as const,
      path: "/api/uploads",
      responses: {
        200: z.array(z.custom<typeof uploads.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/uploads",
      // input: FormData (handled via multer, so Zod validation of body might be tricky if not careful, 
      // but we can validate metadata if needed. For now, we trust multer + simple body)
      responses: {
        201: z.custom<typeof uploads.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/uploads/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    download: {
      method: "GET" as const,
      path: "/api/uploads/:id/download",
      responses: {
        // Returns file stream
      }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
