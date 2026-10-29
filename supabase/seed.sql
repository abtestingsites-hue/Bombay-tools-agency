-- Supabase Seed Data for Hardware & Building Materials Store
-- Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active)
VALUES
('c1000000-0000-0000-0000-000000000001', 'Electrical Materials', 'electrical-materials', 'Cables, conduit pipes, modular switches, distribution boards, and industrial electrical supplies.', 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=80', 1, true),
('c1000000-0000-0000-0000-000000000002', 'Hardware and Fasteners', 'hardware-and-fasteners', 'High tensile bolts, SS screws, structural fasteners, hinges, locks, and door fittings.', 'https://images.unsplash.com/photo-1536842409491-b3bbde0e3b66?w=800&auto=format&fit=crop&q=80', 2, true),
('c1000000-0000-0000-0000-000000000003', 'Plumbing Materials', 'plumbing-materials', 'CPVC, UPVC, PVC drainage pipes, brass fittings, ball valves, and solvent cements.', 'https://images.unsplash.com/photo-1548373220-9a83eb96cdd7?w=800&auto=format&fit=crop&q=80', 3, true),
('c1000000-0000-0000-0000-000000000004', 'Construction Materials', 'construction-materials', 'Waterproofing chemicals, tile adhesives, binding wire, safety gear, and masonry accessories.', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80', 4, true),
('c1000000-0000-0000-0000-000000000005', 'Bathware and Sanitaryware', 'bathware-and-sanitaryware', 'Faucets, overhead showers, health faucets, angle valves, waste couplings, and SS sinks.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80', 5, true),
('c1000000-0000-0000-0000-000000000006', 'Tools and Accessories', 'tools-and-accessories', 'Heavy-duty power tools, angle grinders, drill machines, hand tools, and cutting blades.', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80', 6, true),
('c1000000-0000-0000-0000-000000000007', 'Pumps and Related Equipment', 'pumps-and-related-equipment', 'Submersible borehole pumps, open-well pumps, domestic monoblock pumps, and control panels.', 'https://images.unsplash.com/photo-1583723708348-b61db101dfe3?w=800&auto=format&fit=crop&q=80', 7, true)
ON CONFLICT (id) DO NOTHING;

-- Initial Business Settings
INSERT INTO public.business_settings (id, shop_name, tagline, phone, whatsapp_number, email, address, opening_hours, google_maps_url)
VALUES
('b1000000-0000-0000-0000-000000000001', 'Hardware & Building Materials Store', 'Wholesale & Retail Hardware Supplies', '', '', '', '', 'Mon - Sat: 8:30 AM - 8:30 PM', 'https://maps.app.goo.gl/zrJSTZ6aXR7ATsrTA?g_st=aw')
ON CONFLICT (id) DO NOTHING;

-- Initial Seed FAQs
INSERT INTO public.faqs (id, question, answer, category, slug, sort_order, is_published)
VALUES
('f1000000-0000-0000-0000-000000000001', 'How can I get a quotation for bulk materials?', 'You can submit your bill of quantities (BOQ) through our online Bulk Order form or message us directly on WhatsApp with your required product list, sizes, and quantities. We will respond with availability, specifications, and a formal quotation.', 'Bulk Orders', 'how-to-get-bulk-quotation', 1, true),
('f1000000-0000-0000-0000-000000000002', 'Why are some product prices marked "Contact for Price"?', 'Hardware, copper, PVC, and steel material rates fluctuate based on market commodities and order quantities. To ensure you receive accurate and current rates for your specific volume, we provide prices on enquiry.', 'Pricing', 'why-contact-for-price', 2, true),
('f1000000-0000-0000-0000-000000000003', 'Do you supply genuine and branded products?', 'Yes. We stock authorized genuine products from leading brands including Finolex, Ashirvad, Supreme, Bosch, Stanley, Godrej, Tata, and Crompton, along with standard manufacturer specifications.', 'Brands & Quality', 'genuine-branded-products', 3, true),
('f1000000-0000-0000-0000-000000000004', 'Do you provide delivery to site or store pickup?', 'Both options are available. Customers can inspect and pick up materials directly from our shop, or request site delivery for bulk orders across our regional delivery coverage. Exact delivery timelines depend on destination and material volume.', 'Delivery', 'delivery-and-pickup-options', 4, true),
('f1000000-0000-0000-0000-000000000005', 'Where is your shop located?', 'Our store is located in Tamil Nadu. You can find our exact location and get turn-by-turn driving directions via our verified Google Maps link on the contact and location page.', 'Location', 'shop-location-directions', 5, true)
ON CONFLICT (id) DO NOTHING;

