import { formatCurrency, formatPercentage, FinancialInputs } from '@/lib/financial';

interface ReportViewProps {
  inputs: FinancialInputs;
  results: any;
  cashFlowData: any[];
  getStatusMessage: () => string;
}

export default function ReportView({ inputs, results, cashFlowData, getStatusMessage }: ReportViewProps) {
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <div className="report-container bg-white text-black p-8 max-w-none" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header/Title Page */}
      <div className="report-header text-center mb-4 pb-3 border-b-2 border-gray-300">
        <h1 className="text-2xl font-bold mb-2">ACS New Product Development</h1>
        <h2 className="text-xl mb-3">Financial Analysis Report</h2>
        
        {/* Project Information - Horizontal Format */}
        <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div>
              <strong className="text-blue-800">OEM PN:</strong> 
              <span className="ml-2 font-semibold">{inputs.oemPN || 'Not specified'}</span>
            </div>
            <div>
              <strong className="text-blue-800">Development Partner:</strong> 
              <span className="ml-2 font-semibold">{inputs.devPartner || 'Not specified'}</span>
            </div>
            <div>
              <strong className="text-blue-800">Sales Director:</strong> 
              <span className="ml-2 font-semibold">{inputs.salesDirector || 'Not specified'}</span>
            </div>
            <div>
              <strong className="text-blue-800">Report Date:</strong> 
              <span className="ml-2 font-semibold">{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary - Keep together */}
      <div className="report-section mb-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-200">Executive Summary</h2>
        <div className="mb-3">
          <p className="text-sm"><strong>Project Status:</strong> <span className={`font-bold ${results.status === 'GREEN' ? 'text-green-600' : results.status === 'YELLOW' ? 'text-yellow-600' : 'text-red-600'}`}>{results.status}</span></p>
          <p className="text-xs mt-1">{getStatusMessage()}</p>
          <p className="text-xs text-gray-600 mt-1">Criteria Passed: {results.passes}/3</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center p-2 border border-gray-200 rounded">
            <p className="text-xs font-medium text-gray-600">NPV (with TV if enabled)</p>
            <p className="text-sm font-bold">{formatCurrency(results.npvVal)}</p>
            <p className={`text-xs ${results.passNPV ? 'text-green-600' : 'text-red-600'}`}>
              Target: {formatCurrency(inputs.thrNPV)} ({results.passNPV ? 'PASS' : 'FAIL'})
            </p>
          </div>
          <div className="text-center p-2 border border-gray-200 rounded">
            <p className="text-xs font-medium text-gray-600">IRR (5y, no TV)</p>
            <p className="text-sm font-bold">{formatPercentage(results.irrVal)}</p>
            <p className={`text-xs ${results.passIRR ? 'text-green-600' : 'text-red-600'}`}>
              Target: {inputs.thrIRR}% ({results.passIRR ? 'PASS' : 'FAIL'})
            </p>
          </div>
          <div className="text-center p-2 border border-gray-200 rounded">
            <p className="text-xs font-medium text-gray-600">Payback Period</p>
            <p className="text-sm font-bold">{results.pbpVal === Infinity ? 'No payback' : `${results.pbpVal.toFixed(2)} years`}</p>
            <p className={`text-xs ${results.passPBP ? 'text-green-600' : 'text-red-600'}`}>
              Target: ≤{inputs.thrPBP} years ({results.passPBP ? 'PASS' : 'FAIL'})
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Notes Section - In the gap to make PDF 2 pages */}
      {inputs.notes && inputs.notes.trim() && (
        <div className="report-section mb-3" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <h2 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">Analysis Notes</h2>
          <div className="bg-gray-50 p-2 rounded border border-gray-300">
            <div className="bg-white p-2 rounded border-l-4 border-l-blue-500">
              <h3 className="text-sm font-semibold mb-1 text-blue-800">Project Analysis Notes:</h3>
              <pre className="whitespace-pre-wrap text-xs leading-tight">{inputs.notes}</pre>
            </div>
          </div>
        </div>
      )}

      {/* NRE Cost Breakdown Table - First on Page 1 */}
      <div className="report-section mb-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <h2 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">Non-Recurring Engineering (NRE) Cost Breakdown</h2>
        <table className="w-full border-collapse border border-gray-300 text-xs" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left font-bold">Component</th>
              <th className="border border-gray-300 p-2 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">OEM Parts Investment</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(results.oemInv)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Materials Inspection</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(inputs.matInspect)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Labor Cost</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(results.laborCost)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">PMA Application Fee</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(inputs.pmaFee)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">DER Fee</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(inputs.derFee)}</td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td className="border border-gray-300 p-2">Total NRE Cost</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(results.nre)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Page Break After Executive Summary */}
      <div style={{ pageBreakAfter: 'always', breakAfter: 'always', height: '1px' }}></div>

      {/* Revenue & Margin Analysis - Page 2 */}
      <div className="report-section mb-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <h2 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">Revenue & Margin Analysis</h2>
        <table className="w-full border-collapse border border-gray-300 text-xs" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left font-bold">Metric</th>
              <th className="border border-gray-300 p-2 text-right font-bold">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">PMA Part Sell Price</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(inputs.sp)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">PMA Part Cost</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(inputs.cp)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Unit Margin</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(results.unitMargin)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Est. Sales Qty (annual)</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{inputs.qty}</td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td className="border border-gray-300 p-2">Est. Annual Margin</td>
              <td className="border border-gray-300 p-2 text-right font-mono">{formatCurrency(results.estAnnualMargin)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Page Break After Financial Details */}
      <div style={{ pageBreakAfter: 'always', breakAfter: 'always', height: '1px' }}></div>

      {/* Cash Flow Analysis - Page 2 */}
      <div className="report-section mb-4 cash-flow-section" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <h2 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">Cash Flow Analysis</h2>
        <div className="table-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <table className="w-full border-collapse border border-gray-300 cash-flow-table text-xs" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <thead style={{ display: 'table-header-group' }}>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-center font-bold">Year</th>
                <th className="border border-gray-300 p-2 text-right font-bold">Cash Flow</th>
                <th className="border border-gray-300 p-2 text-left font-bold">Notes</th>
              </tr>
            </thead>
            <tbody style={{ display: 'table-row-group' }}>
              {cashFlowData.map((flow, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <td className="border border-gray-300 p-2 text-center font-medium">{flow.year}</td>
                  <td className="border border-gray-300 p-2 text-right font-mono font-semibold">
                    {formatCurrency(flow.cashFlow)}
                  </td>
                  <td className="border border-gray-300 p-2">{flow.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions & Parameters */}
      <div className="report-section mb-4">
        <h2 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">Key Assumptions & Parameters</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Ramp Rates</h3>
            <ul className="text-xs space-y-0.5">
              <li>Year 1: {inputs.rr1}%</li>
              <li>Year 2: {inputs.rr2}%</li>
              <li>Year 3: {inputs.rr3}%</li>
              <li>Year 4: {inputs.rr4}%</li>
              <li>Year 5: {inputs.rr5}%</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Terminal Value</h3>
            <ul className="text-xs space-y-0.5">
              <li>Multiple: {inputs.terminalMultiple}×</li>
              <li>Y5 Cash Flow: {formatCurrency(results.y5)}</li>
              <li>Terminal Value: {formatCurrency(results.tv)}</li>
              <li>Used in NPV: {inputs.useTV ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs"><strong>Discount Rate:</strong> {inputs.discount}% (WACC or required return)</p>
        </div>
      </div>


      {/* Footer */}
      <div className="report-footer text-center text-xs text-gray-500 mt-4 pt-2 border-t border-gray-300">
        <p>Generated by ACS Financial Analyzer on {currentDate}</p>
      </div>
    </div>
  );
}