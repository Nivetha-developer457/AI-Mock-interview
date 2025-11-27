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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Zap,
  Bell,
  Globe,
  Key
} from "lucide-react";
import { toast } from "sonner";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    maintenanceMode: false,
    userRegistration: true,
    autoBackup: true,
    analyticsTracking: true
  });

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  const settingsSections = [
    {
      title: "General Settings",
      icon: Settings,
      items: [
        {
          key: "siteName",
          label: "Site Name",
          type: "input",
          value: "AI Interview Coach",
          description: "The name displayed across the platform"
        },
        {
          key: "siteDescription",
          label: "Site Description",
          type: "textarea",
          value: "Practice with AI-powered mock interviews and get instant feedback",
          description: "Brief description for SEO and marketing"
        },
        {
          key: "timezone",
          label: "Timezone",
          type: "select",
          value: "UTC",
          options: ["UTC", "EST", "PST", "GMT"],
          description: "Default timezone for the system"
        }
      ]
    },
    {
      title: "Email Configuration",
      icon: Mail,
      items: [
        {
          key: "smtpHost",
          label: "SMTP Host",
          type: "input",
          value: "smtp.example.com",
          description: "Email server hostname"
        },
        {
          key: "smtpPort",
          label: "SMTP Port",
          type: "input",
          value: "587",
          description: "Email server port number"
        },
        {
          key: "fromEmail",
          label: "From Email",
          type: "input",
          value: "noreply@aiinterviewcoach.com",
          description: "Default sender email address"
        }
      ]
    },
    {
      title: "Security Settings",
      icon: Shield,
      items: [
        {
          key: "sessionTimeout",
          label: "Session Timeout",
          type: "input",
          value: "30",
          description: "Minutes before user session expires"
        },
        {
          key: "maxLoginAttempts",
          label: "Max Login Attempts",
          type: "input",
          value: "5",
          description: "Maximum failed login attempts before lockout"
        },
        {
          key: "passwordMinLength",
          label: "Min Password Length",
          type: "input",
          value: "8",
          description: "Minimum characters required for passwords"
        }
      ]
    },
    {
      title: "API Configuration",
      icon: Key,
      items: [
        {
          key: "openaiKey",
          label: "OpenAI API Key",
          type: "input",
          value: "sk-*********************",
          description: "API key for AI question generation"
        },
        {
          key: "rateLimit",
          label: "Rate Limit",
          type: "input",
          value: "100",
          description: "API requests per minute per user"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <Badge variant="secondary" className="mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5" />
                  Connected
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">API</p>
                <Badge variant="secondary" className="mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5" />
                  Active
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <Badge variant="secondary" className="mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5" />
                  Configured
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Security</p>
                <Badge variant="secondary" className="mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5" />
                  Enabled
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications to users
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>User Registration</Label>
              <p className="text-sm text-muted-foreground">
                Allow new users to register accounts
              </p>
            </div>
            <Switch
              checked={settings.userRegistration}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, userRegistration: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable site access for maintenance
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup database daily
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoBackup: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Track user behavior and analytics
              </p>
            </div>
            <Switch
              checked={settings.analyticsTracking}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, analyticsTracking: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration Sections */}
      {settingsSections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <section.icon className="h-5 w-5 text-primary" />
              <CardTitle>{section.title}</CardTitle>
            </div>
            <CardDescription>Configure {section.title.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="space-y-2">
                <Label htmlFor={item.key}>{item.label}</Label>
                {item.type === "input" && (
                  <Input
                    id={item.key}
                    defaultValue={item.value}
                    placeholder={item.label}
                  />
                )}
                {item.type === "textarea" && (
                  <Textarea
                    id={item.key}
                    defaultValue={item.value}
                    placeholder={item.label}
                  />
                )}
                {item.type === "select" && (
                  <Select defaultValue={item.value}>
                    <SelectTrigger id={item.key}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {item.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSaveSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}