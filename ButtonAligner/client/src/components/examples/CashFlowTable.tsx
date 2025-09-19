import CashFlowTable from '../CashFlowTable';

export default function CashFlowTableExample() {
  const sampleFlows = [
    { year: '0', cashFlow: -20315, notes: 'Initial NRE (outflow)' },
    { year: '1', cashFlow: 3450, notes: 'Y1 = EstMargin × RR1' },
    { year: '2', cashFlow: 5250, notes: 'Y2 = EstMargin × RR2' },
    { year: '3', cashFlow: 7950, notes: 'Y3 = EstMargin × RR3' },
    { year: '4', cashFlow: 8250, notes: 'Y4 = EstMargin × RR4' },
    { year: '5', cashFlow: 8250, notes: 'Y5 = EstMargin × RR5' },
    { year: '5 (TV)', cashFlow: 57750, notes: 'Terminal Value' }
  ];

  return (
    <div className="p-4 max-w-2xl">
      <CashFlowTable flows={sampleFlows} />
    </div>
  );
}