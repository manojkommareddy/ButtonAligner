import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface BrandBarProps {
  className?: string;
}

export default function BrandBar({ className = "" }: BrandBarProps) {
  const { toggleTheme } = useTheme();

  return (
    <div className={`flex items-center justify-between p-4 bg-primary text-primary-foreground border-b border-border sticky top-0 z-50 shadow-md ${className}`}>
      <div className="font-bold text-lg" data-testid="brand-title">
        Aviation Component Solutions
      </div>
      <Button 
        variant="outline"
        onClick={toggleTheme}
        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
        data-testid="button-theme-toggle"
      >
        Switch Theme
      </Button>
    </div>
  );
}