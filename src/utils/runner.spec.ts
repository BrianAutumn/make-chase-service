import {generateRandomNodes} from "./node-generator.util";

describe('Runner', () => {
  it('runs', () => {
    console.log(generateRandomNodes(100,100,20,6))
  })
})