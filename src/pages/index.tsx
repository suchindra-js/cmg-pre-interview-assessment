import Bot, { BotProps } from "@/components/Bot";
import Order, { CustomerType, type OrderProps } from "@/components/Order";
import { useState } from "react";

export default function Index() {
  const [orders, setOrders] = useState<OrderProps[]>([
    { id: 1, customerType: CustomerType.Normal },
    { id: 2, customerType: CustomerType.VIP },
  ]);
  const [bots, setBots] = useState<BotProps[]>([{ id: 1 }]);
  return (
    <div>
      <div>
        {orders.map((order) => (
          <Order id={order.id} customerType={order.customerType} />
        ))}
      </div>
      <div>
        {bots.map((bot) => (
          <Bot id={bot.id} />
        ))}
      </div>
    </div>
  );
}
