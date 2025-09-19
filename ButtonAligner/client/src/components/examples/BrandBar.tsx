import BrandBar from '../BrandBar';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function BrandBarExample() {
  return (
    <ThemeProvider>
      <BrandBar />
    </ThemeProvider>
  );
}