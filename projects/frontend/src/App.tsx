import { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import { OcrSummary } from './types/ocr';
import { readOcr, summarizeOcr } from './api/ocr';

function App() {
  const [isOnPreview, setIsOnPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OcrSummary | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = useCallback(async () => {
    if (!files.length) return;

    try {
      setIsProcessing(true);

      const ocr = await readOcr(files);
      const summary = await summarizeOcr(ocr);

      setResult(summary);
      setFiles([]);

      setIsOnPreview(true);
    } finally {
      setIsProcessing(false);
    }
  }, [files]);

  const onBack = useCallback(() => setIsOnPreview(false), []);

  if (isOnPreview) {
    return (
      <div>
        <pre>{JSON.stringify(result || '{}', null, 2)}</pre>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <>
      <Dropzone
        accept={{
          'application/*': ['.pdf'],
        }}
        maxFiles={1}
        onDrop={setFiles}
        disabled={isProcessing}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="card" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>
      <button onClick={onSubmit} disabled={files.length === 0 || isProcessing}>
        Submit
      </button>
    </>
  );
}

export default App;
