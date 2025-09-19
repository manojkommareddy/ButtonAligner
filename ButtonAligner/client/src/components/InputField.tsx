import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import HelpTooltip from './HelpTooltip';

interface InputFieldProps {
  label: string;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  type?: 'text' | 'number' | 'textarea' | 'checkbox';
  placeholder?: string;
  helpText?: string;
  step?: string;
  className?: string;
}

export default function InputField({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  helpText, 
  step,
  className = ""
}: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (type === 'number') {
      const numValue = parseFloat(e.target.value);
      onChange(isFinite(numValue) ? numValue : 0);
    } else {
      onChange(e.target.value);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(checked);
    console.log(`${label} changed to:`, checked);
  };

  if (type === 'checkbox') {
    return (
      <div className={cn("flex items-center justify-between gap-2 py-1", className)}>
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground cursor-pointer">
            {label}
          </Label>
          {helpText && <HelpTooltip content={helpText} />}
        </div>
        <Checkbox 
          checked={value as boolean}
          onCheckedChange={handleCheckboxChange}
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={cn("space-y-2 h-full flex flex-col", className)}>
        {label && (
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">
              {label}
            </Label>
            {helpText && <HelpTooltip content={helpText} />}
          </div>
        )}
        <Textarea
          value={value as string}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn("min-h-[80px] resize-vertical bg-muted/80", className.includes('flex-1') && "flex-1 h-full")}
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-[1fr_200px] gap-2 items-center py-0.5", className)}>
      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground">
          {label}
        </Label>
        {helpText && <HelpTooltip content={helpText} />}
      </div>
      <Input
        type={type}
        value={typeof value === 'boolean' ? '' : value}
        onChange={handleChange}
        placeholder={placeholder}
        step={step}
        className={cn("text-base bg-muted/80", type === 'number' && "text-right")}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </div>
  );
}