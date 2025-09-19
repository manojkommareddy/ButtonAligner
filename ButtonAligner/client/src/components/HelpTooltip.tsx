import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HelpTooltipProps {
  content: string;
  className?: string;
}

export default function HelpTooltip({ content, className = "" }: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-bold rounded-full border border-accent text-accent cursor-help hover-elevate ${className}`}
          data-testid="help-tooltip-trigger"
        >
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm text-sm" data-testid="help-tooltip-content">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}