
import { z } from 'zod';
import { insertPayloadSchema } from './schema';

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
  payloads: {
    upload: {
      method: 'POST' as const,
      path: '/api/payloads',
      input: insertPayloadSchema,
      responses: {
        201: z.object({ success: z.boolean(), id: z.number() }),
        400: errorSchemas.validation,
      },
    },
    getLatest: {
      method: 'GET' as const,
      path: '/api/payloads/latest',
      responses: {
        200: z.object({ filename: z.string(), jsContent: z.string() }),
        404: errorSchemas.notFound,
      },
    },
    download: {
      path: '/api/download', // Downloads JS file
    },
    downloadPdf: {
      path: '/api/payloads/pdf', // Downloads generated PDF
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
