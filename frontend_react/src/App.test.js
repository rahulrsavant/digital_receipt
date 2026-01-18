import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders home headline", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const headline = screen.getByText(/Digital Receipt System/i);
  expect(headline).toBeInTheDocument();
});
