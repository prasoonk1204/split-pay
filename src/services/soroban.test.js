import { describe, it, expect } from 'vitest';
import { classifyError } from './soroban';

describe('Error Classification Service', () => {
  it('identifies user rejected errors', () => {
    const err = new Error('user declined the prompt');
    const result = classifyError(err);
    expect(result.type).toBe('user_rejected');
  });

  it('identifies insufficient balance errors', () => {
    const err = new Error('op_underfunded something');
    const result = classifyError(err);
    expect(result.type).toBe('insufficient_balance');
  });

  it('identifies wallet not found errors', () => {
    const err = new Error('freighter not installed');
    const result = classifyError(err);
    expect(result.type).toBe('wallet_not_found');
  });

  it('defaults to a generic error for unknown issues', () => {
    const err = new Error('Internal server timeout 500');
    const result = classifyError(err);
    expect(result.type).toBe('generic');
    expect(result.message).toBe('Internal server timeout 500');
  });
});
