import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  // const founders = [
  //   {
  //     name: "Juan Felipe Gaviria Campo",
  //     linkedin: "https://www.linkedin.com/in/juan-felipe-gaviria-campo/",
  //   },
  //   {
  //     name: "Tomas Calle",
  //     linkedin: "https://www.linkedin.com/in/tomas-calle/",
  //   },
  //   {
  //     name: "Cristian Camilo Correa",
  //     linkedin: "https://www.linkedin.com/in/cristiancamilocorrea/",
  //   },
  // ];

  return (
    <footer className="relative border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Gradient bars at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800"></div>
        <div className="flex-1 bg-gradient-to-r from-gray-800 to-gray-700"></div>
        <div className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600"></div>
        <div className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500"></div>
        <div className="flex-1 bg-gradient-to-r from-gray-500 to-gray-400"></div>
        <div className="flex-1 bg-gradient-to-r from-gray-400 to-gray-300"></div>
        <div className="flex-1 bg-gradient-to-r from-gray-300 to-gray-200"></div>
        <div className="flex-1 bg-gradient-to-r from-gray-200 to-gray-100"></div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-base font-medium">ACC.</h3>
            <p className="text-sm text-muted-foreground">
              Connecting talent with opportunities through skill-based hiring.
            </p>
          </div>

          {/* <div className="space-y-3">
            <h4 className="text-sm font-medium">Founders</h4>
            <div className="space-y-2">
              {founders.map((founder, index) => (
                <a
                  key={index}
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors block"
                >
                  {founder.name}
                </a>
              ))}
            </div>
          </div> */}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ACC. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://www.linkedin.com/company/letsacc"
              className="text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              {/* <Twitter className="w-5 h-5" /> */}
            </a>
            <a
              href="https://github.com/tomasCalletce/center"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
