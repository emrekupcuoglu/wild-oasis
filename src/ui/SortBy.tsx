import { FormEvent } from "react";
import Select from "./Select";
import { useSearchParams } from "react-router-dom";

interface ISortOptions {
  value: string;
  label: string;
}

interface SortByProps {
  options: ISortOptions[];
}

function SortBy({ options }: SortByProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(e: FormEvent) {
    const target = e.target as HTMLOptionElement;
    searchParams.set("sortBy", target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      value={sortBy}
    />
  );
}

export default SortBy;
