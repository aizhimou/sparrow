import type { AxiosResponse } from 'axios';
import { ApiError } from './apiError';

type ApiEnvelope<T> = {
  code?: number;
  message?: string;
  data: T;
};

type ApiDataOptions = {
  defaultErrorMessage?: string;
};

export async function apiData<T>(
  request: Promise<AxiosResponse<T | ApiEnvelope<T>>>,
  options: ApiDataOptions = {},
) {
  try {
    const response = await request;
    const body = response.data;

    if (isEnvelope<T>(body)) {
      if (typeof body.code === 'number' && body.code !== 200) {
        throw new ApiError(body.message || options.defaultErrorMessage || 'Request failed', {
          status: response.status,
          code: body.code,
        });
      }

      return body.data;
    }

    return body;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(options.defaultErrorMessage || 'Request failed');
  }
}

function isEnvelope<T>(value: T | ApiEnvelope<T>): value is ApiEnvelope<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    ('code' in value || 'message' in value)
  );
}
