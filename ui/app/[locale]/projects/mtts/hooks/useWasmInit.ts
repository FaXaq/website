import { useEffect, useState } from "react";

type WasmInitFunction<Input, Output> = (module_or_path?: Input | Promise<Input>) => Promise<Output>;

export default function useWasmInit<Input, Output>(init: WasmInitFunction<Input, Output>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasErrored, setHasErrored] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await init();
        setIsLoading(false);
        setHasLoaded(true);
      } catch (err) {
        setHasErrored(true);
        setError(err as Error);
        setHasLoaded(false);
      }
    })();
  }, []);

  return {
    isLoading,
    hasLoaded,
    hasErrored,
    error
  };
}