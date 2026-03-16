import { CustomerType, OrderStatus } from "@/components/Order";
import type { Order } from "./orderLogic";
import { insertPendingOrder } from "./orderLogic";

function makeOrder(id: number, type: CustomerType, status = OrderStatus.Pending): Order {
  return {
    id,
    customerType: type,
    status,
    assignedBotId: null,
  };
}

describe("insertPendingOrder", () => {
  it("places first Normal as the only pending order", () => {
    const initial: Order[] = [];
    const result = insertPendingOrder(initial, makeOrder(1, CustomerType.Normal));

    expect(result.map((o) => o.id)).toEqual([1]);
  });

  it("appends Normal after the last pending order", () => {
    const initial: Order[] = [
      makeOrder(1, CustomerType.VIP),
      makeOrder(2, CustomerType.Normal),
    ];
    const result = insertPendingOrder(initial, makeOrder(3, CustomerType.Normal));

    expect(result.map((o) => o.id)).toEqual([1, 2, 3]);
  });

  it("inserts VIP before first pending Normal when only normals exist", () => {
    const initial: Order[] = [
      makeOrder(1, CustomerType.Normal),
      makeOrder(2, CustomerType.Normal),
    ];
    const result = insertPendingOrder(initial, makeOrder(3, CustomerType.VIP));

    expect(result.map((o) => o.id)).toEqual([3, 1, 2]);
  });

  it("inserts VIP after existing VIPs but before normals", () => {
    const initial: Order[] = [
      makeOrder(1, CustomerType.VIP),
      makeOrder(2, CustomerType.VIP),
      makeOrder(3, CustomerType.Normal),
      makeOrder(4, CustomerType.Normal),
    ];
    const result = insertPendingOrder(initial, makeOrder(5, CustomerType.VIP));

    expect(result.map((o) => o.id)).toEqual([1, 2, 5, 3, 4]);
  });

  it("inserts VIP as only pending when list is empty", () => {
    const initial: Order[] = [];
    const result = insertPendingOrder(initial, makeOrder(1, CustomerType.VIP));

    expect(result.map((o) => o.id)).toEqual([1]);
  });
});

