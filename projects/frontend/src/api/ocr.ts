import { OcrSummary } from '../types/ocr';
import env from '../utils/env';
import { ocrResultExample } from '../utils/example';
import axios from './axios';

export async function readOcr(files: File[]) {
  if (env.VITE_USE_EXAMPLE) {
    return ocrResultExample;
  }

  const formData = new FormData();
  formData.append('file', files[0]);

  const { data } = await axios.post<Record<string, string[]>>('/ocr', formData);

  return data;
}

export async function summarizeOcr(ocr: Record<string, string[]>) {
  const { data } = await axios.post<OcrSummary>('/ocr/summarize', {
    results: ocr,
  });

  return data;
}
