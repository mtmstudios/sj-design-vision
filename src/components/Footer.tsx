import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[hsl(0,0%,2%)] pt-16 pb-8 px-6">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Logo */}
        <div>
          <img src="/images/logo.png" alt="SJ Design" className="h-10 mb-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Full-Service Werbeagentur für Schilder, Fahrzeuge, Textilien und Webdesign in Deizisau bei Stuttgart.
          </p>
        </div>

        {/* Leistungen */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-4 tracking-wide">LEISTUNGEN</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/leistungen" className="hover:text-primary transition-colors">Werbetechnik</Link></li>
            <li><Link to="/leistungen" className="hover:text-primary transition-colors">Fahrzeugbeschriftung</Link></li>
            <li><Link to="/leistungen" className="hover:text-primary transition-colors">Textilien & Veredelung</Link></li>
            <li><Link to="/leistungen" className="hover:text-primary transition-colors">Design & Print</Link></li>
            <li><Link to="/leistungen" className="hover:text-primary transition-colors">Webdesign</Link></li>
          </ul>
        </div>

        {/* Unternehmen */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-4 tracking-wide">UNTERNEHMEN</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/ueber-uns" className="hover:text-primary transition-colors">Über uns</Link></li>
            <li><Link to="/referenzen" className="hover:text-primary transition-colors">Referenzen</Link></li>
            <li><Link to="/karriere" className="hover:text-primary transition-colors">Karriere</Link></li>
            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Kontakt */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-4 tracking-wide">KONTAKT</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Esslinger Straße 17</li>
            <li>73779 Deizisau</li>
            <li>info@sj-design.de</li>
            <li>+49 (0) 711 123456</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>© 2025 SJ Design. Alle Rechte vorbehalten.</span>
        <div className="flex gap-4">
          <Link to="/impressum" className="hover:text-primary transition-colors">Impressum</Link>
          <Link to="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
}
