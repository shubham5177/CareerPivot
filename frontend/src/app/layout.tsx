import "./globals.css";
import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";

export const metadata: Metadata = {
  title: "CareerPivot AI – Intelligent Career Transition & Job Readiness Coach",
  description: "AI-powered career coaching, resume parsing, skill gap matrix, personalized roadmaps, and mock interviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-slate-100 min-h-screen flex antialiased">
        <AuthShell>{children}</AuthShell>
      </body>
    </html>
  );
}
