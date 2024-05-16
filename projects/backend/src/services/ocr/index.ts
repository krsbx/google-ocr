import { BlazeCreator } from '@busy-hour/blaze';
import readOcr from './actions/ocr.read';

const ocr = BlazeCreator.service({
  name: 'ocr',
  async onStarted() {
    console.log('OCR Started!');
  },
  actions: {
    read: readOcr,
  },
});

export default ocr;
