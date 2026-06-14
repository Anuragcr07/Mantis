"use client";
import { useState } from "react";
import { getPresignedUploadUrl } from "@/app/actions/s3";
import { Button } from "@/components/ui/button";
// If your project doesn't export a Progress component at '@/components/ui/progress',
// provide a small local fallback to avoid module not found errors.
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={className}>
    <div className="w-full bg-muted rounded h-1 overflow-hidden">
      <div className="bg-primary h-1" style={{ width: `${value}%` }} />
    </div>
  </div>
);
import { Upload, CheckCircle2, Loader2, FileText, Video } from "lucide-react";

interface Props {
  role: "company" | "customer";
  onUploadComplete: (fileUrl: string) => void;
  allowedTypes?: string[]; // e.g. ["application/pdf", "video/mp4"]
}

export function S3UploadZone({ role, onUploadComplete, allowedTypes }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(10);

    try {
      // 1. Get Secure URL from Next.js Auth Server logic
      const { url, fileKey } = await getPresignedUploadUrl(file.name, file.type, role);
      setProgress(30);

      // 2. Upload directly to S3 via PUT
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 70) + 30;
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const finalUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
          onUploadComplete(finalUrl);
          setUploading(false);
        }
      };
      
      xhr.send(file);
    } catch (err) {
      alert("Upload failed. Check console.");
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-line rounded-xl cursor-pointer hover:bg-surface-2 transition-all">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-signal animate-spin mb-2" />
              <p className="text-xs text-text-muted">Uploading to S3... {progress}%</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-text-faint mb-2" />
              <p className="text-sm font-medium">Click to upload PDF or Video</p>
              <p className="text-[10px] text-text-faint uppercase mt-1">S3 Secured Gateway</p>
            </>
          )}
        </div>
        <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} accept={allowedTypes?.join(',')} />
      </label>
      
      {uploading && <Progress value={progress} className="h-1 mt-4" />}
    </div>
  );
}