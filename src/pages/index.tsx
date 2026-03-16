import Bot, { BotProps } from "@/components/Bot";
import Order, {
  CustomerType,
  OrderStatus,
  type OrderProps,
} from "@/components/Order";
import {
  assignPendingToIdleBots,
  computeNextOrderId,
  insertPendingOrder,
  type Bot as BotModel,
  type Order as OrderModel,
} from "./orderLogic";
import { useEffect, useRef, useState } from "react";

const PROCESSING_SECONDS = 10;

export default function Index() {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [bots, setBots] = useState<BotModel[]>([{ id: 1 }]);

  const botsRef = useRef(bots);
  botsRef.current = bots;
  const processingTimeoutsRef = useRef<
    Map<number, ReturnType<typeof setTimeout>>
  >(new Map());

  useEffect(() => {
    const timeouts = processingTimeoutsRef.current;
    orders.forEach((order) => {
      if (order.status !== OrderStatus.Processing) {
        const existing = timeouts.get(order.id);
        if (existing) {
          clearTimeout(existing);
          timeouts.delete(order.id);
        }
        return;
      }
      if (timeouts.has(order.id)) return;
      const timeoutId = setTimeout(() => {
        timeouts.delete(order.id);
        setOrders((prev) => {
          const next = prev.map((o) =>
            o.id === order.id
              ? { ...o, status: OrderStatus.Completed, assignedBotId: null }
              : o,
          );
          return assignPendingToIdleBots(next, botsRef.current);
        });
      }, PROCESSING_SECONDS * 1000);
      timeouts.set(order.id, timeoutId);
    });
  }, [orders]);

  useEffect(() => {
    return () => {
      processingTimeoutsRef.current.forEach((id) => clearTimeout(id));
      processingTimeoutsRef.current.clear();
    };
  }, []);

  const addNewOrder = (customerType: CustomerType) => {
    const nextId = computeNextOrderId(orders);
    const newOrder: OrderModel = {
      id: nextId,
      customerType,
      status: OrderStatus.Pending,
      assignedBotId: null,
    };

    const nextOrders = insertPendingOrder(orders, newOrder);
    setOrders(assignPendingToIdleBots(nextOrders, bots));
  };

  const addNewBot = () => {
    const newBots = [...bots, { id: bots.length + 1 }];
    setBots(newBots);
    setOrders(assignPendingToIdleBots(orders, newBots));
  };

  const removeBot = () => {
    const removedBotId = bots[bots.length - 1].id;
    const newBots = bots.slice(0, -1);

    const orderInProgress = orders.find(
      (o) =>
        o.status === OrderStatus.Processing && o.assignedBotId === removedBotId,
    );

    if (orderInProgress) {
      const timeouts = processingTimeoutsRef.current;
      const timeoutId = timeouts.get(orderInProgress.id);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeouts.delete(orderInProgress.id);
      }

      const returnedOrder: OrderModel = {
        ...orderInProgress,
        status: OrderStatus.Pending,
        assignedBotId: null,
      };
      const ordersWithoutInProgress = orders.filter(
        (o) =>
          o.status !== OrderStatus.Processing ||
          o.assignedBotId !== removedBotId,
      );
      const firstPendingIndex = ordersWithoutInProgress.findIndex(
        (o) => o.status === OrderStatus.Pending,
      );
      const insertAt = firstPendingIndex === -1 ? 0 : firstPendingIndex;
      const nextOrders = [
        ...ordersWithoutInProgress.slice(0, insertAt),
        returnedOrder,
        ...ordersWithoutInProgress.slice(insertAt),
      ];
      setBots(newBots);
      setOrders(assignPendingToIdleBots(nextOrders, newBots));
    } else {
      setBots(newBots);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 p-4">
      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
        <button
          type="button"
          onClick={() => addNewOrder(CustomerType.Normal)}
          className="rounded bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
        >
          New Normal Order
        </button>
        <button
          type="button"
          onClick={() => addNewOrder(CustomerType.VIP)}
          className="rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
        >
          New VIP Order
        </button>
        <button
          type="button"
          onClick={addNewBot}
          className="rounded bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600"
        >
          + Bot
        </button>
        <button
          type="button"
          onClick={removeBot}
          disabled={bots.length === 0}
          className="rounded bg-gray-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-500"
        >
          - Bot
        </button>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
        {/* PENDING */}
        <section className="flex flex-col rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">PENDING</h2>
          <div className="flex flex-wrap gap-2">
            {orders
              .filter((order) => order.status === OrderStatus.Pending)
              .map((order) => (
                <Order
                  key={order.id}
                  id={order.id}
                  customerType={order.customerType}
                />
              ))}
          </div>
        </section>

        {/* BOT */}
        <section className="flex flex-col gap-2">
          {bots.map((bot) => (
            <Bot
              key={bot.id}
              id={bot.id}
              processSeconds={PROCESSING_SECONDS}
              orders={orders.filter(
                (order) =>
                  order.status === OrderStatus.Processing &&
                  order.assignedBotId === bot.id,
              )}
            />
          ))}
        </section>

        {/* COMPLETE */}
        <section className="flex flex-col rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">COMPLETE</h2>
          <div className="flex flex-wrap gap-2">
            {orders
              .filter((order) => order.status === OrderStatus.Completed)
              .map((order) => (
                <Order
                  key={order.id}
                  id={order.id}
                  customerType={order.customerType}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
