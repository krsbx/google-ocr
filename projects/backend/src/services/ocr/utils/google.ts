import { config } from 'dotenv';
import { v1 } from '@google-cloud/documentai';
import { google } from '@google-cloud/documentai/build/protos/protos';
import env from '../../../utils/env';

config();

const { DocumentProcessorServiceClient } = v1;

class GoogleOcr {
  private $ocrClient: InstanceType<typeof DocumentProcessorServiceClient>;
  private $name: string;

  constructor() {
    this.$ocrClient = new DocumentProcessorServiceClient();
    this.$name = `projects/${env.GOOGLE_PROJECT_ID}/locations/${env.GOOGLE_PROJECT_LOCATION}/processors/${env.GOOGLE_OCR_PROCESSOR_ID}`;
  }

  private $getRequestConfig(content: string) {
    return {
      name: this.$name,
      rawDocument: {
        content,
        mimeType: 'application/pdf',
      },
    };
  }

  private $constructText(
    content: string,
    anchor: google.cloud.documentai.v1.Document.ITextAnchor
  ) {
    if (!anchor.textSegments || anchor.textSegments.length === 0) {
      return '';
    }

    // First shard in document doesn't have startIndex property
    const startIndex = (anchor.textSegments[0].startIndex || 0) as number;
    const endIndex = anchor.textSegments[0].endIndex as number;

    return content.substring(startIndex, endIndex);
  }

  public async readFile(file: Buffer): Promise<Record<number, string[]>> {
    const encoded = Buffer.from(file).toString('base64');
    const request = this.$getRequestConfig(encoded);

    const [result] = await this.$ocrClient.processDocument(request);
    const { document } = result;

    if (!document) {
      console.log('No document detected!');
      return {};
    }

    const { text: content, pages } = document;

    if (!content || !pages) {
      console.log('No text nor pages found!');
      return {};
    }

    const results: Record<number, string[]> = {};

    pages.forEach((page, index) => {
      const { paragraphs } = page;

      if (!paragraphs) {
        console.log('No paragraph available');
        return;
      }

      const result = paragraphs.map((paragraph) => {
        const { layout } = paragraph;

        if (!layout || !layout.textAnchor) {
          console.log('No layout found.');
          return '';
        }

        return this.$constructText(content, layout.textAnchor);
      });

      results[index] = result;
    });

    return results;
  }
}

const OCR = new GoogleOcr();

export default OCR;
