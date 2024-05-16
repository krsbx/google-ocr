import { BlazeCreator } from '@busy-hour/blaze';
import readOcr from './actions/ocr.read';
import summarizeOcr from './actions/ocr.summarize';

const ocr = BlazeCreator.service({
  name: 'ocr',
  async onStarted() {
    console.log('OCR Started!');
  },
  actions: {
    read: readOcr,
    summarize: summarizeOcr,
  },
});

export default ocr;
