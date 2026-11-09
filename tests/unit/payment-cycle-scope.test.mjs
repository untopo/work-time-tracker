import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from './load-core.mjs';

const { run } = loadCore();

test('cycles without a rate apply to every rate that has no cycles of its own', () => {
  const out = run(`(() => {
    const cycles = [{ startDate: 'a', endDate: 'b', payDate: 'c' }, { startDate: 'a', endDate: 'b', payDate: 'c', rate: 'Propio' }];
    const scoped = getPaymentCycleScopeNames(cycles);
    return {
      scoped,
      propioInAll: callBelongsToPaymentCycleScope({ rateName: 'Propio' }, '', scoped),
      voyceInAll: callBelongsToPaymentCycleScope({ rateName: 'Voyce' }, '', scoped),
      propioInOwn: callBelongsToPaymentCycleScope({ rateName: ' propio ' }, 'Propio', scoped),
      voyceInOwn: callBelongsToPaymentCycleScope({ rateName: 'Voyce' }, 'Propio', scoped),
      keysDiffer: getPaymentCycleDuplicateKey(cycles[0]) !== getPaymentCycleDuplicateKey(cycles[1])
    };
  })()`);
  assert.deepEqual(JSON.parse(JSON.stringify(out.scoped)), ['Propio']);
  assert.equal(out.propioInAll, false, 'a call is never counted twice');
  assert.equal(out.voyceInAll, true);
  assert.equal(out.propioInOwn, true);
  assert.equal(out.voyceInOwn, false);
  assert.equal(out.keysDiffer, true, 'same dates for two rates are two cycles, not duplicates');
});

test('with no scoped cycles every call counts in the general cycle, as before', () => {
  const out = run(`callBelongsToPaymentCycleScope({ rateName: 'Anything' }, '', getPaymentCycleScopeNames([{ startDate: 'a' }]))`);
  assert.equal(out, true);
});
