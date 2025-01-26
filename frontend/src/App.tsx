import { useState } from "react";
import { Toaster, toast } from "sonner";
import "./App.css";
import { uploadFile } from "./services/upload";
import { type Data } from "./types";

const APP_STATUS = {
  IDLE: "idle", // start
  ERROR: "error", // in case of error
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  LOAD_FINISHED: "load_finished",
} as const;

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

const BUTTON_TEXT: Record<string, string> = {
  [APP_STATUS.READY_UPLOAD]: "Upload File",
  [APP_STATUS.UPLOADING]: "Uploading...",
};

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Data | undefined>([]);

  const handleInputCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
      return;
    }
    setAppStatus(APP_STATUS.UPLOADING);
    const [error, newData] = await uploadFile(file);
    if (error) {
      setAppStatus(APP_STATUS.ERROR);
      toast.error(error.message);
      return;
    }
    setData(newData);

    setAppStatus(APP_STATUS.LOAD_FINISHED);
    toast.success("File uploaded succefully");
  };

  const showFileInput =
    appStatus === APP_STATUS.READY_UPLOAD ||
    appStatus === APP_STATUS.IDLE ||
    appStatus === APP_STATUS.UPLOADING;
  const showUploadButton =
    appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;
  return (
    <>
      <Toaster />
      <h1>CSV challenge</h1>
      {showFileInput && (
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
            <button type="submit" disabled={appStatus === APP_STATUS.UPLOADING}>
              {BUTTON_TEXT[appStatus]}
            </button>
          )}
        </form>
      )}
      {appStatus === APP_STATUS.LOAD_FINISHED && <h2>File loaded</h2>}
    </>
  );
}

export default App;
