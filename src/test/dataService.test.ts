import { describe, it, expect, beforeEach } from 'vitest';
import { DataService } from '@/services/dataService';

describe('DataService Layer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads all standard hardware categories', async () => {
    const categories = await DataService.getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(7);

    const categoryNames = categories.map((c) => c.name);
    expect(categoryNames).toContain('Electrical Materials');
    expect(categoryNames).toContain('Hardware and Fasteners');
    expect(categoryNames).toContain('Plumbing Materials');
    expect(categoryNames).toContain('Construction Materials');
    expect(categoryNames).toContain('Bathware and Sanitaryware');
    expect(categoryNames).toContain('Tools and Accessories');
    expect(categoryNames).toContain('Pumps and Related Equipment');
  });

  it('filters products by brand and search keywords', async () => {
    const searchResult = await DataService.getProducts({ search: 'Finolex' });
    expect(searchResult.data.length).toBeGreaterThanOrEqual(1);
    expect(searchResult.data[0]?.brand).toBe('Finolex');

    const brandResult = await DataService.getProducts({ brand: 'Bosch' });
    expect(brandResult.data.length).toBeGreaterThanOrEqual(1);
    expect(brandResult.data[0]?.brand).toBe('Bosch');
  });

  it('creates and records customer enquiries', async () => {
    const enquiry = await DataService.createEnquiry({
      customer_name: 'Dinesh Builder',
      phone: '9840123456',
      enquiry_type: 'bulk',
      requested_products: '100 bags Dr. Fixit LW+, 50 bags tile adhesive',
    });

    expect(enquiry.id).toBeDefined();
    expect(enquiry.status).toBe('new');

    const list = await DataService.adminGetEnquiries();
    expect(list.some((e) => e.customer_name === 'Dinesh Builder')).toBe(true);
  });

  it('safely prevents deletion of category containing associated products', async () => {
    const categories = await DataService.getCategories();
    const electricalCat = categories.find((c) => c.name === 'Electrical Materials');
    expect(electricalCat).toBeDefined();

    await expect(DataService.adminDeleteCategory(electricalCat!.id)).rejects.toThrow(
      /Cannot delete category with associated products/i
    );
  });
});
