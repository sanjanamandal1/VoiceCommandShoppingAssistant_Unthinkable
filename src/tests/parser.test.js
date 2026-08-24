import { describe, it, expect } from 'vitest'
import { parse } from '../lib/parser.js'

describe('parser — intent detection', () => {
  // ── ADD: core patterns ──────────────────────────────────────────────────

  it('handles "add milk"', () => {
    const r = parse('add milk')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('milk')
    expect(r.quantity).toBe(1)
    expect(r.confidence).toBe('high')
  })

  it('handles "I need apples"', () => {
    const r = parse('I need apples')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('apples')
  })

  it('handles "I want to buy bananas"', () => {
    const r = parse('I want to buy bananas')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('bananas')
  })

  it('handles "I want bananas" (without "to buy")', () => {
    const r = parse('I want bananas')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('bananas')
  })

  it('handles "grab eggs"', () => {
    const r = parse('grab eggs')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('eggs')
  })

  it('handles "buy bread"', () => {
    const r = parse('buy bread')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('bread')
  })

  it('handles "pick up butter"', () => {
    const r = parse('pick up butter')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('butter')
  })

  it('handles "we need oat milk"', () => {
    const r = parse('we need oat milk')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('oat milk')
  })

  // ── ADD: "out of" natural phrasings ────────────────────────────────────

  it('handles "we ran out of coffee"', () => {
    const r = parse('we ran out of coffee')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('coffee')
  })

  it('handles "I ran out of sugar"', () => {
    const r = parse('I ran out of sugar')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('sugar')
  })

  it('handles "out of rice"', () => {
    const r = parse('out of rice')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('rice')
  })

  // ── ADD: reminder / intention phrasings ────────────────────────────────

  it('handles "remind me to get tomatoes"', () => {
    const r = parse('remind me to get tomatoes')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('tomatoes')
  })

  it('handles "I should buy olive oil"', () => {
    const r = parse('I should buy olive oil')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('olive oil')
  })

  // ── REMOVE ──────────────────────────────────────────────────────────────

  it('handles "remove milk"', () => {
    const r = parse('remove milk')
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('milk')
  })

  it('handles "take milk off the list"', () => {
    const r = parse('take milk off the list')
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('milk')
  })

  it('handles "I don\'t need sugar anymore"', () => {
    const r = parse("I don't need sugar anymore")
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('sugar')
  })

  it('handles "drop yogurt from the cart"', () => {
    const r = parse('drop yogurt from the cart')
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('yogurt')
  })

  it('handles "cancel chips"', () => {
    const r = parse('cancel chips')
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('chips')
  })

  // ── SEARCH ──────────────────────────────────────────────────────────────

  it('handles "search for eggs"', () => {
    const r = parse('search for eggs')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('eggs')
    expect(r.maxPrice).toBeNull()
  })

  it('handles "find orange juice"', () => {
    const r = parse('find orange juice')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('orange juice')
    expect(r.maxPrice).toBeNull()
  })

  it('handles "find paneer under 200"', () => {
    const r = parse('find paneer under 200')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('paneer')
    expect(r.maxPrice).toBe(200)
  })

  it('handles "search for milk under ₹100"', () => {
    const r = parse('search for milk under ₹100')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('milk')
    expect(r.maxPrice).toBe(100)
  })

  it('handles "find toothpaste under $5"', () => {
    const r = parse('find toothpaste under $5')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('toothpaste')
    expect(r.maxPrice).toBe(5)
  })

  it('handles "look for tea below 150 rupees"', () => {
    const r = parse('look for tea below 150 rupees')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('tea')
    expect(r.maxPrice).toBe(150)
  })

  it('handles "paneer dhundo" (Hinglish search)', () => {
    const r = parse('paneer dhundo')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('paneer')
  })

  // ── CHECK ───────────────────────────────────────────────────────────────

  it('handles "check off bread"', () => {
    const r = parse('check off bread')
    expect(r.intent).toBe('check')
    expect(r.item).toBe('bread')
  })

  it('handles "mark bread as done"', () => {
    const r = parse('mark bread as done')
    expect(r.intent).toBe('check')
    expect(r.item).toBe('bread')
  })

  it('handles "got milk"', () => {
    const r = parse('got milk')
    expect(r.intent).toBe('check')
    expect(r.item).toBe('milk')
  })

  it('handles "picked up eggs"', () => {
    const r = parse('picked up eggs')
    expect(r.intent).toBe('check')
    expect(r.item).toBe('eggs')
  })

  it('handles "finished the butter"', () => {
    const r = parse('finished the butter')
    expect(r.intent).toBe('check')
    expect(r.item).toBe('butter')
  })

  // ── QUANTITY + UNIT ──────────────────────────────────────────────────────

  it('handles "add 2 bottles of water" — quantity + unit', () => {
    const r = parse('add 2 bottles of water')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('water')
    expect(r.quantity).toBe(2)
    expect(r.unit).toBe('bottles')
  })

  it('handles "add three bags of chips"', () => {
    const r = parse('add three bags of chips')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('chips')
    expect(r.quantity).toBe(3)
  })

  it('strips articles — "add a loaf of bread"', () => {
    const r = parse('add a loaf of bread')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('bread')
    expect(r.unit).toBe('loaf')
  })

  // ── FILLER WORDS ────────────────────────────────────────────────────────

  it('strips filler words — "um add milk"', () => {
    const r = parse('um add milk')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('milk')
  })

  it('strips filler words — "uh I need eggs"', () => {
    const r = parse('uh I need eggs')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('eggs')
  })

  // ── EDGE CASES ───────────────────────────────────────────────────────────

  it('returns low confidence for unrecognised input', () => {
    const r = parse('blah blah something weird')
    expect(r.intent).toBe('unknown')
    expect(r.confidence).toBe('low')
  })

  it('returns unknown for empty string', () => {
    const r = parse('')
    expect(r.intent).toBe('unknown')
    expect(r.item).toBeNull()
  })

  // ── HINGLISH — ADD ───────────────────────────────────────────────────────

  it('handles "doodh lana hai" (Hinglish: need to get milk)', () => {
    const r = parse('doodh lana hai')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('doodh')
  })

  it('handles "anda chahiye" (Hinglish: need eggs)', () => {
    const r = parse('anda chahiye')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('anda')
  })

  it('handles "chawal le lo" (Hinglish: get rice)', () => {
    const r = parse('chawal le lo')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('chawal')
  })

  it('handles "ghee kharidna hai" (Hinglish: need to buy ghee)', () => {
    const r = parse('ghee kharidna hai')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('ghee')
  })

  it('handles "sabzi leke aao" (Hinglish: go get vegetables)', () => {
    const r = parse('sabzi leke aao')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('sabzi')
  })

  // ── HINGLISH — REMOVE ────────────────────────────────────────────────────

  it('handles "chips hatao" (Hinglish: remove chips)', () => {
    const r = parse('chips hatao')
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('chips')
  })

  it('handles "butter nahi chahiye" (Hinglish: don\'t need butter)', () => {
    const r = parse('butter nahi chahiye')
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('butter')
  })

  it('handles "namak mat lana" (Hinglish: don\'t bring salt)', () => {
    const r = parse('namak mat lana')
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('namak')
  })

  // ── HINGLISH — CHECK ─────────────────────────────────────────────────────

  it('handles "doodh aa gaya" (Hinglish: milk arrived / got milk)', () => {
    const r = parse('doodh aa gaya')
    expect(r.intent).toBe('check')
    expect(r.item).toBe('doodh')
  })

  it('handles "eggs le liya" (Hinglish: picked up eggs)', () => {
    const r = parse('eggs le liya')
    expect(r.intent).toBe('check')
    expect(r.item).toBe('eggs')
  })

  // ── INDIAN UNITS ─────────────────────────────────────────────────────────

  it('handles "add 2 kilo atta" — Indian unit kilo', () => {
    const r = parse('add 2 kilo atta')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('atta')
    expect(r.quantity).toBe(2)
    expect(r.unit).toBe('kilo')
  })

  it('handles "add ek paav ghee" — Hindi numeral + Indian unit', () => {
    const r = parse('add ek paav ghee')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('ghee')
    expect(r.quantity).toBe(1)
    expect(r.unit).toBe('paav')
  })
})
