import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  showNav?: boolean;
}
export default function PageShell({ children, className = "", showNav = true }: PageShellProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-[#f7f7f5] ${className}`}>
      {showNav && <Navbar />}
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
