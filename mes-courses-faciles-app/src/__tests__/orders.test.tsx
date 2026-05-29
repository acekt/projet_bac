import { describe, it, expect, vi } from 'vitest';

// Use vi.hoisted to ensure these are available during module mocking
const { mockNextResponse, prismaMock } = vi.hoisted(() => ({
  mockNextResponse: {
    json: vi.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data
    }))
  },
  prismaMock: {
    order: {
      create: vi.fn(),
      findMany: vi.fn(),
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

// Import the route handler
import { POST } from '../app/api/orders/route';

describe('Orders API', () => {
  it('should create an order successfully', async () => {
    const orderData = {
      userId: 'user1',
      storeId: 'store1',
      items: [{ id: 'prod1', quantity: 2, price: 1000 }],
      total: 2000,
      deliveryFee: 500,
      paymentMethod: 'cash',
      deliveryAddress: 'Test Address'
    };

    const request = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    prismaMock.order.create.mockResolvedValue({ id: 'order_abc', ...orderData });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.id).toBe('order_abc');
    expect(prismaMock.order.create).toHaveBeenCalled();
  });

  it('should return 500 on database error', async () => {
    const orderData = {
      userId: 'user1',
      storeId: 'store1',
      items: [{ id: 'prod1', quantity: 2, price: 1000 }],
      total: 2000,
      deliveryFee: 500,
      paymentMethod: 'cash',
      deliveryAddress: 'Test Address'
    };

    const request = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    prismaMock.order.create.mockRejectedValue(new Error('DB Error'));

    const response = await POST(request);
    expect(response.status).toBe(500);
  });

  it('should return 400 on validation error', async () => {
    const request = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
