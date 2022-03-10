import { render, screen } from "@testing-library/react";
import Home from "./index";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /code comments/i,
    });
    const subheading = screen.getByRole("heading", {
      name: /notes on software and life/i,
    });

    expect(heading).toBeInTheDocument();
    expect(subheading).toBeInTheDocument();
  });
});
