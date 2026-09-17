import Navbar from "@/components/ui/Navbar";
import ConfessionWall from "@/components/wall/ConfessionWall";
import FloatingSocialLogos from "@/components/wall/FloatingSocialLogos";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Floating 3D Instagram & Discord Logos reacting to Mouse Parallax on Main Wall */}
      <FloatingSocialLogos />
      <Navbar />
      <div className="flex-1">
        <ConfessionWall />
      </div>
    </main>
  );
}
