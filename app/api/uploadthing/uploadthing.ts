import { generateComponents } from "@uploadthing/react";
 
import type { OurFileRouter } from "../uploadthing/core";
 
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();