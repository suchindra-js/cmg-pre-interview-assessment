import Order from "./Order";
import type { OrderProps } from "./Order";

export interface ProcessingOrder extends OrderProps {
  processingStartedAt?: number;
}

export interface BotProps {
  id: number;
  orders: ProcessingOrder[];
  processSeconds: number;
}

export default function Bot({ id, orders, processSeconds }: BotProps) {
  const currentOrder = orders[0];

  return (
    <div className="flex min-w-0 flex-col rounded-xl border-2 border-gray-200 bg-gray-50/80 p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-gray-800">Bot #{id}</h2>
      <div className="flex min-h-[6rem] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/60 p-3">
        {currentOrder ? (
          <Order
            key={currentOrder.id}
            id={currentOrder.id}
            customerType={currentOrder.customerType}
            processingStartedAt={currentOrder.processingStartedAt}
            totalProcessingSeconds={processSeconds}
          />
        ) : (
          <span className="text-sm font-medium text-gray-400">Idle</span>
        )}
      </div>
    </div>
  );
}
