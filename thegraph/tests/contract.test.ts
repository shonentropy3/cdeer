import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ApplyFor } from "../generated/schema"
import { ApplyFor as ApplyForEvent } from "../generated/Contract/Contract"
import { handleApplyFor } from "../src/contract"
import { createApplyForEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let taskId = BigInt.fromI32(234)
    let worker = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let cost = BigInt.fromI32(234)
    let newApplyForEvent = createApplyForEvent(taskId, worker, cost)
    handleApplyFor(newApplyForEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ApplyFor created and stored", () => {
    assert.entityCount("ApplyFor", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ApplyFor",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "taskId",
      "234"
    )
    assert.fieldEquals(
      "ApplyFor",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "worker",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ApplyFor",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "cost",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
