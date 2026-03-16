import { CustomerType, OrderStatus } from "@/components/Order";
import type { Bot, Order } from "./orderLogic";
import { assignPendingToIdleBots } from "./orderLogic";

function makeOrder(
  id: number,
  type: CustomerType,
  status: OrderStatus = OrderStatus.Pending,
  assignedBotId: number | null = null,
): Order {
  return {
    id,
    customerType: type,
    status,
    assignedBotId,
  };
}

describe("assignPendingToIdleBots", () => {
  it("does nothing when there are no pending orders", () => {
    const orders: Order[] = [
      makeOrder(1, CustomerType.Normal, OrderStatus.Completed),
    ];
    const bots: Bot[] = [{ id: 1 }];

    const result = assignPendingToIdleBots(orders, bots);
    expect(result).toEqual(orders);
  });

  it("does nothing when there are no idle bots", () => {
    const orders: Order[] = [
      makeOrder(1, CustomerType.Normal, OrderStatus.Processing, 1),
      makeOrder(2, CustomerType.Normal, OrderStatus.Pending),
    ];
    const bots: Bot[] = [{ id: 1 }];

    const result = assignPendingToIdleBots(orders, bots);
    expect(result).toEqual(orders);
  });

  it("assigns a single pending order to a single idle bot", () => {
    const orders: Order[] = [makeOrder(1, CustomerType.Normal)];
    const bots: Bot[] = [{ id: 1 }];

    const result = assignPendingToIdleBots(orders, bots);
    const assigned = result[0];

    expect(assigned.status).toBe(OrderStatus.Processing);
    expect(assigned.assignedBotId).toBe(1);
    expect(assigned.processingStartedAt).toBeDefined();
  });

  it("assigns first N pending orders to N idle bots in order", () => {
    const orders: Order[] = [
      makeOrder(1, CustomerType.VIP),
      makeOrder(2, CustomerType.Normal),
      makeOrder(3, CustomerType.Normal),
    ];
    const bots: Bot[] = [{ id: 1 }, { id: 2 }];

    const result = assignPendingToIdleBots(orders, bots);
    const processing = result.filter((o) => o.status === OrderStatus.Processing);

    expect(processing.map((o) => [o.id, o.assignedBotId])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  it("leaves existing processing orders untouched", () => {
    const orders: Order[] = [
      makeOrder(1, CustomerType.VIP, OrderStatus.Processing, 1),
      makeOrder(2, CustomerType.Normal),
    ];
    const bots: Bot[] = [{ id: 1 }, { id: 2 }];

    const result = assignPendingToIdleBots(orders, bots);

    const first = result.find((o) => o.id === 1)!;
    expect(first.assignedBotId).toBe(1);
    expect(first.status).toBe(OrderStatus.Processing);
  });
});

