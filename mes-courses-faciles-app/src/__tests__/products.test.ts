import { describe, it, expect, vi } from 'vitest';

// Mocks hoisted for NEXT response and prisma
const { mockNextResponse, prismaMock } = vi.hoisted(() => ({
  mockNextResponse: {
    json: vi.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data
    }))
  },
  prismaMock: {
    product: {
      update: vi.fn(),
      delete: vi.fn(),
    }
  }
}));

vi.mock('next/server', () => ({
  NextResponse: mockNextResponse
}));

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

// Import PUT and DELETE handlers
import { PUT, DELETE } from '../app/api/admin/products/[id]/route';

describe('Admin Product Details API', () => {
  const mockParams = Promise.resolve({ id: 'prod_123' });

  describe('PUT - Update Product', () => {
    it('should update a product successfully', async () => {
      const validProductData = {
        name: 'Riz Basmati Premium 5kg',
        price: 5500,
        stock: 50,
        category: 'Alimentaire',
        unit: 'sac',
        storeId: 'store_mbolo',
        description: 'Excellent riz de qualité supérieure.',
        image: 'https://example.com/riz.jpg'
      };

      const request = new Request('http://localhost/api/admin/products/prod_123', {
        method: 'PUT',
        body: JSON.stringify(validProductData)
      });

      prismaMock.product.update.mockResolvedValue({
        id: 'prod_123',
        ...validProductData,
        images: JSON.stringify([validProductData.image])
      });

      const response = await PUT(request, { params: mockParams });
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.id).toBe('prod_123');
      expect(data.name).toBe('Riz Basmati Premium 5kg');
      expect(prismaMock.product.update).toHaveBeenCalled();
    });

    it('should return 400 on Zod validation failure', async () => {
      const invalidProductData = {
        name: 'Riz', // Too short
        price: -100, // Negative price
        stock: 10,
        category: 'Alimentaire',
        unit: 'sac',
        storeId: 'store_mbolo',
        image: 'not-a-url' // Invalid URL
      };

      const request = new Request('http://localhost/api/admin/products/prod_123', {
        method: 'PUT',
        body: JSON.stringify(invalidProductData)
      });

      const response = await PUT(request, { params: mockParams });
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('Validation error');
    });

    it('should return 404 if product to update is not found', async () => {
      const validProductData = {
        name: 'Riz Basmati Premium 5kg',
        price: 5500,
        stock: 50,
        category: 'Alimentaire',
        unit: 'sac',
        storeId: 'store_mbolo',
        description: 'Excellent riz de qualité supérieure.',
        image: 'https://example.com/riz.jpg'
      };

      const request = new Request('http://localhost/api/admin/products/prod_123', {
        method: 'PUT',
        body: JSON.stringify(validProductData)
      });

      const prismaError = new Error('Product not found');
      (prismaError as any).code = 'P2025';
      prismaMock.product.update.mockRejectedValue(prismaError);

      const response = await PUT(request, { params: mockParams });
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.error).toBe('Product not found');
    });
  });

  describe('DELETE - Delete Product', () => {
    it('should delete a product successfully', async () => {
      const request = new Request('http://localhost/api/admin/products/prod_123', {
        method: 'DELETE'
      });

      prismaMock.product.delete.mockResolvedValue({ id: 'prod_123' });

      const response = await DELETE(request, { params: mockParams });
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toBe('Product deleted successfully');
      expect(prismaMock.product.delete).toHaveBeenCalledWith({
        where: { id: 'prod_123' }
      });
    });

    it('should return 404 if product to delete is not found', async () => {
      const request = new Request('http://localhost/api/admin/products/prod_123', {
        method: 'DELETE'
      });

      const prismaError = new Error('Product not found');
      (prismaError as any).code = 'P2025';
      prismaMock.product.delete.mockRejectedValue(prismaError);

      const response = await DELETE(request, { params: mockParams });
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.error).toBe('Product not found');
    });
  });
});
