import { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
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
    } catch {
      toast('Error processing files', { type: 'error' });
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

  if (isProcessing) {
    return (
      <div className="card">
        <p>Please wait</p>
        <BeatLoader
          color={'#00d7b8'}
          loading={isProcessing}
          size={20}
          speedMultiplier={0.5}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
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
      >
        {({ getRootProps, getInputProps }) => (
          <div className="card" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>
      <button onClick={onSubmit} disabled={!files.length}>
        Submit
      </button>
    </>
  );
}

export default App;
