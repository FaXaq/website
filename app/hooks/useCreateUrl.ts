import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { useSearchParams } from "next/navigation"
import { parse } from "qs";

export const useCreateUrl = () => {
  const queryParams = useSearchParams();
  const previousLocale = parse(queryParams.toString(), { arrayLimit: Infinity }).locale;

  return (path: string, params?: object) => {
    if (!path.includes("://") && previousLocale ) {
      return createParameterizedUrl(path, params || { locale: previousLocale });
    }

    return createParameterizedUrl(path);
  }
}