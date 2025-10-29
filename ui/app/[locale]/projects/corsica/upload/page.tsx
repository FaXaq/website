import React from "react";

import { isServerDev } from "@/lib/config";

import UploadForm from './components/UploadForm';


export default function Upload() {
  return isServerDev() && <UploadForm />;
}
