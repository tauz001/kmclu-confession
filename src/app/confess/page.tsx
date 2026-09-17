import ConfessForm from "@/components/confess/ConfessForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write Confession — KMCLU Confession Wall",
  description:
    "Say it, leave it, let it float. Submit your anonymous confession to the KMCLU community wall.",
};

export default function ConfessPage() {
  return (
    <main className="min-h-[100dvh] min-h-dvh w-full flex items-center justify-center overflow-y-auto py-2 sm:py-6">
      <ConfessForm />
    </main>
  );
}
