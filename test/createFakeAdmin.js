import { faker } from "@faker-js/faker"

const generateFakeUser = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const provider = "gmail.com"

  return {
   firstName: firstName,
    lastName: lastName,
    email: faker.internet.email({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      provider,
    }),
    password: "test",

    role: "admin",
    status: "active",
    token: [],
  }
}

export const generateFakeUsers = (length) => {
  const users = []
  Array.from({ length: length }).forEach(() => {
    users.push(generateFakeUser())
  })
  return users
}