import { cn } from '@/lib/utils';

interface StatusLightProps {
  status: 'GREEN' | 'YELLOW' | 'RED' | 'IDLE';
  className?: string;
}

export default function StatusLight({ status, className = "" }: StatusLightProps) {
  const getStatusClasses = () => {
    switch (status) {
      case 'GREEN':
        return 'bg-status-green border-status-green';
      case 'YELLOW':
        return 'bg-status-yellow border-status-yellow';
      case 'RED':
        return 'bg-status-red border-status-red';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div 
      className={cn(
        "w-6 h-6 rounded-full border-2 transition-colors duration-200",
        getStatusClasses(),
        className
      )}
      data-testid={`status-light-${status.toLowerCase()}`}
    />
  );
}