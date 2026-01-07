import { Box, FileUpload, Icon, Span } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuUpload } from 'react-icons/lu';

import AnalyseFile from '@/components/mtts/party/AnalyseFile';
import { m } from '@/paraglide/messages';

export const Route = createFileRoute('/projects/mtts/party')({
  component: RouteComponent,
  ssr: false
});

function RouteComponent() {
  const { register, watch } = useForm<{ files: FileList }>();
  const [file, setFile] = useState<File | null>(null);

  if (file) {
    return <AnalyseFile file={file} />;
  }

  return (
    <FileUpload.Root width="100%" maxFiles={Infinity} onFileAccept={(f) => setFile(f.files[0] as File)}>
      <FileUpload.Label>
        {m['mtts_party_uploadFile']()}
        <Span fontSize="sm" color="fg.error">*</Span>
      </FileUpload.Label>
      <FileUpload.HiddenInput
        {...register("files", { required: m['mtts_party_uploadFile_required']() })}
        accept=".mp3"
        required
        multiple={false}
      />
      <FileUpload.Dropzone width="100%" cursor="pointer" height="100px">
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>{m['mtts_party_uploadFile_description']()}</Box>
          <Box color="fg.muted">.mp3, .flac, .wav</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
}
