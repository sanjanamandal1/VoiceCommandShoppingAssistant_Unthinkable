import { describe, it, expect } from 'vitest'
import { parse } from '../lib/parser.js'

describe('parser — intent detection', () => {
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

  it('handles "remove milk"', () => {
    const r = parse('remove milk')
    expect(r.intent).toBe('remove')
    expect(r.item).toBe('milk')
  })

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

  it('handles "search for eggs"', () => {
    const r = parse('search for eggs')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('eggs')
  })

  it('handles "find orange juice"', () => {
    const r = parse('find orange juice')
    expect(r.intent).toBe('search')
    expect(r.item).toBe('orange juice')
  })

  it('handles "check off bread"', () => {
    const r = parse('check off bread')
    expect(r.intent).toBe('check')
    expect(r.item).toBe('bread')
  })

  it('handles "we need oat milk"', () => {
    const r = parse('we need oat milk')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('oat milk')
  })

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

  it('strips articles — "add a loaf of bread"', () => {
    const r = parse('add a loaf of bread')
    expect(r.intent).toBe('add')
    expect(r.item).toBe('bread')
    expect(r.unit).toBe('loaf')
  })
})
