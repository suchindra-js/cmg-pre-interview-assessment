import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { CustomerType } from "./Order";
import Bot from "./Bot";

describe("Bot component", () => {
  it("renders Idle when there are no orders", () => {
    render(<Bot id={1} orders={[]} processSeconds={10} />);

    expect(screen.getByText(/idle/i)).toBeInTheDocument();
  });

  it("renders the current order when provided", () => {
    render(
      <Bot
        id={1}
        processSeconds={10}
        orders={[
          {
            id: 42,
            customerType: CustomerType.Normal,
          },
        ]}
      />,
    );

    expect(screen.getByText("#42")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
  });
});

