import { API_HOST } from "../config";
import { ApiUploadResponse, type Data } from "../types";

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_HOST}/api/files`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return [new Error(`Error uploading file: ${res.statusText}`)];
    }
    const jsonData = (await res.json()) as ApiUploadResponse;
    return [undefined, jsonData.data];
  } catch (error) {
    if (error instanceof Error) {
      return [error];
    }
  }
  return [new Error("Unknown error")];
};
