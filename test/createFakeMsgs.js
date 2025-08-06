import { faker } from "@faker-js/faker";

// Sample subjects for messages
const subjects = [
  "Order Question",
  "Delivery Feedback",
  "Menu Suggestion",
  "Catering Inquiry",
  "Website Issue",
  "Special Request",
  "Complaint",
  "Compliment",
  "Allergen Information",
  "Job Application"
];

// Create a single fake message
const fakeMessage = () => {
  return {
    email: faker.internet.email(),
    subject: faker.helpers.arrayElement(subjects),
    message: faker.lorem.paragraphs({ min: 1, max: 3 }, "\n\n"),
    date: faker.date.between({ from: "2025-04-01", to: Date.now() }),
    isRead: faker.datatype.boolean({ probability: 0.3 }) // 30% chance of being read
  };
};

// Create multiple fake messages
export const createFakeMessages = (length) => {
  const messages = [];
  
  // Start from current time
  let currentDate = new Date();

  Array.from({ length }).forEach(() => {
    // Create message with current date
    const message = {
      ...fakeMessage(),
      date: new Date(currentDate)
    };

    // Subtract random minutes (1-180) for next message
    currentDate.setMinutes(
      currentDate.getMinutes() - faker.number.int({ min: 1, max: 180 })
    );
    
    messages.push(message);
  });
  
  return messages;
};