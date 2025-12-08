import React from "react";

import { LoggedInGuard } from "@/components/LoggedInGuard";

import UploadForm from './components/UploadForm';

export default async function Upload() {
  return <LoggedInGuard>
    <UploadForm />
  </LoggedInGuard>;
}
