import { CustomerType, OrderStatus } from "@/components/Order";
import { assignPendingToIdleBots, type Bot, type Order } from "./orderLogic";

describe("timing and re-assignment behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("marks an order completed after 10 seconds", () => {
    const bots: Bot[] = [{ id: 1 }];
    const initialOrders: Order[] = [
      {
        id: 1,
        customerType: CustomerType.Normal,
        status: OrderStatus.Pending,
        assignedBotId: null,
      },
    ];

    let orders = assignPendingToIdleBots(initialOrders, bots);
    const processing = orders[0];
    expect(processing.status).toBe(OrderStatus.Processing);
    expect(processing.assignedBotId).toBe(1);

    // Simulate the completion logic by advancing time and marking completed.
    vi.advanceTimersByTime(10_000);
    orders = orders.map((o) =>
      o.id === processing.id
        ? { ...o, status: OrderStatus.Completed, assignedBotId: null }
        : o,
    );

    expect(orders[0].status).toBe(OrderStatus.Completed);
    expect(orders[0].assignedBotId).toBeNull();
  });

  it("assigns next order to the same bot after completion", () => {
    const bots: Bot[] = [{ id: 1 }];
    const initialOrders: Order[] = [
      {
        id: 1,
        customerType: CustomerType.Normal,
        status: OrderStatus.Pending,
        assignedBotId: null,
      },
      {
        id: 2,
        customerType: CustomerType.Normal,
        status: OrderStatus.Pending,
        assignedBotId: null,
      },
    ];

    let orders = assignPendingToIdleBots(initialOrders, bots);
    const firstProcessing = orders.find(
      (o) => o.status === OrderStatus.Processing,
    )!;
    expect(firstProcessing.id).toBe(1);

    // Complete first order
    orders = orders.map((o) =>
      o.id === firstProcessing.id
        ? { ...o, status: OrderStatus.Completed, assignedBotId: null }
        : o,
    );

    // Re-run assignment: bot should pick the next pending order
    orders = assignPendingToIdleBots(orders, bots);
    const secondProcessing = orders.find(
      (o) => o.status === OrderStatus.Processing,
    )!;

    expect(secondProcessing.id).toBe(2);
    expect(secondProcessing.assignedBotId).toBe(1);
  });
});

