import { faker } from "@faker-js/faker";

const names = [
  "Double Trouble",
  "Supreme",
  "Peperoni Deluxe",
  "Cheese Me",
  "Build Your Own",
];

const ZIP_CODES = ["95338", "85395"];

// Helper function to generate a single pizza
const createPizza = () => {
  return {
    pizzaName: faker.helpers.arrayElement(names),
    pizzaPrice: faker.commerce.price({ min: 15, max: 20, dec: 2 }),
    quantity: faker.number.int({ min: 1, max: 5 }),
  };
};

const generateStartOrderNumber = () => {
  return faker.number.int({ min: 50000, max: 99999 });
};

const generateUniqueOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0"); // 3 random digits
  return parseInt(timestamp + random);
};

const fakeOrder = () => {
  // Generate 1-4 pizzas
  const numberOfPizzas = faker.number.int({ min: 1, max: 4 });
  const pizzas = Array.from({ length: numberOfPizzas }, createPizza);

  // Calculate total from all pizzas
  const orderTotal = pizzas
    .reduce(
      (total, pizza) => total + parseFloat(pizza.pizzaPrice) * pizza.quantity,
      0
    )
    .toFixed(2);

  return {
    orderNumber: generateUniqueOrderNumber(),
    Date: faker.date.between({ from: "2025-04-01", to: Date.now() }),
    orderDetails: pizzas,
    address: {
      street: faker.location.streetAddress(true),
      city: "Goodyear",
      state: "Arizona",
      zip: faker.helpers.arrayElement(ZIP_CODES),
    },
    phone: faker.phone.number({ style: "national" }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    orderTotal,

    // status: "processing",
    // status: "archived",
    status: "completed",
    // status: "delivered",
    // status: "cancelled",
    isArchived: false,
  };
};

export const createFakeOrder = (length) => {
  const testOrders = [];
  // Start from current time
  let currentDate = new Date();
  let currentOrderNumber = generateStartOrderNumber();

  Array.from({ length: length }).forEach(() => {
    // Create the order with the current date
    const order = {
      ...fakeOrder(),
      orderNumber: currentOrderNumber++,
      Date: new Date(currentDate),
    };

    // Subtract 10 minutes for next order
    currentDate.setMinutes(currentDate.getMinutes() - 10);
    testOrders.push(order);
  });
  return testOrders;
};
