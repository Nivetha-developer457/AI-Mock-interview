"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ResumeUploadProps {
  userId: number;
}

export default function ResumeUpload({ userId }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResume();
  }, [userId]);

  const loadResume = async () => {
    try {
      const response = await fetch(`/api/resumes?userId=${userId}`);
      const resumes = await response.json();
      if (resumes.length > 0) {
        setResume(resumes[0]);
      }
    } catch (error) {
      console.error("Error loading resume:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a PDF or DOC file.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    setUploading(true);
    
    try {
      // Simulate file upload to storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockFileUrl = `https://storage.example.com/resumes/${userId}-${file.name}`;
      
      // Analyze resume
      setAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create resume in database with mock parsed data
      const mockParsedData = {
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "SQL"],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            school: "University Name",
            year: 2020
          }
        ],
        experience: [
          {
            title: "Software Engineer",
            company: "Tech Company",
            years: 2,
            description: "Developed web applications using modern frameworks"
          }
        ],
        summary: "Experienced software engineer with strong full-stack development skills"
      };

      const mockSuggestedRoles = [
        "Software Engineer",
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Web Developer"
      ];

      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          fileUrl: mockFileUrl,
          fileName: file.name,
          parsedData: mockParsedData,
          suggestedRoles: mockSuggestedRoles
        })
      });

      if (response.ok) {
        const newResume = await response.json();
        setResume(newResume);
        toast.success("Resume uploaded and analyzed successfully!");
      } else {
        throw new Error("Failed to save resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>
            Upload your resume for AI-powered analysis and personalized role recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {uploading || analyzing ? (
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 text-primary" />
                  )}
                </div>
                
                {analyzing ? (
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Analyzing your resume...</p>
                    <p className="text-sm text-muted-foreground">
                      Our AI is extracting skills, experience, and suggesting roles
                    </p>
                  </div>
                ) : uploading ? (
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Uploading...</p>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we upload your file
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="resume-upload">
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          asChild
                        >
                          <span>
                            <FileText className="h-4 w-4 mr-2" />
                            Choose File
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading || analyzing}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, or DOCX (Max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Resume Card */}
      {resume && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Current Resume
                </CardTitle>
                <CardDescription>
                  Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                <Sparkles className="h-3 w-3 mr-1" />
                Analyzed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Info */}
            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{resume.fileName}</p>
                <p className="text-sm text-muted-foreground">Resume file</p>
              </div>
            </div>

            {/* Suggested Roles */}
            {resume.suggestedRoles && resume.suggestedRoles.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Suggested Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {resume.suggestedRoles.map((role: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Skills */}
            {resume.parsedData?.skills && resume.parsedData.skills.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Extracted Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {resume.parsedData.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {resume.parsedData?.experience && resume.parsedData.experience.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Experience</h4>
                <div className="space-y-3">
                  {resume.parsedData.experience.map((exp: any, index: number) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.years} {exp.years === 1 ? 'year' : 'years'}
                      </p>
                      {exp.description && (
                        <p className="text-sm mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.parsedData?.education && resume.parsedData.education.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Education</h4>
                <div className="space-y-3">
                  {resume.parsedData.education.map((edu: any, index: number) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.school} • {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}