import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

type Params = Record<string, string | undefined>;

const useUrlParams = () => {
  const [searchParams] = useSearchParams();
  const next = decodeURIComponent(searchParams.get("next") || "") || null;

  /**
   * Constructs a URL path with specified query parameters.
   *
   * @param {string} basePath - The base path to append query parameters to.
   * @param {Params} params - An object of key-value pairs to include in the query string.
   * @returns {string} - The constructed URL path with query parameters, including `next` if present.
   */
  const constructPath = useCallback(
    (basePath: string, params: Params) => {
      const urlParams = new URLSearchParams();

      // Add each parameter to urlParams, encoding values
      Object.entries(params).forEach(([key, value]) => {
        if (value) urlParams.append(key, encodeURIComponent(value));
      });

      // Conditionally include 'next' if it's present in the URL
      if (next) urlParams.append("next", encodeURIComponent(next));

      return `${basePath}?${urlParams.toString()}`;
    },
    [next]
  );

  /**
   * Retrieves and decodes URL parameters based on specified keys.
   *
   * @template T - A generic type specifying the structure of parameters to retrieve.
   * @returns {T} - An object with the specified URL parameters as decoded values, or `null` if not found.
   */
  const getDecodedParams = useCallback(
    <T extends Record<string, string>>(keys: Array<keyof T>): T => {
      const decodedParams: Partial<Record<keyof T, string | null>> = {};

      keys?.forEach((key) => {
        const param = searchParams.get(key as string);
        decodedParams[key] = param ? decodeURIComponent(param) : null;
      });

      return decodedParams as T;
    },
    [searchParams]
  );

  return { next, constructPath, getDecodedParams };
};

export default useUrlParams;
