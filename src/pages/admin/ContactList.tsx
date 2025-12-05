import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContacts } from "@/hooks/admin/useContacts";
import { 
  ArrowLeft, 
  Plus, 
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe,
  Check
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ContactList() {
  const navigate = useNavigate();
  const { contact, isLoading } = useContacts();

  // Helper to get multilingual value
  const getMultilingualValue = (field: any): string => {
    if (!field) return "-";
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      return field.en || field.fr || field.ar || "-";
    }
    return "-";
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
            <h1 className="text-2xl font-semibold tracking-tight">Contact Information</h1>
            <p className="text-muted-foreground text-sm">Manage your organization's contact details</p>
          </div>
        </div>
        {contact ? (
          <Button onClick={() => navigate("/admin/contacts/edit")} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Contact
          </Button>
        ) : (
          <Button onClick={() => navigate("/admin/contacts/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          {!contact ? (
            <p className="text-center text-muted-foreground py-8">
              No contact information found. Add your contact details to get started.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                      </div>
                    </TableCell>
                    <TableCell>{contact.email || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone 1
                      </div>
                    </TableCell>
                    <TableCell>{contact.telephone_1 || "-"}</TableCell>
                  </TableRow>
                  {contact.telephone_2 && (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Phone 2
                        </div>
                      </TableCell>
                      <TableCell>{contact.telephone_2}</TableCell>
                    </TableRow>
                  )}
                  {contact.telephone_fixe && (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Landline
                        </div>
                      </TableCell>
                      <TableCell>{contact.telephone_fixe}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Address
                      </div>
                    </TableCell>
                    <TableCell>{getMultilingualValue(contact.adresse)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        City / Wilaya
                      </div>
                    </TableCell>
                    <TableCell>
                      {getMultilingualValue(contact.ville)}
                      {contact.wilaya && `, ${getMultilingualValue(contact.wilaya)}`}
                    </TableCell>
                  </TableRow>
                  {contact.site_web && (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          Website
                        </div>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={contact.site_web} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {contact.site_web}
                        </a>
                      </TableCell>
                    </TableRow>
                  )}
                  {contact.horaires && (
                    <TableRow>
                      <TableCell className="font-medium">Working Hours</TableCell>
                      <TableCell>{contact.horaires}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Created</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(contact.date_creation)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
