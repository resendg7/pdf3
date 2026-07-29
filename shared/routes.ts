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

const loginSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: loginSchema,
      responses: {
        200: z.object({ success: z.boolean(), user: z.object({ id: z.string(), email: z.string(), access_token: z.string() }) }),
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.object({ user: z.object({ id: z.string(), email: z.string() }) }),
        401: z.object({ message: z.string() }),
      },
    },
  },
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
        200: z.object({ filename: z.string(), fileContent: z.string() }),
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
