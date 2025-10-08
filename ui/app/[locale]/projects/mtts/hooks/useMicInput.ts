import { useEffect, useMemo, useState } from "react";

export default function useMicInput() {
  const [micStream, setMicStream] = useState<MediaStream | undefined>();
  const [error, setError] = useState();

  async function requestAccess() {
    if (!micStream) {
      try {
        setMicStream(await navigator.mediaDevices.getUserMedia({ audio: true }));
      } catch (err) {
        setError(err);
        console.error(err);
      }
    }
  }

  const isActive = useMemo(() => {
    if (!micStream) {
      return false;
    }

    return micStream.active;
  }, [micStream]);

  function revokeAccess() {
    if (micStream) {
      micStream.getTracks().forEach(track => {
        track.stop();
      });
      setMicStream(undefined);
    }
  }

  // This is to ensure that we close all opened AudioStream before moving on to another page
  useEffect(() => {
    revokeAccess();
  }, []);

  return {
    micStream,
    isActive,
    requestAccess,
    revokeAccess
  };
}