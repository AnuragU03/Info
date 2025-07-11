import { Sprout, ShieldCheck, Share2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-8">
          Our Mission
        </h1>
        <p className="text-lg text-center text-foreground/80 mb-12">
          VillageStay+ is a decentralized, AI-powered rural tourism platform designed to digitally empower Indian villages and connect travelers with authentic local experiences. Our goal is to bring underserved rural regions into the tourism economy using cutting-edge technologies.
        </p>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4">
              <Sprout className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-headline font-semibold mb-2">Empower Villages</h2>
            <p className="text-foreground/70">
              We provide tools for villagers to showcase their unique culture and heritage, creating new income streams and preserving traditions.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-accent/10 rounded-full p-4 mb-4">
              <Share2 className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-headline font-semibold mb-2">Connect Travelers</h2>
            <p className="text-foreground/70">
              Our AI-driven platform helps travelers discover hidden gems and authentic experiences far from the typical tourist trails.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-secondary rounded-full p-4 mb-4">
              <ShieldCheck className="h-10 w-10 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl font-headline font-semibold mb-2">Ensure Transparency</h2>
            <p className="text-foreground/70">
              Using blockchain technology, we ensure a fair and transparent booking system that benefits hosts, guests, and the entire village community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
