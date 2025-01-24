import { useState } from "react";
import "./App.css";

const APP_STATUS = {
  IDLE: "idle", // start
  ERROR: "error", // in case of error
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  READY_USAGE: "ready_usage",
} as const;

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "Upload File",
  [APP_STATUS.UPLOADING]: "Uploading...",
};

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const handleInputCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const showUploadButton = APP_STATUS.READY_UPLOAD || APP_STATUS.UPLOADING;
  return (
    <>
      <h1>CSV challenge</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            onChange={handleInputCSV}
            type="file"
            name="file"
            accept=".csv"
            disabled={appStatus === APP_STATUS.UPLOADING}
          />
        </label>
        {showUploadButton && (
          <button type="button">{BUTTON_TEXT[appStatus]}</button>
        )}
      </form>
    </>
  );
}

export default App;
