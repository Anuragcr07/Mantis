"use client";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPresignedUploadUrl } from "@/app/actions/s3";
import { 
  Users, Activity, AlertTriangle, FileText, Database, 
  Upload, Link as LinkIcon, Video, CheckCircle2, Loader2, X, Globe
} from "lucide-react";

export function CompanyDashboard() {
  // --- STATE ---
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [product, setProduct] = useState("RZ-1 Scooter");
  const [category, setCategory] = useState("Technical Manual");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

 const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validation: Ensure we have something to upload
    if (!selectedFile && !externalUrl) {
      alert("Please select a file or provide a URL.");
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      let finalDataLocation = externalUrl;

      // 2. S3 UPLOAD LOGIC
      if (selectedFile) {
        console.log("Step 1: Requesting Pre-signed URL for:", selectedFile.name);
        
        // Call the Server Action (Auth Server)
        const { url, fileKey } = await getPresignedUploadUrl(
          selectedFile.name, 
          selectedFile.type, 
          "company"
        );
        
        console.log("Step 2: Uploading directly to S3...");
        
        // Perform the actual PUT request to AWS
        const s3Response = await fetch(url, {
          method: "PUT",
          body: selectedFile,
          headers: { 
            "Content-Type": selectedFile.type 
          },
        });

        if (!s3Response.ok) {
          throw new Error(`S3 Upload failed with status: ${s3Response.status}`);
        }

        // Construct the S3 URI or Public URL for your friend's FastAPI
        // Option A: S3 URI (Standard for AI processing)
        finalDataLocation = `s3://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}/${fileKey}`;
        
        // Option B: Public HTTPS URL (If his FastAPI needs to download it directly)
        // finalDataLocation = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;
        
        console.log("✅ S3 Upload Successful. Location:", finalDataLocation);
      }

      // 3. FASTAPI HANDSHAKE
      console.log("Step 3: Notifying FastAPI model for training...");
      
      const fastApiResponse = await fetch("http://localhost:8000/train", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          product_name: product, // from your state
          data_category: category, // from your state
          source_url: finalDataLocation,
          file_name: selectedFile ? selectedFile.name : "External Link",
          timestamp: new Date().toISOString()
        }),
      });

      if (!fastApiResponse.ok) {
        throw new Error(`FastAPI rejected the training request: ${fastApiResponse.status}`);
      }

      // 4. UI SUCCESS STATE
      console.log("🎉 Training initialized successfully!");
      setUploadSuccess(true);
      
      // Cleanup
      setSelectedFile(null);
      setExternalUrl("");
      
      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);

    } catch (error) {
      console.error("❌ Ingestion Pipeline Failed:", error);
      alert(error instanceof Error ? error.message : "A system error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-display font-bold text-text">Philix HQ Dashboard</h1>
            <p className="text-text-muted text-sm mt-1">Universal product intelligence & RAG management.</p>
        </div>
        <div className="flex gap-3">
            <Badge variant="outline" className="border-confirm/20 text-confirm bg-confirm/5 font-mono px-3 py-1">
               <Activity size={12} className="mr-2 animate-pulse"/> ENGINE_ONLINE
            </Badge>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnalyticsCard title="Total Fleet" value="1.2M" icon={<Users size={16}/>} />
        <AnalyticsCard title="AI Resolve Rate" value="94.2%" icon={<Activity className="text-confirm" size={16}/>} />
        <AnalyticsCard title="Pending Escalations" value="12" icon={<AlertTriangle className="text-alert" size={16}/>} />
        <AnalyticsCard title="Knowledge Base" value="4.2GB" icon={<Database size={16}/>} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* DATA INGESTION ENGINE */}
        <Card className="lg:col-span-2 bg-surface border-line ring-1 ring-confirm/5">
          <CardHeader className="border-b border-line bg-surface-2/30">
            <CardTitle className="text-sm font-display uppercase tracking-widest flex items-center gap-2">
              <Database size={16} className="text-confirm" />
              Intelligence Ingestion Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleIngest} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-text-muted">Targeted Product</label>
                  <select 
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full bg-surface-2 border border-line rounded-xl h-11 px-4 text-sm focus:ring-1 focus:ring-confirm outline-none transition-all"
                  >
                    <option>RZ-1 Scooter</option>
                    <option>Arctic v2 AC</option>
                    <option>Wash-Master 3000</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-text-muted">Document Context</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-2 border border-line rounded-xl h-11 px-4 text-sm focus:ring-1 focus:ring-confirm outline-none transition-all"
                  >
                    <option>Technical Manual</option>
                    <option>Repair Video</option>
                    <option>Wiring Diagram</option>
                    <option>Warranty Policy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* S3 UPLOAD ZONE */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    selectedFile ? "border-confirm bg-confirm/5" : "border-line bg-canvas/50 hover:border-confirm/40"
                  }`}
                >
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                  
                  {selectedFile ? (
                    <div className="text-center">
                        <CheckCircle2 size={32} className="text-confirm mx-auto mb-2" />
                        <p className="text-sm font-bold truncate max-w-[150px]">{selectedFile.name}</p>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="text-[10px] text-alert mt-2 uppercase font-bold">Remove</button>
                    </div>
                  ) : (
                    <>
                        <Upload size={32} className="text-text-faint group-hover:text-confirm transition-colors mb-2" />
                        <p className="text-sm font-bold">Upload Source File</p>
                        <p className="text-[10px] text-text-faint mt-1 uppercase font-mono">PDF / MP4 / PNG</p>
                    </>
                  )}
                </div>

                {/* URL INPUT */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-muted">Web Scraper / Video URL</label>
                    <div className="relative">
                        <Globe size={14} className="absolute left-4 top-3.5 text-text-faint" />
                        <Input 
                            placeholder="https://support.philix.com/..." 
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            className="pl-10 bg-surface-2 border-line h-11 rounded-xl" 
                        />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-confirm/5 border border-confirm/10">
                    <p className="text-[11px] text-confirm/80 leading-relaxed font-medium">
                      Note: Submitting this data will trigger the RAG pipeline. The AI will chunk and embed this content into the vector database.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-between">
                <p className="text-xs text-text-muted">
                    {selectedFile || externalUrl ? "Ready for training session." : "Select a source to begin."}
                </p>
                <Button 
                    type="submit" 
                    disabled={isUploading || (!selectedFile && !externalUrl)}
                    className="bg-confirm text-canvas font-bold px-10 h-12 rounded-xl hover:scale-105 transition-all shadow-lg shadow-confirm/20"
                >
                  {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Training Model...</> : 
                   uploadSuccess ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Sync Complete</> : 
                   "Initialize Training"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* SIDEBAR: SYSTEM STATUS */}
        <div className="space-y-6">
            <Card className="bg-surface border-line overflow-hidden">
                <div className="bg-confirm p-1 text-[10px] text-canvas font-bold text-center uppercase tracking-[0.2em]">
                    Real-time Training Monitor
                </div>
                <CardContent className="pt-6 pb-6">
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-text-muted italic">Vector_Space_Usage</span>
                            <span className="text-text">72%</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                            <div className="h-full bg-confirm w-[72%]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="text-center p-2 rounded-lg bg-surface-2 border border-line">
                                <p className="text-[10px] text-text-muted uppercase">Nodes</p>
                                <p className="text-lg font-bold font-mono">4,102</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-surface-2 border border-line">
                                <p className="text-[10px] text-text-muted uppercase">Latency</p>
                                <p className="text-lg font-bold font-mono">14ms</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-surface border-line">
                <CardHeader>
                    <CardTitle className="text-xs font-display uppercase tracking-widest text-text-muted">Recent Intelligence Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-3">
                            <AssetItem name="Motor_Manual_v4.pdf" status="Indexed" />
                            <AssetItem name="RZ1_Schematics.png" status="Visual_RAG" />
                            <AssetItem name="Philix_FAQ_Site" status="Scraped" />
                            <AssetItem name="Training_Video_01.mp4" status="Timestamps" />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function AssetItem({ name, status }: { name: string, status: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-surface-2 border border-line rounded-xl hover:border-confirm/40 transition-colors cursor-default">
            <div className="flex items-center gap-3">
                <FileText size={14} className="text-text-faint" />
                <span className="text-xs font-bold truncate w-28">{name}</span>
            </div>
            <span className="text-[9px] font-mono bg-confirm/10 text-confirm px-1.5 py-0.5 rounded uppercase">{status}</span>
        </div>
    )
}

function AnalyticsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-surface border-line p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted font-display uppercase tracking-widest">{title}</p>
        <div className="text-confirm opacity-30">{icon}</div>
      </div>
      <p className="text-3xl font-bold font-display mt-3">{value}</p>
    </Card>
  );
}