"use client";

import { Button } from "~/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export const HelpChatButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleJoinClick = () => {
    window.open("https://chat.whatsapp.com/DqHtEAQM9K6BbBDz8TU1eP", "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="group">
        <Button
          variant="outline"
          size="icon"
          onClick={handleJoinClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="h-12 w-12 rounded-xl border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm hover:shadow-md hover:bg-slate-900/10 transition-all duration-200"
        >
          <MessageCircle className="h-5 w-5 text-slate-600" />
        </Button>
        <div
          className={`absolute right-0 bottom-full mb-2 px-3 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/40 rounded-lg shadow-sm text-sm text-slate-600 whitespace-nowrap transition-all duration-200 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
          }`}
        >
          Need help? Join community
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border/40"></div>
        </div>
      </div>
    </div>
  );
}; 