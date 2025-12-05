import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LanguageSelectorProvider } from "@/contexts/LanguageSelectorContext";
import { GlobalLanguageSelector } from "@/components/admin/GlobalLanguageSelector";
import { MultilingualField } from "@/components/admin/MultilingualField";
import { usePrivacyPolicy } from "@/hooks/admin/usePrivacyPolicy";
import { PrivacyPolicyFormData } from "@/types/admin/privacyPolicy";
import { ArrowLeft, Save, X, FileText, Settings } from "lucide-react";

function PrivacyPolicyForm() {
  const navigate = useNavigate();
  const { createPrivacyPolicy, isCreating } = usePrivacyPolicy();

  const [formData, setFormData] = useState<PrivacyPolicyFormData>({
    titre: { ar: "", fr: "", en: "" },
    contenu: { ar: "", fr: "", en: "" },
    version: 1,
    active: false,
  });

  // Calculate completion status for each language
  const completionStatus = {
    fr: !!(formData.titre.fr?.trim() && formData.contenu.fr?.trim()),
    ar: !!(formData.titre.ar?.trim() && formData.contenu.ar?.trim()),
    en: !!(formData.titre.en?.trim() && formData.contenu.en?.trim()),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPrivacyPolicy(formData, {
      onSuccess: () => {
        navigate("/admin/privacy-policy");
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/privacy-policy")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Create Privacy Policy
                </h1>
                <p className="text-sm text-muted-foreground">
                  Add a new privacy policy document
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/privacy-policy")}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                form="privacy-policy-form"
                disabled={isCreating}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isCreating ? "Saving..." : "Save Document"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <form id="privacy-policy-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Language Selector Card */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Editing language:</span>
                    </div>
                    <GlobalLanguageSelector completionStatus={completionStatus} />
                  </div>
                </CardContent>
              </Card>

              {/* Content Card */}
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-2 text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Document Content</h2>
                  </div>

                  <Separator className="bg-border/50" />

                  <MultilingualField
                    label="Title"
                    value={formData.titre}
                    onChange={(value) => setFormData({ ...formData, titre: value })}
                    type="input"
                    required
                    placeholder={{
                      ar: "أدخل العنوان بالعربية",
                      fr: "Entrez le titre en français",
                      en: "Enter the title in English",
                    }}
                  />

                  <MultilingualField
                    label="Content"
                    value={formData.contenu}
                    onChange={(value) => setFormData({ ...formData, contenu: value })}
                    type="textarea"
                    required
                    rows={12}
                    placeholder={{
                      ar: "أدخل المحتوى بالعربية",
                      fr: "Entrez le contenu en français",
                      en: "Enter the content in English",
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-2 text-foreground">
                    <Settings className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Document Settings</h2>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-2">
                    <Label htmlFor="version" className="text-sm font-medium">
                      Version Number
                    </Label>
                    <Input
                      id="version"
                      type="number"
                      value={formData.version}
                      onChange={(e) =>
                        setFormData({ ...formData, version: parseInt(e.target.value) || 1 })
                      }
                      required
                      min={1}
                      className="border-border bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Increment this when making significant changes
                    </p>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="active" className="text-sm font-medium">
                        Active Status
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Make this document visible to users
                      </p>
                    </div>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, active: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="border-border/50 bg-muted/30">
                <CardContent className="p-6">
                  <h3 className="font-medium text-sm text-foreground mb-2">
                    Tips for creating policies
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li>• Use the language selector to switch between languages</li>
                    <li>• Complete all three language versions for full coverage</li>
                    <li>• Keep the content clear and concise</li>
                    <li>• Only one active policy should be set at a time</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PrivacyPolicyCreate() {
  return (
    <LanguageSelectorProvider>
      <PrivacyPolicyForm />
    </LanguageSelectorProvider>
  );
}
