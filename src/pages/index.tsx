import Order, { CustomerType, type OrderProps } from "@/components/Order";
import { useState } from "react";

export default function Index() {
  const [orders, setOrders] = useState<OrderProps[]>([
    { id: 1, customerType: CustomerType.Normal },
    { id: 2, customerType: CustomerType.VIP },
  ]);
  return (
    <div>
      {orders.map((order) => (
        <Order id={order.id} customerType={order.customerType} />
      ))}
    </div>
  );
}
