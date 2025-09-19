import KPICard from '../KPICard';

export default function KPICardExample() {
  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      <KPICard 
        title="NPV" 
        value={15000} 
        helpText="Net Present Value after discounting all cash flows"
        status="pass"
      />
      <KPICard 
        title="IRR" 
        value="25.5%" 
        helpText="Internal Rate of Return over 5 years"
        status="pass"
      />
      <KPICard 
        title="Payback Period" 
        value="3.2 years" 
        helpText="Time to recover initial investment"
        status="fail"
      />
    </div>
  );
}