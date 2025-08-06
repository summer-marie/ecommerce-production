import "dotenv/config"
import axios from "axios"
import { createFakeBuilder, createFakeBuilderSingle } from "./createFakeBuilder.js"

const testBuilders = createFakeBuilder(5)

// const singleBuilder = createFakeBuilderSingle();

testBuilders.forEach(async (builder) => {
  const addTestBuilder = await axios.post(
    `${process.env.SERVER_URL}/builders`,
    builder
  )
  console.log("addTestBuilder", addTestBuilder)
})

