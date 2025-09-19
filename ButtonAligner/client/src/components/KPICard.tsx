import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import HelpTooltip from './HelpTooltip';

interface KPICardProps {
  title: string;
  value: string | number;
  helpText?: string;
  status?: 'pass' | 'fail' | 'neutral';
  className?: string;
}

export default function KPICard({ title, value, helpText, status = 'neutral', className = "" }: KPICardProps) {
  const displayValue = typeof value === 'number' && isFinite(value) 
    ? value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
    : value;

  const statusClasses = {
    pass: 'kpi-pass',
    fail: 'kpi-fail', 
    neutral: ''
  };

  return (
    <Card 
      className={cn(
        "p-3 flex flex-col justify-between min-h-[60px] text-center flex-1 min-w-0",
        statusClasses[status],
        className
      )}
      data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm text-muted-foreground font-medium leading-tight">
          {title}
        </span>
        {helpText && <HelpTooltip content={helpText} className="w-3.5 h-3.5 text-[10px]" />}
      </div>
      <div className="font-mono text-base font-medium leading-tight" data-testid={`kpi-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {displayValue}
      </div>
    </Card>
  );
}