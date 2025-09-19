// Aviation Financial Analysis Calculations
export interface FinancialInputs {
  // Project metadata
  oemPN?: string;
  devPartner?: string;
  salesDirector?: string;
  
  // Cost breakdowns (NRE)
  oemCost: number;
  oemQty: number;
  matInspect: number;
  laborHours: number;
  laborRate: number;
  pmaFee: number;
  derFee: number;
  
  // Revenue & margin
  sp: number; // sell price
  cp: number; // cost price
  qty: number; // annual quantity
  
  // Ramp & terminal
  rr1: number; // ramp rate year 1
  rr2: number;
  rr3: number;
  rr4: number;
  rr5: number;
  terminalMultiple: number;
  useTV: boolean; // use terminal value
  discount: number; // discount rate %
  
  // Criteria thresholds
  thrNPV: number;
  thrIRR: number;
  thrPBP: number;
  
  notes?: string;
}

export interface CalculationResults {
  // Intermediate calculations
  oemInv: number;
  laborCost: number;
  nre: number;
  estAnnualSales: number;
  unitMargin: number;
  estAnnualMargin: number;
  
  // Cash flows
  flows: number[];
  y5: number; // year 5 cash flow
  tv: number; // terminal value
  
  // Final metrics
  npvVal: number;
  irrVal: number;
  pbpVal: number;
  
  // Pass/fail status
  passNPV: boolean;
  passIRR: boolean;
  passPBP: boolean;
  passes: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
}

export function calculateFinancials(inputs: FinancialInputs): CalculationResults {
  // Calculate intermediate values
  const oemInv = inputs.oemCost * inputs.oemQty;
  const laborCost = inputs.laborHours * inputs.laborRate;
  const nre = oemInv + inputs.matInspect + laborCost + inputs.pmaFee + inputs.derFee;
  
  const estAnnualSales = inputs.sp * inputs.qty;
  const unitMargin = inputs.sp - inputs.cp;
  const estAnnualMargin = unitMargin * inputs.qty;
  
  // Calculate cash flows
  const rampRates = [inputs.rr1, inputs.rr2, inputs.rr3, inputs.rr4, inputs.rr5].map(x => x / 100);
  const flows = [-nre]; // Year 0 is negative NRE
  
  for (let i = 0; i < 5; i++) {
    flows.push(estAnnualMargin * (rampRates[i] || 0));
  }
  
  const y5 = flows[5];
  const tv = y5 * inputs.terminalMultiple;
  const discRate = inputs.discount / 100;
  
  // Calculate NPV
  const npvVal = calculateNPV(discRate, flows, inputs.useTV ? tv : NaN);
  
  // Calculate IRR (without terminal value)
  const irrVal = calculateIRR(flows);
  
  // Calculate payback period
  const pbpVal = calculatePayback(flows);
  
  // Determine pass/fail status
  const passNPV = npvVal >= inputs.thrNPV;
  const passIRR = isFinite(irrVal) && irrVal >= inputs.thrIRR / 100;
  const passPBP = isFinite(pbpVal) && pbpVal <= inputs.thrPBP;
  
  const passes = (passNPV ? 1 : 0) + (passIRR ? 1 : 0) + (passPBP ? 1 : 0);
  const status: 'GREEN' | 'YELLOW' | 'RED' = 
    passes === 3 ? 'GREEN' : (passes === 2 ? 'YELLOW' : 'RED');
  
  return {
    oemInv,
    laborCost,
    nre,
    estAnnualSales,
    unitMargin,
    estAnnualMargin,
    flows,
    y5,
    tv,
    npvVal,
    irrVal,
    pbpVal,
    passNPV,
    passIRR,
    passPBP,
    passes,
    status
  };
}

function calculateNPV(rate: number, flows: number[], terminalValue?: number): number {
  let npv = flows[0]; // Year 0
  
  for (let i = 1; i < flows.length; i++) {
    npv += flows[i] / Math.pow(1 + rate, i);
  }
  
  if (isFinite(terminalValue!)) {
    npv += terminalValue! / Math.pow(1 + rate, flows.length - 1);
  }
  
  return npv;
}

function calculateIRR(flows: number[]): number {
  const f = (rate: number) => {
    let npv = flows[0];
    for (let i = 1; i < flows.length; i++) {
      npv += flows[i] / Math.pow(1 + rate, i);
    }
    return npv;
  };
  
  let lo = -0.99;
  let hi = 10;
  let flo = f(lo);
  let fhi = f(hi);
  
  if (isNaN(flo) || isNaN(fhi)) return NaN;
  
  if (flo * fhi > 0) {
    hi = 100;
    fhi = f(hi);
    if (flo * fhi > 0) return NaN;
  }
  
  // Bisection method
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    
    if (Math.abs(fm) < 1e-6) return mid;
    
    if (flo * fm <= 0) {
      hi = mid;
      fhi = fm;
    } else {
      lo = mid;
      flo = fm;
    }
  }
  
  return (lo + hi) / 2;
}

function calculatePayback(flows: number[]): number {
  const initial = -flows[0];
  if (!(initial > 0)) return NaN;
  
  let cumulative = 0;
  for (let i = 1; i < flows.length; i++) {
    const cashFlow = flows[i];
    const prevCumulative = cumulative;
    cumulative += cashFlow;
    
    if (cumulative >= initial) {
      const needed = initial - prevCumulative;
      const fraction = cashFlow > 0 ? needed / cashFlow : 1;
      return (i - 1) + fraction;
    }
  }
  
  return Infinity;
}

export function formatCurrency(value: number): string {
  return isFinite(value) 
    ? value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
    : "—";
}

export function formatPercentage(value: number): string {
  return isFinite(value) ? (value * 100).toFixed(2) + "%" : "—";
}

// Default values for a new financial analysis
export const defaultFinancialInputs: FinancialInputs = {
  oemPN: '',
  devPartner: '',
  salesDirector: '',
  
  oemCost: 3715,
  oemQty: 3,
  matInspect: 1400,
  laborHours: 24,
  laborRate: 100,
  pmaFee: 8000,
  derFee: 0,
  
  sp: 1875,
  cp: 1125,
  qty: 30,
  
  rr1: 23,
  rr2: 35,
  rr3: 53,
  rr4: 55,
  rr5: 55,
  terminalMultiple: 7,
  useTV: true,
  discount: 10,
  
  thrNPV: 0,
  thrIRR: 20,
  thrPBP: 4.3,
  
  notes: ''
};