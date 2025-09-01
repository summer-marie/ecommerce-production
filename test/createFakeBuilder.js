import { faker } from "@faker-js/faker";

const pizzaNames = [
  "Double Trouble",
  "Supreme",
  "Pepperoni Deluxe",
  "Cheese Me",
  "Buffalo Chicken",
  "Veggie Delight",
  "Italian Feast",
  "Boston Red Sox",
];

const meatOptions = [
  "Pepperoni",
  "Grilled Chicken",
  "Italian Sausage",
  "Ham",
  "Bacon",
  "Ground Beef",
];

const veggieOptions = [
  "Black Olives",
  "Bell Peppers",
  "Mushrooms",
  "Red Onions",
  "Spinach",
];

const crustOptions = [
  {
    name: "Brick Oven Crust",
    description: "Traditional hand-tossed crust",
    itemType: "Base",
    price: 3.0,
  },
  {
    name: "Thin Crust",
    description: "Crispy thin crust",
    itemType: "Base",
    price: 2.5,
  },
];

const cheeseOptions = [
  {
    name: "Mozzarella",
    description: "Classic creamy mozzarella cheese",
    itemType: "Base",
    price: 2.0,
  },
  {
    name: "Cheddar",
    description: "Sharp cheddar",
    itemType: "Base",
    price: 1.8,
  },
];

const sauceOptions = [
  {
    name: "Signature Red Sauce",
    description: "Our classic tomato-based pizza sauce",
    price: 1.0,
  },
  {
    name: "Garlic Parmesan White Sauce",
    description: "Creamy sauce with garlic and parmesan",
    price: 1.5,
  },
  {
    name: "Barbecue Sauce",
    description: "Sweet and tangy BBQ sauce base",
    price: 1.5,
  },
];

const fakeBuilder = () => {
  // Generate 1-3 random meat toppings
  const meatToppings = [];
  const meatCount = faker.number.int({ min: 1, max: 3 });
  const shuffledMeats = faker.helpers.shuffle([...meatOptions]);

  for (let i = 0; i < meatCount; i++) {
    meatToppings.push({
      name: shuffledMeats[i],
      description: `Premium ${shuffledMeats[i].toLowerCase()}`,
      price: parseFloat(faker.commerce.price({ min: 2, max: 3, dec: 2 })),
      itemType: "Meat Topping",
      amount: faker.number.int({ min: 1, max: 3 }),
    });
  }

  // Generate 1-4 random veggie toppings
  const veggieToppings = [];
  const veggieCount = faker.number.int({ min: 1, max: 4 });
  const shuffledVeggies = faker.helpers.shuffle([...veggieOptions]);

  for (let i = 0; i < veggieCount; i++) {
    veggieToppings.push({
      name: shuffledVeggies[i],
      description: `Fresh ${shuffledVeggies[i].toLowerCase()}`,
      price: parseFloat(faker.commerce.price({ min: 1, max: 2, dec: 2 })),
      itemType: "Veggie Topping",
      amount: faker.number.int({ min: 1, max: 3 }),
    });
  }

  // Calculate total price based on components
  const selectedCrust = faker.helpers.arrayElement(crustOptions);
  const selectedCheeses = faker.helpers.arrayElements(cheeseOptions, { min: 1, max: 2 });
  const basePrice = selectedCrust.price + selectedCheeses.reduce((sum, item) => sum + item.price, 0);
  const saucePrice = faker.helpers.arrayElement(sauceOptions).price;
  const toppingsPrice = [...meatToppings, ...veggieToppings].reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );

  const totalPrice = parseFloat(
    (basePrice + saucePrice + toppingsPrice).toFixed(2)
  );

  // Generate random sauce
  const selectedSauce = faker.helpers.arrayElement(sauceOptions);

  return {
    pizzaName: faker.helpers.arrayElement(pizzaNames),
    pizzaPrice: totalPrice,
    // Base as object with crust and cheeses
    base: {
      crust: selectedCrust,
      cheeses: selectedCheeses.map((c) => ({ ...c, amount: 1 })),
    },
    sauce: selectedSauce,
    meatTopping: meatToppings,
    veggieTopping: veggieToppings,
    image: {
      filename: "basePizza.jpg",
      originalname: "basePizza.jpg",
      mimetype: "image/jpeg",
      path: "../assets/basePizza.jpg",
      size: 124568,
    },
  };
};

export const createFakeBuilder = (length) => {
  const testBuilder = [];

  Array.from({ length: length }).forEach(() => {
    testBuilder.push(fakeBuilder());
  });
  return testBuilder;
};

export const createFakeBuilderSingle = () => {
  return fakeBuilder();
};
