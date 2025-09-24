import { useRouter, useSearchParams } from "next/navigation";

export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get a param value
  const get = (key: string) => searchParams.get(key);

  // Set or update params (accepts an object)
  const set = (params: Record<string, string | undefined>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    return current.toString();
  };

  // Remove a param
  const remove = (key: string) => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete(key);
    return current.toString();
  };

  // Push new params to the URL
  const push = (
    pathname: string,
    params: Record<string, string | undefined>
  ) => {
    const queryString = set(params);
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return { get, set, remove, push };
}
