import Order from "./Order";

import { OrderProps } from "./Order";

export interface BotProps {
  id: number;
  orders: OrderProps[];
}
export default function Bot({ id, orders }: BotProps) {
  return (
    <div className="flex h-20 flex-col rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">BOT # {id}</h2>
      <div className="flex flex-wrap gap-2">
        {orders.map((order) => (
          <Order
            key={order.id}
            id={order.id}
            customerType={order.customerType}
          />
        ))}
      </div>
    </div>
  );
}
