import { useEffect, useState } from "react";
import { Data } from "../types";
import { searchData } from "../services/search";
import { toast } from "sonner";

export const Search = ({ initialData }: { initialData: Data | undefined }) => {
  const [data, setData] = useState<Data | undefined>(initialData);
  const [search, setSearch] = useState<string>("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  console.log(initialData);

  useEffect(() => {
    const newPathName =
      search === "" ? window.location.pathname : `?q=${search}`;
    window.history.pushState({}, "", newPathName);
  }, [search]);
  useEffect(() => {
    if (!search) {
      setData(initialData);
      return;
    }
    searchData(search).then((response) => {
      const [error, newData] = response;
      if (error) {
        toast.error(error.message);
        return;
      }
      setData(newData);
    });
  }, [search, initialData]);
  return (
    <div>
      <h2>Search</h2>
      <form>
        <input
          onChange={handleSearch}
          type="search"
          placeholder="Search Information"
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
