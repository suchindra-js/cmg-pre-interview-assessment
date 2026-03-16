import { useEffect, useState } from "react";

export enum CustomerType {
  Normal = "Normal",
  VIP = "VIP ",
}

export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Completed = "Completed",
}

export interface OrderProps {
  id: number;
  customerType: CustomerType;
  processingStartedAt?: number;
  totalProcessingSeconds?: number;
}

export default function Order({
  id,
  customerType,
  processingStartedAt,
  totalProcessingSeconds,
}: OrderProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (processingStartedAt == null || totalProcessingSeconds == null) {
      setSecondsLeft(null);
      return;
    }
    const computeLeft = () => {
      const elapsed = (Date.now() - processingStartedAt) / 1000;
      const left = Math.ceil(totalProcessingSeconds - elapsed);
      return Math.max(0, left);
    };
    setSecondsLeft(computeLeft());
    const interval = setInterval(() => {
      const left = computeLeft();
      setSecondsLeft(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [processingStartedAt, totalProcessingSeconds]);

  const showCountdown = secondsLeft != null && totalProcessingSeconds != null;

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 text-white shadow-sm ${customerType === CustomerType.Normal ? "bg-blue-500" : "bg-red-500"}`}
      style={{ minWidth: "6rem", minHeight: "5rem" }}
    >
      <div className="flex flex-col items-center justify-center gap-0.5 p-2 text-center text-sm font-medium">
        <span className="opacity-90">#{id}</span>
        <span className="text-xs">{customerType}</span>
        {showCountdown && (
          <span
            className="mt-1 block text-lg font-bold tabular-nums"
            aria-label={`${secondsLeft} seconds remaining`}
          >
            {secondsLeft}s
          </span>
        )}
      </div>
    </div>
  );
}
