import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRequestCampaignUploadUrl, useSendCampaign } from "@workspace/api-client-react";
import { useRef, useState } from "react";
import { Upload, Send, Loader2 } from "lucide-react";
import img1 from "@assets/1_1789318706811.jpeg";
import img2 from "@assets/2_1789318706812.jpeg";
import img3 from "@assets/3_1789318706812.jpeg";
import img4 from "@assets/4_1789318706813.jpeg";

type Poster = {
  src: string;
  title: string;
  uploadedLabel: string;
  objectPath?: string;
};

export default function AdminCampaigns() {
  const [posters, setPosters] = useState<Poster[]>([
    { src: img1, title: "ITR12 Campaign", uploadedLabel: "Uploaded: Oct 2023" },
    { src: img2, title: "IRP6 Services", uploadedLabel: "Uploaded: Oct 2023" },
    { src: img3, title: "IRP6 Reminder", uploadedLabel: "Uploaded: Oct 2023" },
    { src: img4, title: "Payroll Services", uploadedLabel: "Uploaded: Oct 2023" },
  ]);
  const [uploading, setUploading] = useState(false);
  const [sendingTitle, setSendingTitle] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const requestCampaignUploadUrl = useRequestCampaignUploadUrl();
  const sendCampaign = useSendCampaign();

  const handleUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Upload failed", description: "Choose a JPG, PNG, or WebP poster." });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Upload failed", description: "Posters must be smaller than 25 MB." });
      return;
    }

    setUploading(true);
    try {
      const requestBody = await requestCampaignUploadUrl.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type },
      });

      const upload = await fetch(requestBody.uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!upload.ok) throw new Error("The poster upload failed.");

      const title = file.name.replace(/\.[^/.]+$/, "").trim() || "Untitled campaign";
      setPosters((current) => [
        {
          src: URL.createObjectURL(file),
          title,
          uploadedLabel: "Uploaded: Just now",
          objectPath: requestBody.objectPath,
        },
        ...current,
      ]);
      toast({ title: "Poster uploaded", description: "The poster is now ready to send." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "The poster could not be uploaded.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sendBlast = async (poster: Poster) => {
    setSendingTitle(poster.title);
    try {
      const message = `Ditheto Accountants — ${poster.title}\n\nPlease see the attached campaign poster.`;
      const body = await sendCampaign.mutateAsync({
        data: {
          title: poster.title,
          message,
          ...(poster.objectPath ? { objectPath: poster.objectPath } : {}),
        },
      });

      const popup = window.open(body.deliveryUrl, "_blank", "noopener,noreferrer");
      if (!popup) {
        throw new Error("WhatsApp could not be opened. Allow pop-ups and try again.");
      }
      toast({
        title: "Campaign ready",
        description: "WhatsApp is open. Attach the poster, then press Send to complete the blast.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Campaign not sent",
        description: error instanceof Error ? error.message : "The campaign could not be sent.",
      });
    } finally {
      setSendingTitle(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-500 text-sm">Media Library & WhatsApp Poster Blasts</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => void handleUpload(event.target.files?.[0])}
        />
        <Button
          type="button"
          className="bg-primary hover:bg-primary/90 text-white gap-2"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload New Poster"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posters.map((poster) => (
          <Card key={`${poster.title}-${poster.objectPath ?? poster.src}`} className="overflow-hidden group border-gray-200">
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
              <img src={poster.src} alt={poster.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  className="bg-white text-secondary hover:bg-gray-100 gap-2 font-semibold"
                  disabled={sendingTitle === poster.title}
                  onClick={() => void sendBlast(poster)}
                >
                  {sendingTitle === poster.title
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Send className="h-4 w-4" />}
                  {sendingTitle === poster.title ? "Preparing…" : "Send Blast"}
                </Button>
              </div>
            </div>
            <CardContent className="p-4 bg-white">
              <h4 className="font-bold text-secondary text-sm mb-1">{poster.title}</h4>
              <p className="text-xs text-gray-500">{poster.uploadedLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
