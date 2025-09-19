import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BrandBar from './BrandBar';
import TitleBar from './TitleBar';
import StatusLight from './StatusLight';
import KPICard from './KPICard';
import InputField from './InputField';
import CashFlowTable from './CashFlowTable';
import HelpTooltip from './HelpTooltip';
import ReportView from './ReportView';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  FinancialInputs, 
  calculateFinancials, 
  formatCurrency, 
  formatPercentage, 
  defaultFinancialInputs 
} from '@/lib/financial';

export default function FinancialAnalyzer() {
  const [inputs, setInputs] = useState<FinancialInputs>(defaultFinancialInputs);
  
  // Calculate results whenever inputs change
  const results = calculateFinancials(inputs);
  
  // Update a specific input field
  const updateInput = useCallback((field: keyof FinancialInputs, value: string | number | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    console.log(`${field} updated to:`, value);
  }, []);
  
  // Reset to defaults
  const handleReset = () => {
    setInputs(defaultFinancialInputs);
    console.log('Reset to default values');
  };
  
  // Helper functions
  const getStatusMessage = () => {
    if (results.status === 'GREEN') {
      return 'All criteria passed - Proceed with development';
    } else if (results.status === 'YELLOW') {
      return '2/3 criteria passed - Review marginal metrics';
    } else {
      return 'Insufficient performance - Consider alternatives';
    }
  };

  // Export comprehensive CSV functionality
  const handleExportCSV = () => {
    const currentDate = new Date().toLocaleDateString();
    const csvData = [];
    
    // Header with title and date
    csvData.push(['ACS New Product Development Financial Analyzer']);
    csvData.push(['Export Date', currentDate]);
    csvData.push(['', '']);
    
    // Project Metadata Section
    csvData.push(['PROJECT METADATA', '', '']);
    csvData.push(['Field', 'Value', '']);
    csvData.push(['OEM PN', inputs.oemPN || 'Not specified', '']);
    csvData.push(['Development Partner', inputs.devPartner || 'Not specified', '']);
    csvData.push(['Sales Director', inputs.salesDirector || 'Not specified', '']);
    csvData.push(['', '', '']);
    
    // Cost Breakdown Inputs Section
    csvData.push(['COST BREAKDOWN INPUTS (NRE)', '', '']);
    csvData.push(['Parameter', 'Value', 'Calculated Result']);
    csvData.push(['OEM Parts Cost (per unit)', `$${inputs.oemCost.toLocaleString()}`, '']);
    csvData.push(['OEM Parts Qty', inputs.oemQty, '']);
    csvData.push(['OEM Parts Investment', '', formatCurrency(results.oemInv)]);
    csvData.push(['Materials Inspection', `$${inputs.matInspect.toLocaleString()}`, '']);
    csvData.push(['In-house Labor Hours', inputs.laborHours, '']);
    csvData.push(['Labor Rate ($/hr)', `$${inputs.laborRate.toLocaleString()}`, '']);
    csvData.push(['Labor Cost Total', '', formatCurrency(results.laborCost)]);
    csvData.push(['PMA Application Fee', `$${inputs.pmaFee.toLocaleString()}`, '']);
    csvData.push(['DER Fee', `$${inputs.derFee.toLocaleString()}`, '']);
    csvData.push(['TOTAL NRE COST', '', formatCurrency(results.nre)]);
    csvData.push(['', '', '']);
    
    // Revenue & Margin Section
    csvData.push(['REVENUE & MARGIN INPUTS', '', '']);
    csvData.push(['Parameter', 'Value', 'Calculated Result']);
    csvData.push(['PMA Part SP (sell price)', `$${inputs.sp.toLocaleString()}`, '']);
    csvData.push(['PMA Part CP (cost)', `$${inputs.cp.toLocaleString()}`, '']);
    csvData.push(['Unit Margin', '', formatCurrency(results.unitMargin)]);
    csvData.push(['Est Sales Qty (annual)', inputs.qty, '']);
    csvData.push(['Est Annual Sales', '', formatCurrency(results.estAnnualSales)]);
    csvData.push(['Est Annual Margin Dollars', '', formatCurrency(results.estAnnualMargin)]);
    csvData.push(['', '', '']);
    
    // Ramp & Terminal Section
    csvData.push(['RAMP & TERMINAL INPUTS', '', '']);
    csvData.push(['Parameter', 'Value', 'Notes']);
    csvData.push(['RR Y1 (%)', `${inputs.rr1}%`, 'Ramp Rate Year 1']);
    csvData.push(['RR Y2 (%)', `${inputs.rr2}%`, 'Ramp Rate Year 2']);
    csvData.push(['RR Y3 (%)', `${inputs.rr3}%`, 'Ramp Rate Year 3']);
    csvData.push(['RR Y4 (%)', `${inputs.rr4}%`, 'Ramp Rate Year 4']);
    csvData.push(['RR Y5 (%)', `${inputs.rr5}%`, 'Ramp Rate Year 5']);
    csvData.push(['Y5 Cash Flow', '', formatCurrency(results.y5)]);
    csvData.push(['Terminal Multiple × Y5 CF', inputs.terminalMultiple, '']);
    csvData.push(['Terminal Value', '', formatCurrency(results.tv)]);
    csvData.push(['Use Terminal Value in NPV', inputs.useTV ? 'Yes' : 'No', '']);
    csvData.push(['Discount Rate (%)', `${inputs.discount}%`, 'WACC or required return']);
    csvData.push(['', '', '']);
    
    // Pass/Fail Criteria & Results
    csvData.push(['ANALYSIS RESULTS', '', '']);
    csvData.push(['Metric', 'Result', 'Threshold', 'Status']);
    csvData.push(['NPV (with TV if enabled)', formatCurrency(results.npvVal), formatCurrency(inputs.thrNPV), results.passNPV ? 'PASS' : 'FAIL']);
    csvData.push(['IRR (5y, no TV)', formatPercentage(results.irrVal), `${inputs.thrIRR}%`, results.passIRR ? 'PASS' : 'FAIL']);
    csvData.push(['Payback Period', results.pbpVal === Infinity ? 'No payback' : `${results.pbpVal.toFixed(2)} years`, `${inputs.thrPBP} years`, results.passPBP ? 'PASS' : 'FAIL']);
    csvData.push(['', '', '', '']);
    csvData.push(['Overall Status', results.status, `${results.passes}/3 criteria passed`, getStatusMessage()]);
    csvData.push(['', '', '', '']);
    
    // Cash Flow Analysis Table
    csvData.push(['CASH FLOW ANALYSIS', '', '', '']);
    csvData.push(['Year', 'Cash Flow', 'Calculation Notes', 'Cumulative']);
    let cumulative = 0;
    csvData.push(['0', formatCurrency(-results.nre), 'Initial NRE (outflow)', formatCurrency(cumulative - results.nre)]);
    cumulative += -results.nre;
    
    for (let i = 1; i <= 5; i++) {
      cumulative += results.flows[i];
      csvData.push([i.toString(), formatCurrency(results.flows[i]), `Y${i} = EstMargin × RR${i}`, formatCurrency(cumulative)]);
    }
    
    if (inputs.useTV) {
      csvData.push(['5 (TV)', formatCurrency(results.tv), 'Terminal Value', formatCurrency(cumulative + results.tv)]);
    }
    
    csvData.push(['', '', '', '']);
    
    // Notes Section
    if (inputs.notes && inputs.notes.trim()) {
      csvData.push(['ANALYSIS NOTES', '', '', '']);
      csvData.push([inputs.notes, '', '', '']);
    }
    
    // Convert to CSV string with proper line breaks
    const csv = csvData.map(row => 
      row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acs_financial_analyzer_complete_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Comprehensive CSV export completed');
  };

  // Export professional PDF report functionality
  const handleExportPDF = async () => {
    try {
      console.log('Starting PDF export...');
      
      // Create a temporary container for the report
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.backgroundColor = 'white';
      document.body.appendChild(tempContainer);

      // Generate cash flow data for the report
      const cashFlowData = [
        { year: '0', cashFlow: -results.nre, notes: 'Initial NRE (outflow)' },
        { year: '1', cashFlow: results.flows[1], notes: 'Y1 = EstMargin × RR1' },
        { year: '2', cashFlow: results.flows[2], notes: 'Y2 = EstMargin × RR2' },
        { year: '3', cashFlow: results.flows[3], notes: 'Y3 = EstMargin × RR3' },
        { year: '4', cashFlow: results.flows[4], notes: 'Y4 = EstMargin × RR4' },
        { year: '5', cashFlow: results.flows[5], notes: 'Y5 = EstMargin × RR5' },
        // Add explicit Terminal Value row if enabled for transparency
        ...(inputs.useTV ? [{ year: '5 (TV)', cashFlow: results.tv, notes: 'Terminal Value (Y5 × Multiple)' }] : [])
      ];

      let root: any = null;
      
      try {
        // Create React root and render the ReportView
        root = createRoot(tempContainer);
        
        // Render the report and wait for it to complete deterministically
        await new Promise<void>((resolve) => {
          root.render(
            <ReportView 
              inputs={inputs}
              results={results}
              cashFlowData={cashFlowData}
              getStatusMessage={getStatusMessage}
            />
          );
          
          // Wait for two animation frames to ensure rendering is complete
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // Also wait for fonts to be ready
              if (document.fonts) {
                document.fonts.ready.then(() => resolve());
              } else {
                resolve();
              }
            });
          });
        });

        // Per-page rendering approach to prevent table splitting
        const pageElements = tempContainer.querySelectorAll('.report-section, .report-header, .report-footer');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10; // 10mm margins
        const contentWidth = 190; // 210mm - 20mm margins
        const contentHeight = 277; // 297mm - 20mm margins
        let firstPage = true;
        
        // Group elements into logical pages
        const pages = [];
        let currentPage = [];
        let currentPageHeight = 0;
        
        for (const element of pageElements) {
          const elementHeight = element.scrollHeight;
          
          // Always include header on first page
          if (element.classList.contains('report-header')) {
            currentPage.push(element);
            currentPageHeight += elementHeight;
            continue;
          }
          
          // Check if element fits on current page
          if (currentPageHeight + elementHeight > (contentHeight * 3.78)) { // Convert mm to pixels
            // Start new page
            if (currentPage.length > 0) {
              pages.push([...currentPage]);
              currentPage = [];
              currentPageHeight = 0;
            }
          }
          
          currentPage.push(element);
          currentPageHeight += elementHeight;
        }
        
        // Add last page
        if (currentPage.length > 0) {
          pages.push(currentPage);
        }
        
        // Render each page separately
        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
          const pageElements = pages[pageIndex];
          
          // Create temporary container for this page
          const pageContainer = document.createElement('div');
          pageContainer.style.cssText = `
            position: absolute;
            left: -9999px;
            top: 0;
            width: 794px;
            background: white;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
          `;
          
          // Clone elements for this page
          pageElements.forEach(element => {
            const clone = element.cloneNode(true);
            pageContainer.appendChild(clone);
          });
          
          document.body.appendChild(pageContainer);
          
          try {
            // Capture this page
            const pageCanvas = await html2canvas(pageContainer, {
              scale: 1.5,
              useCORS: true,
              allowTaint: false,
              backgroundColor: '#ffffff',
              width: 794,
              height: pageContainer.scrollHeight,
              scrollX: 0,
              scrollY: 0,
              logging: false,
              removeContainer: false
            });
            
            // Calculate dimensions for this page
            const displayHeight = (pageCanvas.height * contentWidth) / pageCanvas.width;
            
            // Add page to PDF
            if (!firstPage) {
              pdf.addPage();
            }
            
            pdf.addImage(
              pageCanvas.toDataURL('image/png'),
              'PNG',
              margin,
              margin,
              contentWidth,
              Math.min(displayHeight, contentHeight)
            );
            
            firstPage = false;
            
          } finally {
            // Clean up
            document.body.removeChild(pageContainer);
          }
        }

        // Generate filename with current date
        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `acs_financial_analyzer_report_${currentDate}.pdf`;
        
        // Download the PDF
        pdf.save(filename);
        
        console.log('PDF export completed:', filename);
      } finally {
        // Ensure proper cleanup of resources
        if (root) {
          root.unmount();
        }
        if (tempContainer && tempContainer.parentNode) {
          document.body.removeChild(tempContainer);
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };
  
  // Generate cash flow table data
  const cashFlowData = [
    { year: '0', cashFlow: -results.nre, notes: 'Initial NRE (outflow)' },
    { year: '1', cashFlow: results.flows[1], notes: 'Y1 = EstMargin × RR1' },
    { year: '2', cashFlow: results.flows[2], notes: 'Y2 = EstMargin × RR2' },
    { year: '3', cashFlow: results.flows[3], notes: 'Y3 = EstMargin × RR3' },
    { year: '4', cashFlow: results.flows[4], notes: 'Y4 = EstMargin × RR4' },
    { year: '5', cashFlow: results.flows[5], notes: 'Y5 = EstMargin × RR5' }
  ];
  
  if (inputs.useTV) {
    cashFlowData.push({ year: '5 (TV)', cashFlow: results.tv, notes: 'Terminal Value' });
  }
  
  const getCriteriaStatus = () => {
    const status = [];
    status.push(`NPV: ${results.passNPV ? '✓' : '✗'} ${formatCurrency(results.npvVal)} vs ${formatCurrency(inputs.thrNPV)}`);
    status.push(`IRR: ${results.passIRR ? '✓' : '✗'} ${formatPercentage(results.irrVal)} vs ${inputs.thrIRR}%`);
    status.push(`PBP: ${results.passPBP ? '✓' : '✗'} ${results.pbpVal === Infinity ? 'No payback' : results.pbpVal.toFixed(2) + ' years'} vs ${inputs.thrPBP} years`);
    return status.join(' | ');
  };

  return (
    <div className="min-h-screen bg-background">
      <BrandBar />
      <TitleBar />
      
      <div className="p-4 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" data-testid="page-title">Project Inputs & Criteria</h1>
          <p className="text-muted-foreground text-sm">Edit parameters; results update instantly.</p>
        </div>
        
        {/* Project Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <InputField
            label="OEM PN"
            value={inputs.oemPN || ''}
            onChange={(value) => updateInput('oemPN', value)}
            placeholder="e.g., 123-4567-8"
          />
          <InputField
            label="Development Partner"
            value={inputs.devPartner || ''}
            onChange={(value) => updateInput('devPartner', value)}
            placeholder="Company"
          />
          <InputField
            label="Sales Director"
            value={inputs.salesDirector || ''}
            onChange={(value) => updateInput('salesDirector', value)}
            placeholder="Full name"
          />
        </div>
        
        {/* Main Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          
          {/* Cost Breakdowns Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                Cost Breakdowns (NRE)
                <HelpTooltip content="All one-time development costs (Non-Recurring Engineering)" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InputField
                label="OEM Parts Cost (per unit)"
                value={inputs.oemCost}
                onChange={(value) => updateInput('oemCost', value)}
                type="number"
                step="0.01"
                helpText="Cost to purchase one OEM unit for teardown/testing"
              />
              <InputField
                label="OEM Parts Qty"
                value={inputs.oemQty}
                onChange={(value) => updateInput('oemQty', value)}
                type="number"
                step="1"
                helpText="Number of OEM units to buy for development/validation"
              />
              <InputField
                label="Materials Inspection"
                value={inputs.matInspect}
                onChange={(value) => updateInput('matInspect', value)}
                type="number"
                step="0.01"
                helpText="One-time cost for inspecting raw materials/components"
              />
              <InputField
                label="In-house Labor Hours"
                value={inputs.laborHours}
                onChange={(value) => updateInput('laborHours', value)}
                type="number"
                step="1"
                helpText="Engineering/technician hours required for development"
              />
              <InputField
                label="Labor Rate ($/hr)"
                value={inputs.laborRate}
                onChange={(value) => updateInput('laborRate', value)}
                type="number"
                step="0.01"
                helpText="Hourly cost of in-house labor"
              />
              <InputField
                label="PMA Application Fee"
                value={inputs.pmaFee}
                onChange={(value) => updateInput('pmaFee', value)}
                type="number"
                step="0.01"
                helpText="FAA PMA filing and related fees"
              />
              <InputField
                label="DER"
                value={inputs.derFee}
                onChange={(value) => updateInput('derFee', value)}
                type="number"
                step="0.01"
                helpText="Designated Engineering Representative fees (if applicable)"
              />
              
              <div className="border-t pt-3 mt-4">
                <div className="grid grid-cols-3 gap-1">
                  <KPICard
                    title="OEM Parts Investment"
                    value={results.oemInv}
                    helpText="OEM Cost × Qty"
                  />
                  <KPICard
                    title="Labor Cost"
                    value={results.laborCost}
                    helpText="Labor Hours × Labor Rate"
                  />
                  <KPICard
                    title="Total NRE Cost"
                    value={results.nre}
                    helpText="OEM Investment + Materials Inspection + Labor Cost + PMA + DER"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Revenue & Margin Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                Estimated Revenue & Margin
                <HelpTooltip content="Per-unit price/cost and expected annual volume" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InputField
                label="PMA Part SP (sell price)"
                value={inputs.sp}
                onChange={(value) => updateInput('sp', value)}
                type="number"
                step="0.01"
                helpText="Expected selling price per PMA unit"
              />
              <InputField
                label="PMA Part CP (cost)"
                value={inputs.cp}
                onChange={(value) => updateInput('cp', value)}
                type="number"
                step="0.01"
                helpText="Expected production cost per PMA unit"
              />
              <InputField
                label="Est Sales Qty (annual)"
                value={inputs.qty}
                onChange={(value) => updateInput('qty', value)}
                type="number"
                step="1"
                helpText="Expected number of PMA units sold per year"
              />
              
              <div className="border-t pt-3 mt-4">
                <div className="grid grid-cols-3 gap-1">
                  <KPICard
                    title="Est Annual Sales"
                    value={results.estAnnualSales}
                    helpText="Sell Price × Annual Qty (revenue)"
                  />
                  <KPICard
                    title="Unit Margin"
                    value={results.unitMargin}
                    helpText="Sell Price − Cost per unit"
                  />
                  <KPICard
                    title="Est Annual Margin Dollars"
                    value={results.estAnnualMargin}
                    helpText="Unit Margin × Annual Qty"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Ramp & Terminal Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                Ramp & Terminal
                <HelpTooltip content="Ramp % determines share of steady-state annual margin realized each year; terminal value captures value beyond Year 5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InputField
                label="RR Y1 (%)"
                value={inputs.rr1}
                onChange={(value) => updateInput('rr1', value)}
                type="number"
                step="0.1"
                helpText="Ramp Rate Year 1"
              />
              <InputField
                label="RR Y2 (%)"
                value={inputs.rr2}
                onChange={(value) => updateInput('rr2', value)}
                type="number"
                step="0.1"
                helpText="Ramp Rate Year 2"
              />
              <InputField
                label="RR Y3 (%)"
                value={inputs.rr3}
                onChange={(value) => updateInput('rr3', value)}
                type="number"
                step="0.1"
                helpText="Ramp Rate Year 3"
              />
              <InputField
                label="RR Y4 (%)"
                value={inputs.rr4}
                onChange={(value) => updateInput('rr4', value)}
                type="number"
                step="0.1"
                helpText="Ramp Rate Year 4"
              />
              <InputField
                label="RR Y5 (%)"
                value={inputs.rr5}
                onChange={(value) => updateInput('rr5', value)}
                type="number"
                step="0.1"
                helpText="Ramp Rate Year 5"
              />
              <InputField
                label="Terminal Multiple × Y5 CF"
                value={inputs.terminalMultiple}
                onChange={(value) => updateInput('terminalMultiple', value)}
                type="number"
                step="0.1"
                helpText="Terminal Value = Year 5 Cash Flow × Multiple"
              />
              <InputField
                label="Use Terminal Value in NPV?"
                value={inputs.useTV}
                onChange={(value) => updateInput('useTV', value)}
                type="checkbox"
                helpText="If checked, NPV includes discounted Terminal Value"
              />
              <InputField
                label="Discount Rate (%)"
                value={inputs.discount}
                onChange={(value) => updateInput('discount', value)}
                type="number"
                step="0.1"
                helpText="Rate used to discount future cash flows (e.g., WACC)"
              />
              
              <div className="border-t pt-3 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <KPICard
                    title="Y5 Cash Flow"
                    value={results.y5}
                    helpText="Year 5 cash flow = Est Annual Margin × RR5"
                  />
                  <KPICard
                    title="Terminal Value"
                    value={results.tv}
                    helpText="Undiscounted terminal value; discounted amount is included in NPV only when enabled"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Outputs Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                Outputs
                <HelpTooltip content="Status: GREEN = all 3 pass; YELLOW = 2/3; RED = 0–1 pass" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 mb-6">
                <StatusLight status={results.status} />
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1" data-testid="status-message">
                    {getStatusMessage()}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Rule: Green if all 3 pass; Yellow if 2/3; otherwise Red.
                    <HelpTooltip content="We test 3 criteria: NPV ≥ threshold, IRR ≥ threshold, Payback ≤ threshold. Thresholds are set in the Criteria panel." />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {getCriteriaStatus()}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                <KPICard
                  title="NPV (uses TV if checked)"
                  value={results.npvVal}
                  helpText="Sum of discounted cash flows; includes discounted TV only if 'Use TV' is checked"
                  status={results.passNPV ? 'pass' : 'fail'}
                />
                <KPICard
                  title="IRR (5y, no TV)"
                  value={formatPercentage(results.irrVal)}
                  helpText="IRR from years 0–5 cash flows only (excludes TV)"
                  status={results.passIRR ? 'pass' : 'fail'}
                />
                <KPICard
                  title="Payback Period"
                  value={results.pbpVal === Infinity ? 'No payback' : `${results.pbpVal.toFixed(2)} years`}
                  helpText="Years until cumulative cash flows cover initial NRE"
                  status={results.passPBP ? 'pass' : 'fail'}
                />
              </div>
              
              <CashFlowTable flows={cashFlowData} />
            </CardContent>
          </Card>
          
          {/* Criteria & Notes Section */}
          <div className="flex flex-col h-full">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  Criteria (editable)
                  <HelpTooltip content="Set pass/fail thresholds for NPV, IRR, and Payback" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InputField
                  label="NPV must be ≥"
                  value={inputs.thrNPV}
                  onChange={(value) => updateInput('thrNPV', value)}
                  type="number"
                  step="0.01"
                  helpText="Minimum acceptable Net Present Value after discounting (with TV if enabled)"
                />
                <InputField
                  label="IRR must be ≥ (%)"
                  value={inputs.thrIRR}
                  onChange={(value) => updateInput('thrIRR', value)}
                  type="number"
                  step="0.1"
                  helpText="Minimum acceptable IRR based on 5-year cash flows (no TV)"
                />
                <InputField
                  label="PBP must be ≤ (years)"
                  value={inputs.thrPBP}
                  onChange={(value) => updateInput('thrPBP', value)}
                  type="number"
                  step="0.1"
                  helpText="Maximum acceptable payback period in years"
                />
              </CardContent>
            </Card>
            
            <Card className="flex-1 mt-6 flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  Notes
                  <HelpTooltip content="Any comments, assumptions, supplier info, or approvals." />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <InputField
                  label=""
                  value={inputs.notes || ''}
                  onChange={(value) => updateInput('notes', value)}
                  type="textarea"
                  placeholder="Add notes for this analysis..."
                  className="flex-1"
                />
                
                <div className="border-t pt-3 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      data-testid="button-reset"
                    >
                      Reset defaults
                    </Button>
                    <Button 
                      onClick={handleExportCSV}
                      variant="outline"
                      size="sm"
                      data-testid="button-export-csv"
                    >
                      Export CSV
                    </Button>
                    <Button 
                      onClick={handleExportPDF}
                      variant="outline"
                      size="sm"
                      data-testid="button-export-pdf"
                    >
                      Export PDF
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Saved locally in your browser.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}