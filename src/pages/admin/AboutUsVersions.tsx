import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAboutUs } from "@/hooks/admin/useAboutUs";
import { ArrowLeft, Plus, Check, X, Pencil, Power, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AboutUsVersions() {
  const navigate = useNavigate();
  const { versions, isLoadingVersions, toggleActive, isToggling } = useAboutUs();

  // Helper to extract title from multilingual array
  const getTitle = (titre: any): string => {
    if (!titre) return "Untitled";
    if (typeof titre === "string") return titre;
    if (Array.isArray(titre)) {
      const enTitle = titre.find((t: any) => t.lang === "en")?.value;
      const frTitle = titre.find((t: any) => t.lang === "fr")?.value;
      return enTitle || frTitle || titre[0]?.value || "Untitled";
    }
    if (typeof titre === "object") {
      return titre.en || titre.fr || titre.ar || "Untitled";
    }
    return "Untitled";
  };

  // Helper to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const handleActivate = async (aboutId: string) => {
    try {
      await toggleActive(aboutId);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (isLoadingVersions) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-2 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/dashboard")}
            className="shrink-0 h-10 w-10 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">About Us</h1>
            <p className="text-muted-foreground text-sm">Manage your about us content versions</p>
          </div>
        </div>
        <Button onClick={() => navigate("/admin/about-us/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Content Versions</CardTitle>
        </CardHeader>
        <CardContent>
          {!versions || versions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No about us versions found. Create a new version to get started.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-[100px]">Version</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[150px]">Created</TableHead>
                    <TableHead className="w-[180px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version: any, index: number) => {
                    const isActive = version.active === "true" || version.active === "1" || version.active === true;
                    const versionId = version.about_id || (version as any).pk || (version.id ? String(version.id) : null);
                    
                    return (
                      <TableRow key={version.id || index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{getTitle(version.titre)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">v{version.version || 1}</Badge>
                        </TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              <Check className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground">
                              <X className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(version.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => versionId && navigate(`/admin/about-us/edit/${versionId}`)}
                              disabled={!versionId}
                              className="gap-1.5 h-8"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            {!isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => versionId && handleActivate(versionId)}
                                disabled={isToggling || !versionId}
                                className="gap-1.5 h-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                              >
                                {isToggling ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Power className="h-3.5 w-3.5" />
                                )}
                                Activate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
