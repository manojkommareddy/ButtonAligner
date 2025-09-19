# Design Guidelines: ACS Aviation Financial Analyzer

## Design Approach
**Selected Approach:** Design System (Utility-Focused)
**Justification:** This is a specialized financial analysis tool for aviation professionals requiring precision, data clarity, and efficient workflows. Function over form is paramount.
**Design System:** Custom system inspired by enterprise applications with aviation industry aesthetics

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light mode: 220 15% 25% (Deep blue-gray for headers/primary actions)
- Dark mode: 220 20% 85% (Light blue-gray for text/controls)

**Background Colors:**
- Light mode: 210 20% 98% (Clean white-blue)
- Dark mode: 220 25% 8% (Rich dark blue-black)

**Accent Colors:**
- Success/Positive: 142 76% 36% (Aviation green for profitable indicators)
- Warning/Caution: 45 93% 47% (Aviation amber for alerts)
- Critical/Negative: 0 84% 60% (Aviation red for losses/errors)

**Surface Colors:**
- Light cards: 210 20% 96%
- Dark cards: 220 20% 12%

### B. Typography
**Primary Font:** Inter (Google Fonts) - excellent for data-heavy interfaces
**Accent Font:** JetBrains Mono (Google Fonts) - for financial figures and calculations
**Hierarchy:**
- Headers: Inter Bold, larger sizes
- Body text: Inter Regular
- Financial data: JetBrains Mono (tabular numbers)
- Form labels: Inter Medium

### C. Layout System
**Tailwind Spacing Units:** Consistent use of 4, 6, 8, 12, and 16 units
- Component spacing: p-4, m-6
- Section spacing: py-8, px-6
- Card spacing: p-6
- Form spacing: gap-4, space-y-6

### D. Component Library

**Navigation:**
- Clean header with company branding
- Minimal navigation - focus on the analysis tool
- Theme toggle prominently placed

**Forms & Inputs:**
- Grouped input sections with clear labels
- Financial input fields with proper formatting (currency, percentages)
- Real-time validation and calculation feedback
- Status indicators using aviation-standard colors

**Data Display:**
- Card-based layout for different calculation sections
- Clear visual hierarchy for financial breakdowns
- Progress indicators for analysis completion
- Results displayed in easy-to-scan tables

**Interactive Elements:**
- Professional button styling with subtle shadows
- Form controls optimized for numerical input
- Hover states that don't interfere with data entry
- Clear visual feedback for calculation updates

**Status & Feedback:**
- Color-coded indicators for financial health
- Real-time calculation updates
- Clear error messaging for invalid inputs
- Success states for completed analyses

### E. Aviation Industry Aesthetics
- Professional, authoritative color scheme reflecting aerospace standards
- Clean, technical interface design
- Emphasis on precision and accuracy in all visual elements
- Subtle use of aviation-inspired blues and grays
- Focus on data clarity and professional presentation

### F. Responsive Design
- Desktop-first approach (primary use case)
- Tablet optimization for field use
- Mobile fallback with simplified interface
- Consistent spacing and typography across breakpoints

**Key Design Principles:**
1. **Clarity First:** All financial data must be immediately readable
2. **Professional Authority:** Interface reflects aerospace industry standards
3. **Calculation Transparency:** Users can see how numbers are derived
4. **Error Prevention:** Clear validation and guidance for inputs
5. **Efficiency:** Minimal clicks to complete analysis workflows