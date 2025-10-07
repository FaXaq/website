import React from "react"
import UploadForm from './components/UploadForm'
import { isServerDev } from "@/lib/config"


export default function Upload() {
  return isServerDev && <UploadForm />
}
