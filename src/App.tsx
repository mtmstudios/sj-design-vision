import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PlaceholderPage from "@/components/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leistungen" element={<PlaceholderPage title="Unsere Leistungen" description="Alle Leistungsbereiche von SJ Design im Detail." />} />
          <Route path="/ueber-uns" element={<PlaceholderPage title="Über uns" description="Lernen Sie SJ Design und unser Team kennen." />} />
          <Route path="/referenzen" element={<PlaceholderPage title="Referenzen" description="Ausgewählte Projekte und zufriedene Kunden." />} />
          <Route path="/blog" element={<PlaceholderPage title="Blog" description="Neuigkeiten und Einblicke von SJ Design." />} />
          <Route path="/karriere" element={<PlaceholderPage title="Karriere" description="Werden Sie Teil unseres Teams in Deizisau." />} />
          <Route path="/kontakt" element={<PlaceholderPage title="Kontakt" description="Nehmen Sie Kontakt mit uns auf." />} />
          <Route path="/impressum" element={<PlaceholderPage title="Impressum" description="Angaben gemäß § 5 TMG." />} />
          <Route path="/datenschutz" element={<PlaceholderPage title="Datenschutzerklärung" description="Informationen zum Datenschutz gemäß DSGVO." />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
