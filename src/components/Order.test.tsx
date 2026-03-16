import { act, render, screen } from "@testing-library/react";
import Order, { CustomerType } from "./Order";

describe("Order component", () => {
  it("renders id and customer type", () => {
    render(<Order id={7} customerType={CustomerType.VIP} />);

    expect(screen.getByText("#7")).toBeInTheDocument();
    expect(screen.getByText(/VIP/)).toBeInTheDocument();
  });

  it("shows a countdown when processingStartedAt and totalProcessingSeconds are provided", () => {
    vi.useFakeTimers();
    render(
      <Order
        id={1}
        customerType={CustomerType.Normal}
        processingStartedAt={Date.now()}
        totalProcessingSeconds={10}
      />,
    );

    expect(screen.getByText(/10s/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/8/)).toBeInTheDocument();

    vi.useRealTimers();
  });
});

