import { API_HOST } from "../config";
import { type ApiSearchResponse, type Data } from "../types";

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`${API_HOST}/api/users?q=${search}`);

    if (!res.ok) {
      return [new Error(`Error searching data: ${res.statusText}`)];
    }
    const jsonData = (await res.json()) as ApiSearchResponse;
    return [undefined, jsonData.data];
  } catch (error) {
    if (error instanceof Error) {
      return [error];
    }
  }
  return [new Error("Unknown error")];
};
