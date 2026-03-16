import { CustomerType, OrderStatus } from "@/components/Order";
import { assignPendingToIdleBots, type Bot, type Order } from "./orderLogic";

function makeOrder(
  id: number,
  type: CustomerType,
  status: OrderStatus,
  assignedBotId: number | null,
): Order {
  return {
    id,
    customerType: type,
    status,
    assignedBotId,
  };
}

describe("bot removal behavior", () => {
  it("returns in-progress order to the front of the pending queue", () => {
    const bots: Bot[] = [{ id: 1 }, { id: 2 }];
    const initialOrders: Order[] = [
      makeOrder(1, CustomerType.Normal, OrderStatus.Pending, null),
      makeOrder(2, CustomerType.Normal, OrderStatus.Pending, null),
    ];

    // Assign orders: bot 1 -> order 1, bot 2 -> order 2
    let orders = assignPendingToIdleBots(initialOrders, bots);

    // Simulate removing newest bot (id 2) and returning its order to front
    const removedBotId = 2;
    const ordersWithoutInProgress = orders.filter(
      (o) =>
        o.status !== OrderStatus.Processing ||
        o.assignedBotId !== removedBotId,
    );
    const inProgress = orders.find(
      (o) =>
        o.status === OrderStatus.Processing && o.assignedBotId === removedBotId,
    )!;
    const returnedOrder: Order = {
      ...inProgress,
      status: OrderStatus.Pending,
      assignedBotId: null,
    };
    const firstPendingIndex = ordersWithoutInProgress.findIndex(
      (o) => o.status === OrderStatus.Pending,
    );
    const insertAt = firstPendingIndex === -1 ? 0 : firstPendingIndex;
    orders = [
      ...ordersWithoutInProgress.slice(0, insertAt),
      returnedOrder,
      ...ordersWithoutInProgress.slice(insertAt),
    ];

    const pendingIds = orders
      .filter((o) => o.status === OrderStatus.Pending)
      .map((o) => o.id);
    expect(pendingIds[0]).toBe(inProgress.id);
  });
});

