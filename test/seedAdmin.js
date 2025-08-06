import "dotenv/config"
import axios from "axios";
import { generateFakeUsers } from "./createFakeAdmin.js";

// console.log(process.env.SERVER_URL)

const seedAdmin = generateFakeUsers(1)
console.log("seedAdmin", seedAdmin)

seedAdmin.forEach(async (user) => {
    const addUser = await axios.post(`${process.env.SERVER_URL}/users`, user)
    console.log("addUser", addUser.data)
  })
  