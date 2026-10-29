import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '@/context/LanguageContext';
import { BusinessProvider } from '@/context/BusinessContext';
import { ProductCard } from '@/components/common/ProductCard';
import { Navbar } from '@/components/layout/Navbar';
import { INITIAL_PRODUCTS } from '@/data/mockData';

describe('UI Component Rendering', () => {
  it('renders Navbar with store branding and navigation links', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <BusinessProvider>
            <Navbar />
          </BusinessProvider>
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
    expect(screen.getByText(/Bulk Quotations/i)).toBeInTheDocument();
  });

  it('renders ProductCard with "Contact for Price" when price is unverified', () => {
    const product = INITIAL_PRODUCTS[0]!;
    render(
      <BrowserRouter>
        <LanguageProvider>
          <BusinessProvider>
            <ProductCard product={product} />
          </BusinessProvider>
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.brand)).toBeInTheDocument();
    expect(screen.getByText('Contact for Price')).toBeInTheDocument();
  });
});
