import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTermsAndConditions } from "@/hooks/admin/useTermsAndConditions";
import { ArrowLeft, Plus, Check, X, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TermsAndConditionsList() {
  const navigate = useNavigate();
  const { termsAndConditions, isLoading } = useTermsAndConditions();

  // Helper to extract title from multilingual object or array
  const getTitle = (titre: any): string => {
    if (!titre) return "Untitled";
    if (typeof titre === "string") return titre;
    // Handle array format: [{lang: "en", value: "..."}, ...]
    if (Array.isArray(titre)) {
      const enTitle = titre.find((t: any) => t.lang === "en")?.value;
      const frTitle = titre.find((t: any) => t.lang === "fr")?.value;
      return enTitle || frTitle || titre[0]?.value || "Untitled";
    }
    // Handle object format: {ar: "...", fr: "...", en: "..."}
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

  if (isLoading) {
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
            <h1 className="text-2xl font-semibold tracking-tight">Terms & Conditions</h1>
            <p className="text-muted-foreground text-sm">Manage your terms and conditions versions</p>
          </div>
        </div>
        <Button onClick={() => navigate("/admin/terms/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Document Versions</CardTitle>
        </CardHeader>
        <CardContent>
          {!termsAndConditions || termsAndConditions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No terms and conditions found. Create a new version to get started.
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {termsAndConditions.map((tc: any, index: number) => {
                    const isActive = tc.active === true || (tc.active as any) === "true" || (tc.active as any) === "1";
                    return (
                      <TableRow key={tc.condition_id || tc.id || index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{getTitle(tc.titre)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">v{tc.version || 1}</Badge>
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
                          {formatDate(tc.date_creation)}
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
