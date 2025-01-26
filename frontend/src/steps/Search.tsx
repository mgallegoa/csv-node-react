import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";
import { Data } from "../types";
import { searchData } from "../services/search";

const DEBOUNCE_TIME = 300;

export const Search = ({ initialData }: { initialData: Data | undefined }) => {
  const [data, setData] = useState<Data | undefined>(initialData);
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("q") ?? "";
  });
  const debounceSearch = useDebounce(search, DEBOUNCE_TIME);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const newPathName =
      debounceSearch === "" ? window.location.pathname : `?q=${debounceSearch}`;
    window.history.pushState({}, "", newPathName);
  }, [debounceSearch]);
  useEffect(() => {
    if (!debounceSearch) {
      setData(initialData);
      return;
    }
    searchData(debounceSearch).then((response) => {
      const [error, newData] = response;
      if (error) {
        toast.error(error.message);
        return;
      }
      console.log(newData);
      setData(newData);
    });
  }, [debounceSearch, initialData]);
  return (
    <div>
      <h2>Search</h2>
      <form>
        <input
          onChange={handleSearch}
          type="search"
          placeholder="Search Information"
          defaultValue={search}
        />
      </form>
      <ul>
        {data?.map((row) => (
          <li key={row.ProductID}>
            {Object.entries(row).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong>
                {value}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};
