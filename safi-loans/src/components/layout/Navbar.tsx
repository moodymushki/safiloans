import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Calculator", to: "/calculator" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between gap-3 md:h-[58px]">
        <Link to="/" className="flex min-w-0 items-center">
          <img
            src="/safi-loans-logo.png"
            alt="Safi Loans"
            className="h-8 w-auto max-w-[140px] object-contain bg-transparent md:h-9 md:max-w-[160px]"
            style={{ mixBlendMode: "multiply" }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex h-9 min-w-[88px] items-center justify-center rounded-md px-3 text-[13px] font-medium transition-colors lg:px-4 ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Button asChild size="sm" className="h-8 px-3 text-xs lg:h-9 lg:text-sm">
            <Link to="/apply">Apply Now</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="p-1.5 text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-1">
              <Link to="/apply" onClick={() => setOpen(false)}>Apply Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
