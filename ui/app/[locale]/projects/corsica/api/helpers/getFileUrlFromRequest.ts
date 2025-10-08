export const getfileUrlFromRequest = (formData: FormData): string | void => {
  return formData.get('fileUrl') as string;
};
