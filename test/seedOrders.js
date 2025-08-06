import "dotenv/config"
import axios from "axios"
import { createFakeOrder } from "./createFakeOrder.js"

const testOrders = createFakeOrder(5)

testOrders.forEach(async (order) => {
  const addTestOrder = await axios.post(
    `${process.env.SERVER_URL}/orders`,
    order
  )
  console.log("addTestOrder", addTestOrder)
})
