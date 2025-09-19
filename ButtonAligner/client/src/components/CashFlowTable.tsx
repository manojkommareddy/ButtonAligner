import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface CashFlowRow {
  year: string;
  cashFlow: number;
  notes: string;
}

interface CashFlowTableProps {
  flows: CashFlowRow[];
  className?: string;
}

export default function CashFlowTable({ flows, className = "" }: CashFlowTableProps) {
  const formatMoney = (value: number) => 
    isFinite(value) 
      ? value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      : "—";

  // Calculate cumulative cash flows and find breakeven year
  let cumulative = 0;
  let breakevenIndex = -1;
  
  const flowsWithCumulative = flows.map((flow, index) => {
    // Don't include TV row in breakeven calculation
    const isTVRow = flow.year.includes('TV');
    
    if (!isTVRow) {
      cumulative += flow.cashFlow;
      
      // Check if this is the breakeven year (first time cumulative goes positive)
      if (breakevenIndex === -1 && cumulative >= 0 && index > 0) {
        breakevenIndex = index;
      }
    }
    
    return { ...flow, cumulative, isBreakeven: index === breakevenIndex && !isTVRow };
  });

  return (
    <Card className={`${className} p-0 w-full`}>
      <div className="w-full overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left text-xs py-2" style={{width: "10%"}}>Year</TableHead>
              <TableHead className="text-right text-xs py-2" style={{width: "20%"}}>Cash Flow</TableHead>
              <TableHead className="text-left text-xs py-2" style={{width: "70%"}}>Notes</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {flowsWithCumulative.map((flow, index) => (
            <TableRow 
              key={index} 
              data-testid={`cashflow-row-${index}`}
              className={flow.isBreakeven ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}
            >
              <TableCell className={`font-medium text-xs py-1 whitespace-nowrap ${flow.isBreakeven ? "text-green-700 dark:text-green-300" : ""}`}>
                {flow.year}
              </TableCell>
              <TableCell className={`text-right font-mono text-xs py-1 ${flow.isBreakeven ? "text-green-700 dark:text-green-300" : ""}`} data-testid={`cashflow-value-${index}`}>
                {formatMoney(flow.cashFlow)}
              </TableCell>
              <TableCell className={`text-xs py-1 ${flow.isBreakeven ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                {flow.notes}
                {flow.isBreakeven && " (Breakeven)"}
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}