import {applyDelta, createDelta} from "./delta.util";
import {cloneDeep} from "lodash";

const before = {
  a: 'a',
  b: 'b',
  c: {
    d: 'd',
    e: 'e',
    $other: 'other'
  },
  f: 'f',
  h: {
    i: 'i',
    j: 'j',
    $other: 'other'
  },
  k: [
    'l',
    'm',
    'n',
    {
      o: 'o',
      p: 'p'
    }
  ]
}
const after = {
  a: 'a',
  b: 'B',
  c: {
    d: 'D',
    e: 'e',
    $other: 'other'
  },
  g: 'g',
  h: {
    i: 'i',
    j: 'j',
    $other: 'other'
  },
  k: [
    'l',
    'M',
    'n',
    {
      o: 'o',
      p: 'P'
    }
  ]
}

const delta = {
  "b": "B",
  "c": {
    "$other": "other",
    "d": "D"
  },
  "f": null,
  "g": "g",
  "k": {
    "1": "M",
    "3": {
      "p": "P"
    }
  }
}

const deltaB = {
  a: {
    b: 'b',
    $operation: 'operation'
  },
  c: {
    d: 'd',
    $oper: 'non',
    e: {
      f: 'f',
      $thing: 'thing'
    }
  },
  g: {
    h: 'h',
    $operation: 'operation'
  },
  $root: 'root'
}

describe('delta.util', () => {
  describe('createDelta()', () => {
    it('should create a diff', () => {
      expect(createDelta(before, after)).toEqual(delta)
    })

    it('should return undefined if nothing is different', () => {
      expect(createDelta(before, before)).toEqual(undefined)
    })
  })
  describe('applyDelta()', () => {
    it('should apply a patch', () => {
      expect(applyDelta(cloneDeep(before), delta)).toEqual(after)
    })
  })
})