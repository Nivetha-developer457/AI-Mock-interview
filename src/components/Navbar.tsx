"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, LayoutDashboard, Shield } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Interview Coach
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/#how-it-works">How It Works</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}