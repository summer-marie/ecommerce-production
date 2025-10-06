import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import OrderMenu from "../OrderMenu.jsx";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  __mockMountCounts as lazyMountCounts,
  __mockUnmountCounts as lazyUnmountCounts,
} from "../../utils/perfComponents.jsx";

vi.mock("../../redux/builderSlice", () => ({
  builderGetMany: vi.fn(() => ({ type: "builder/getMany" })),
}));

vi.mock("../../redux/menuItemSlice", () => ({
  menuItemGetAll: vi.fn(() => ({ type: "menuItems/getAll" })),
}));

vi.mock("../../redux/operatingSlice", () => ({
  fetchOperatingStatus: vi.fn(() => ({ type: "operating/status" })),
}));

vi.mock("../../redux/cartSlice", () => ({
  addToCart: vi.fn((payload) => ({ type: "cart/add", payload })),
}));

vi.mock("../../utils/perfComponents.jsx", async () => {
  const React = await import("react");
  const { useEffect } = React;

  const mountCounts = {};
  const unmountCounts = {};

  const LazyImage = ({ alt, ...props }) => {
    useEffect(() => {
      mountCounts[alt] = (mountCounts[alt] ?? 0) + 1;
      return () => {
        unmountCounts[alt] = (unmountCounts[alt] ?? 0) + 1;
      };
    }, [alt]);

    return <img data-testid={`mock-image-${alt}`} alt={alt} {...props} />;
  };

  return {
    LazyImage,
    __esModule: true,
    __mockMountCounts: mountCounts,
    __mockUnmountCounts: unmountCounts,
  };
});

const renderWithStore = (ui, { builders, menuItems } = {}) => {
  const store = configureStore({
    reducer: {
      builder: (state = { builders: builders ?? [] }) => state,
      menuItem: (state = { menuItems: menuItems ?? [] }) => state,
      operating: (state = { status: { isOpen: true } }) => state,
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

const pizzaBuilder = {
  id: "pizza-1",
  pizzaName: "Classic Pizza",
  pizzaPrice: 12,
  image: { data: "data:image/png;base64,pizza" },
  base: {
    crust: { name: "Thin" },
    cheeses: [{ name: "Mozzarella" }],
  },
  sauce: { name: "Tomato" },
  meatTopping: [{ name: "Pepperoni" }],
  veggieTopping: [{ name: "Onion" }],
  herbs: [{ name: "Basil" }],
  otherAdditions: [],
};

const menuItem = {
  id: "menu-1",
  itemName: "Garlic Knots",
  itemType: "Appetizer",
  itemPrice: 6,
  isAvailable: true,
  image: { data: "data:image/png;base64,knots" },
  meatTopping: [],
  veggieTopping: [],
  herbs: [],
  otherAdditions: [],
};

describe("OrderMenu image stability", () => {
  beforeEach(() => {
    Object.keys(lazyMountCounts).forEach((key) => delete lazyMountCounts[key]);
    Object.keys(lazyUnmountCounts).forEach((key) => delete lazyUnmountCounts[key]);
  });

  it("keeps pizza images mounted after adding to cart", async () => {
    renderWithStore(<OrderMenu />, {
      builders: [pizzaBuilder],
      menuItems: [menuItem],
    });

    const increaseButtons = screen.getAllByLabelText(/Increase quantity/i);
    fireEvent.click(increaseButtons[0]);

    const addButtons = screen.getAllByRole("button", { name: "Add" });
    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      expect(lazyUnmountCounts["Classic Pizza"]).toBeUndefined();
    });
  });

  it("keeps menu item images mounted after adding to cart", async () => {
    renderWithStore(<OrderMenu />, {
      builders: [pizzaBuilder],
      menuItems: [menuItem],
    });

    const increaseButtons = screen.getAllByLabelText(/Increase quantity/i);
    fireEvent.click(increaseButtons[1]);

    const addButtons = screen.getAllByRole("button", { name: "Add" });
    fireEvent.click(addButtons[1]);

    await waitFor(() => {
      expect(lazyUnmountCounts["Garlic Knots"]).toBeUndefined();
    });
  });
});
