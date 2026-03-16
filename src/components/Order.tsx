export enum CustomerType {
  Normal = "Normal",
  VIP = "VIP ",
}
export interface OrderProps {
  id: number;
  customerType: CustomerType;
}
export default function Order({ id, customerType }: OrderProps) {
  return (
    <div
      key={id}
      className={`flex h-20 w-20 items-center justify-center rounded-full text-white ${customerType === CustomerType.Normal ? "bg-blue-500" : "bg-red-500"}`}
    >
      <div className="flex flex-col items-center justify-center text-sm font-medium">
        <div>#{id}</div>
        {customerType}
      </div>
    </div>
  );
}
