"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Settings, Save, Database, Mail, Shield, Bell } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "AI Interview Coach",
    siteDescription: "Practice with AI-powered mock interviews",
    maxInterviewDuration: "60",
    questionsPerInterview: "10",
    enableEmailNotifications: true,
    enableUserRegistration: true,
    maintenanceMode: false,
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    defaultRole: "user"
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Configure platform settings</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl space-y-6">
          {/* General Settings */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>General Settings</CardTitle>
              </div>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Interview Settings */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-secondary" />
                <CardTitle>Interview Settings</CardTitle>
              </div>
              <CardDescription>Configure interview parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDuration">Max Interview Duration (minutes)</Label>
                  <Input
                    id="maxDuration"
                    type="number"
                    value={settings.maxInterviewDuration}
                    onChange={(e) => setSettings({...settings, maxInterviewDuration: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questionsPerInterview">Questions Per Interview</Label>
                  <Input
                    id="questionsPerInterview"
                    type="number"
                    value={settings.questionsPerInterview}
                    onChange={(e) => setSettings({...settings, questionsPerInterview: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Settings */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <CardTitle>User Settings</CardTitle>
              </div>
              <CardDescription>Manage user registration and roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable User Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
                </div>
                <Switch
                  checked={settings.enableUserRegistration}
                  onCheckedChange={(checked) => setSettings({...settings, enableUserRegistration: checked})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultRole">Default User Role</Label>
                <Select value={settings.defaultRole} onValueChange={(value) => setSettings({...settings, defaultRole: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-chart-4" />
                <CardTitle>Email Settings</CardTitle>
              </div>
              <CardDescription>Configure SMTP for email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label>Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send automated emails to users</p>
                </div>
                <Switch
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, enableEmailNotifications: checked})}
                />
              </div>
              {settings.enableEmailNotifications && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        placeholder="smtp.example.com"
                        value={settings.smtpHost}
                        onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        placeholder="587"
                        value={settings.smtpPort}
                        onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      placeholder="user@example.com"
                      value={settings.smtpUser}
                      onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-chart-5" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Interview Completion Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify users when interviews are complete</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Admin Activity Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert admins of important system events</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}