import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showKeyInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showKeyInput]);

  const handleKeySubmit = () => {
    if (secretKey === "codex") {
      setShowKeyInput(false);
      setSecretKey("");
      setError(false);
      navigate("/mgmt-panel");
    } else {
      setError(true);
      setSecretKey("");
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex rounded-md bg-white px-2 py-1 shadow-sm">
              <img
                src="/safi-loans-logo.png"
                alt="Safi Loans"
                className="h-11 w-auto max-w-[190px] object-contain"
              />
            </Link>
            <p className="text-sm opacity-70 leading-relaxed">
              Empowering Africans with fast, affordable loans. Trusted by thousands for transparent lending.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              {["Home", "Services", "Calculator", "About", "Contact"].map((l) => (
                <li key={l}>
                  <Link to={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="hover:opacity-100 transition-opacity">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Loan Products</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>Personal Loans</li>
              <li>Business Loans</li>
              <li>Emergency Loans</li>
              <li>Salary Advance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> +254 700 000 501
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> info@safiloans.co.ke
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />East Africa
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm opacity-50 flex items-center justify-center gap-2 flex-wrap">
          <span>© {new Date().getFullYear()} Safi Loans Limited. All rights reserved.</span>
          <span
            onClick={() => { setShowKeyInput(!showKeyInput); setError(false); setSecretKey(""); }}
            className="cursor-pointer opacity-30 hover:opacity-60 transition-opacity select-none"
          >
            @
          </span>
          {showKeyInput && (
            <div className="inline-flex items-center gap-1.5">
              <Input
                ref={inputRef}
                type="password"
                name="safi-admin-secret-key"
                value={secretKey}
                onChange={(e) => { setSecretKey(e.target.value); setError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleKeySubmit()}
                placeholder="Key"
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className={`h-7 w-24 text-xs bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 ${error ? "border-destructive" : ""}`}
              />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
