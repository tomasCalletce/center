import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-base font-medium">ACC.</h3>
            <p className="text-sm text-muted-foreground">
              Connecting talent with opportunities through skill based hiring.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ACC. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
