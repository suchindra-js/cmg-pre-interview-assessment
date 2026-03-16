export interface BotProps {
  id: number;
}
export default function Bot({ id }: BotProps) {
  return (
    <div
      key={id}
      className="flex h-20 w-20 items-center justify-center bg-green-500 text-white"
    >
      <div className="flex flex-col items-center justify-center text-sm font-medium">
        <div>#{id}</div>
        Bot
      </div>
    </div>
  );
}
