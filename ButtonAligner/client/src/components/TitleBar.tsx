interface TitleBarProps {
  className?: string;
}

export default function TitleBar({ className = "" }: TitleBarProps) {
  return (
    <div className={`flex items-center justify-center gap-4 p-3 bg-secondary text-secondary-foreground border-b border-border sticky top-16 z-40 shadow-sm ${className}`}>
      <div className="font-bold text-lg" data-testid="analyzer-title">
        ACS New Product Development Financial Analyzer
      </div>
      <div className="text-sm text-muted-foreground" data-testid="status-legend">
        [<span className="status-red font-semibold">Red Light</span> / 
         <span className="status-yellow font-semibold">Yellow Light</span> / 
         <span className="status-green font-semibold">Green Light</span>]
      </div>
    </div>
  );
}