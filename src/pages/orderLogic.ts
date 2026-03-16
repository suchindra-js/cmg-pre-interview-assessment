import { CustomerType, OrderStatus } from "@/components/Order";

export interface Order {
  id: number;
  customerType: CustomerType;
  status: OrderStatus;
  assignedBotId: number | null;
  processingStartedAt?: number;
}

export interface Bot {
  id: number;
}

export function computeNextOrderId(orders: Order[]): number {
  if (orders.length === 0) return 1;
  const maxId = Math.max(...orders.map((o) => o.id));
  return maxId + 1;
}

export function insertPendingOrder(
  orders: Order[],
  newOrder: Order,
): Order[] {
  if (newOrder.customerType === CustomerType.Normal) {
    const lastPendingIndex = orders.findLastIndex(
      (o) => o.status === OrderStatus.Pending,
    );
    const insertAt = lastPendingIndex === -1 ? orders.length : lastPendingIndex + 1;
    return [
      ...orders.slice(0, insertAt),
      newOrder,
      ...orders.slice(insertAt),
    ];
  }

  const firstPendingNormalIndex = orders.findIndex(
    (o) =>
      o.status === OrderStatus.Pending &&
      o.customerType === CustomerType.Normal,
  );
  const insertAt =
    firstPendingNormalIndex === -1 ? orders.length : firstPendingNormalIndex;
  return [
    ...orders.slice(0, insertAt),
    newOrder,
    ...orders.slice(insertAt),
  ];
}

export function assignPendingToIdleBots(
  orders: Order[],
  bots: Bot[],
): Order[] {
  const processingBotIds = new Set(
    orders
      .filter((o) => o.status === OrderStatus.Processing)
      .map((o) => o.assignedBotId),
  );
  const idleBots = bots.filter((b) => !processingBotIds.has(b.id));
  const pendingIndices = orders
    .map((o, i) => ({ o, i }))
    .filter(({ o }) => o.status === OrderStatus.Pending)
    .map(({ i }) => i);

  if (idleBots.length === 0 || pendingIndices.length === 0) return orders;

  const nextOrders = [...orders];
  const toAssign = Math.min(idleBots.length, pendingIndices.length);
  for (let a = 0; a < toAssign; a++) {
    const orderIndex = pendingIndices[a];
    const bot = idleBots[a];
    nextOrders[orderIndex] = {
      ...nextOrders[orderIndex],
      status: OrderStatus.Processing,
      assignedBotId: bot.id,
      processingStartedAt: Date.now(),
    };
  }
  return nextOrders;
}

