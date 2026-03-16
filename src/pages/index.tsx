import Bot, { BotProps } from "@/components/Bot";
import Order, {
  CustomerType,
  OrderStatus,
  type OrderProps,
} from "@/components/Order";
import { useState } from "react";

interface Order {
  id: number;
  customerType: CustomerType;
  status: OrderStatus;
  assignedBotId: number | null;
}

export interface Bot {
  id: number;
}

export default function Index() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [bots, setBots] = useState<Bot[]>([{ id: 1 }]);

  const addNewOrder = (customerType: CustomerType) => {
    setOrders([
      ...orders,
      {
        id: orders.length + 1,
        customerType: customerType,
        status: OrderStatus.Pending,
        assignedBotId: null,
      },
    ]);
  };
  const addNewBot = () => {
    setBots([...bots, { id: bots.length + 1 }]);
  };

  const removeBot = () => {
    setBots(bots.slice(0, -1));
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

      {/* Three areas */}
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
