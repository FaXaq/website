import { createParameterizedUrl } from '@/utils/createParameterizedUrl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parse } from 'qs';

export const useSearchParam = (key: string, defaultValue: string): [string, (v: string) => void]  => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = parse(searchParams.toString(), { arrayLimit: Infinity });
  const [value, setValue] = useState<string>((params[key] as string) ?? defaultValue);

  useEffect(() => {
    router.replace(createParameterizedUrl(location.pathname, {
      ...params,
      [key]: value
    }));
  }, [value]);

  return [value, setValue];
}