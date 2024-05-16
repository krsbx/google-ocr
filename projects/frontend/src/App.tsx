import { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import axios from 'axios';
import { ocrResultExample } from './utils/example';

const isUsingExample = import.meta.env.VITE_USE_EXAMPLE == 'true';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = useCallback(async () => {
    if (isUsingExample) return ocrResultExample;

    if (!files.length) return;

    try {
      setIsProcessing(true);

      const formData = new FormData();
      formData.append('file', files[0]);

      const { data } = await axios.post<Record<number, string[]>>(
        `${import.meta.env.VITE_API_URL}/ocr`,
        formData
      );

      return data;
    } finally {
      setIsProcessing(false);
    }
  }, [files]);

  return (
    <>
      <Dropzone
        accept={{
          'application/*': ['.pdf'],
        }}
        maxFiles={1}
        onDrop={setFiles}
        disabled={isUsingExample ? false : files.length === 0 || isProcessing}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="card" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>
      <button
        onClick={onSubmit}
        disabled={isUsingExample ? false : files.length === 0 || isProcessing}
      >
        Submit
      </button>
    </>
  );
}

export default App;
