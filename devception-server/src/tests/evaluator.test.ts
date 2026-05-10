/// <reference types="node" />
/**
 * evaluator.test.ts — Self-contained smoke tests for the evaluation pipeline.
 *
 * Run with:  npx ts-node src/tests/evaluator.test.ts
 *
 * Tests verify that:
 *  1. Correct JS solutions pass all test cases
 *  2. Buggy/starter code fails
 *  3. Hollow-shell code (body deleted) fails
 *  4. Main-code judge doesn't false-positive on deleted function bodies
 */

/* eslint-disable @typescript-eslint/no-var-requires */
import * as assert from 'assert';
import { runTestCases } from '../services/taskRunner.service';
import { judgeMainCode, detectStubBody } from '../services/mainCodeJudge.service';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ❌ ${name}\n     ${msg}`);
    failed++;
  }
}

// ─── JS Runner Tests ──────────────────────────────────────────────────────────
console.log('\n── JS Runner ──────────────────────────────────────────────────');

test('sumArray: correct solution passes', () => {
  const code = `function sumArray(arr) { let t = 0; for (let i = 0; i < arr.length; i++) t += arr[i]; return t; }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '[1,2,3,4,5]', expectedOutput: '15' },
    { input: '[10]', expectedOutput: '10' },
    { input: '[]', expectedOutput: '0' },
  ]);
  assert.strictEqual(allPassed, true, 'correct sumArray should pass');
});

test('sumArray: buggy starter code fails', () => {
  const code = `function sumArray(arr) { let t = 0; for (let i = 0; i < arr.length - 1; i++) t += arr[i]; return t; }`;
  const { allPassed, verdicts } = runTestCases('javascript', code, [
    { input: '[1,2,3,4,5]', expectedOutput: '15' },
  ]);
  assert.strictEqual(allPassed, false, `buggy sumArray should fail; got: ${verdicts[0]?.actual}`);
});

test('factorial: base case fix passes', () => {
  const code = `function factorial(n) { if (n === 0) return 1; return n * factorial(n - 1); }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '0', expectedOutput: '1' },
    { input: '5', expectedOutput: '120' },
    { input: '1', expectedOutput: '1' },
  ]);
  assert.strictEqual(allPassed, true);
});

test('factorial: buggy base case fails on n=0', () => {
  const code = `function factorial(n) { if (n === 0) return 0; return n * factorial(n - 1); }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '0', expectedOutput: '1' },
  ]);
  assert.strictEqual(allPassed, false);
});

test('isPalindrome: correct solution passes including edge cases', () => {
  const code = `function isPalindrome(str) { const c = str.toLowerCase().replace(/[^a-z0-9]/g,''); return c === c.split('').reverse().join(''); }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '"racecar"', expectedOutput: 'true' },
    { input: '"hello"', expectedOutput: 'false' },
    { input: '"A man a plan a canal Panama"', expectedOutput: 'true' },
    { input: '""', expectedOutput: 'true' },
  ]);
  assert.strictEqual(allPassed, true);
});

test('addProperty (spread): correct solution passes', () => {
  const code = `function addProperty(obj, key, value) { return { ...obj, [key]: value }; }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '[{"a":1},"b",2]', expectedOutput: '{"a":1,"b":2}', spread: true },
    { input: '[{},"x",42]', expectedOutput: '{"x":42}', spread: true },
  ]);
  assert.strictEqual(allPassed, true, 'addProperty spread should pass');
});

test('addProperty (spread): mutating starter code fails', () => {
  const code = `function addProperty(obj, key, value) { obj[key] = value; return obj; }`;
  // Mutation is functionally correct output-wise, so this tests correct output
  // The real mutation test would need two separate calls — so we verify the output is right
  const { allPassed } = runTestCases('javascript', code, [
    { input: '[{"a":1},"b",2]', expectedOutput: '{"a":1,"b":2}', spread: true },
  ]);
  // Note: the mutating version produces the same output, so both pass the output check.
  // The distinction (mutation vs no mutation) can't be tested with output alone.
  // This test just verifies spread works.
  assert.strictEqual(allPassed, true, 'spread mechanism should work');
});

test('chunk (spread): correct solution passes', () => {
  const code = `function chunk(arr, size) { const r = []; for (let i = 0; i < arr.length; i += size) r.push(arr.slice(i, i+size)); return r; }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '[[1,2,3,4,5],2]', expectedOutput: '[[1,2],[3,4],[5]]', spread: true },
    { input: '[[],2]', expectedOutput: '[]', spread: true },
  ]);
  assert.strictEqual(allPassed, true);
});

test('calculateTotal (spread): correct solution passes', () => {
  const code = `function calculateTotal(items, discountPct) { const sub = items.reduce((s,i) => s + i.price * i.qty, 0); return sub - (sub * discountPct / 100); }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '[[{"price":100,"qty":2}],10]', expectedOutput: '180', spread: true },
    { input: '[[{"price":50,"qty":4}],0]', expectedOutput: '200', spread: true },
  ]);
  assert.strictEqual(allPassed, true);
});

test('calculateTotal (spread): buggy (+discount) code fails', () => {
  const code = `function calculateTotal(items, discountPct) { const sub = items.reduce((s,i) => s + i.price * i.qty, 0); return sub + (sub * discountPct / 100); }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '[[{"price":100,"qty":2}],10]', expectedOutput: '180', spread: true },
  ]);
  assert.strictEqual(allPassed, false);
});

test('sortByAge: correct descending sort passes', () => {
  const code = `function sortByAge(users) { return [...users].sort((a,b) => b.age - a.age); }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '[{"age":3},{"age":1},{"age":2}]', expectedOutput: '[{"age":3},{"age":2},{"age":1}]' },
  ]);
  assert.strictEqual(allPassed, true);
});

test('zip (spread): correct solution passes', () => {
  const code = `function zip(a, b) { const len = Math.min(a.length, b.length); const r = []; for (let i = 0; i < len; i++) r.push([a[i], b[i]]); return r; }`;
  const { allPassed } = runTestCases('javascript', code, [
    { input: '[[1,2,3],["a","b","c"]]', expectedOutput: '[[1,"a"],[2,"b"],[3,"c"]]', spread: true },
    { input: '[[],["a","b"]]', expectedOutput: '[]', spread: true },
  ]);
  assert.strictEqual(allPassed, true);
});

test('empty code: fails gracefully', () => {
  const { allPassed } = runTestCases('javascript', '', [
    { input: '[1,2,3]', expectedOutput: '6' },
  ]);
  assert.strictEqual(allPassed, false);
});

// ─── Stub Detection Tests ─────────────────────────────────────────────────────
console.log('\n── Stub Detection (detectStubBody) ────────────────────────────');

test('hollow JS function detected as stub', () => {
  const code = `function addReview(store, id, uid, rating, text) {\n  // your code here\n}`;
  const result = detectStubBody(code, ['addReview']);
  assert.strictEqual(result, 'addReview', 'stub comment should be detected');
});

test('implemented JS function not flagged as stub', () => {
  const code = `function addReview(store, id, uid, rating, text) {\n  const product = store.products.find(p => p.id === id);\n  if (!product) return;\n  product.reviews.push({ uid, rating, text });\n  const total = product.reviews.reduce((s, r) => s + r.rating, 0);\n  product.avgRating = total / product.reviews.length;\n}`;
  const result = detectStubBody(code, ['addReview']);
  assert.strictEqual(result, null, 'implemented function should not be flagged');
});

test('empty function body detected as stub', () => {
  const code = `function sumArray(arr) {}`;
  const result = detectStubBody(code, ['sumArray']);
  assert.strictEqual(result, 'sumArray', 'empty body should be flagged');
});

test('Python stub with pass detected', () => {
  const code = `def get_completion_stats(tasks):\n    pass`;
  const result = detectStubBody(code, ['get_completion_stats']);
  assert.strictEqual(result, 'get_completion_stats', 'Python pass stub should be detected');
});

test('Python stub with comment detected', () => {
  const code = `def binary_search(arr, target):\n    # your code here\n    pass`;
  const result = detectStubBody(code, ['binary_search']);
  assert.strictEqual(result, 'binary_search', 'Python comment stub should be detected');
});

test('Python implemented function not flagged', () => {
  const code = `def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1`;
  const result = detectStubBody(code, ['binary_search']);
  assert.strictEqual(result, null, 'Python implemented function should not be flagged');
});

// ─── Main Code Judge Integration Tests ───────────────────────────────────────
console.log('\n── Main Code Judge (false-positive guard) ─────────────────────');

const SAMPLE_MAIN_CODE_CORRECT = `
function addToCart(store, productId, quantity) {
  const product = store.products.find(p => p.id === productId);
  if (!product) return;
  if (product.stock < quantity) return;
  store.cart.push({ productId, quantity });
  product.stock -= quantity;
}
function calculateCartTotal(store, discountPct) {
  const subtotal = store.cart.reduce((s, item) => {
    const product = store.products.find(p => p.id === item.productId);
    return s + (product?.price ?? 0) * item.quantity;
  }, 0);
  const discountAmount = subtotal * discountPct / 100;
  return subtotal - discountAmount;
}
function getTopProducts(store) {
  return [...store.products].sort((a, b) => b.sold - a.sold).slice(0, 5);
}
function getLowStockAlerts(store) {
  return store.products.filter(p => p.stock < 10);
}
function addReview(store, productId, userId, rating, text) {
  const product = store.products.find(p => p.id === productId);
  if (!product) return;
  product.reviews.push({ userId, rating, text });
  const total = product.reviews.reduce((s, r) => s + r.rating, 0);
  product.avgRating = total / product.reviews.length;
}
function restockProduct(store, productId, quantity) {
  const product = store.products.find(p => p.id === productId);
  if (!product) return;
  product.stock += quantity;
}
function checkout(store, userId) {
  const orderId = Math.random().toString(36).slice(2);
  store.orders.push({ orderId, userId, items: [...store.cart] });
  store.cart = [];
  return orderId;
}
`;

const SAMPLE_MAIN_CODE_HOLLOW = `
function addToCart(store, productId, quantity) {
  // your code here
}
function calculateCartTotal(store, discountPct) {}
function getTopProducts(store) {}
function getLowStockAlerts(store) {}
function addReview(store, productId, userId, rating, text) {}
function restockProduct(store, productId, quantity) {}
function checkout(store, userId) {}
`;

const JS_MAIN_TESTS = [
  { id: 'js_inv_1', description: 'addToCart: Stock check', pattern: /function addToCart[\s\S]{0,600}product\.stock\s*[<>]=?\s*quantity/ },
  { id: 'js_inv_2', description: 'calculateCartTotal: discount subtracted', pattern: /function calculateCartTotal[\s\S]{0,300}subtotal\s*-\s*discountAmount/ },
  { id: 'js_inv_4', description: 'getLowStockAlerts: < 10', pattern: /function getLowStockAlerts[\s\S]{0,200}p\.stock\s*<\s*10/ },
  { id: 'js_inv_5', description: 'addReview: correct divisor', pattern: /function addReview[\s\S]{0,500}product\.avgRating\s*=\s*total\s*\/\s*product\.reviews\.length(?!\s*-\s*1)/ },
  { id: 'js_inv_6', description: 'restockProduct: += stock', pattern: /function restockProduct[\s\S]{0,200}product\.stock\s*\+=/ },
  { id: 'js_inv_7', description: 'checkout: has orderId', pattern: /function checkout[\s\S]{0,600}\borderId\b/ },
];

const REQUIRED_IDS = ['addToCart', 'calculateCartTotal', 'getTopProducts', 'getLowStockAlerts', 'addReview', 'restockProduct', 'checkout'];

test('correct main code: all tests pass', () => {
  const result = judgeMainCode({
    language: 'javascript',
    code: SAMPLE_MAIN_CODE_CORRECT,
    requiredIdentifiers: REQUIRED_IDS,
    minContentLength: 100,
    tests: JS_MAIN_TESTS,
  });
  const failing = result.verdicts.filter(v => !v.passed).map(v => v.id);
  assert.strictEqual(result.allPassed, true, `failing tests: ${failing.join(', ')}`);
});

test('hollow shell code: stub guard blocks all tests (no false positives)', () => {
  const result = judgeMainCode({
    language: 'javascript',
    code: SAMPLE_MAIN_CODE_HOLLOW,
    requiredIdentifiers: REQUIRED_IDS,
    minContentLength: 100,
    tests: JS_MAIN_TESTS,
  });
  assert.strictEqual(result.allPassed, false, 'hollow code must not pass');
  const anyPassed = result.verdicts.some(v => v.passed);
  assert.strictEqual(anyPassed, false, 'no individual test should pass against hollow code');
});

test('deletion exploit: deleting addReview body triggers stub guard', () => {
  // This is the actual bug scenario: player deletes the body but keeps the declaration
  const deletedBodyCode = SAMPLE_MAIN_CODE_CORRECT.replace(
    /function addReview[\s\S]*?\n\}/,
    'function addReview(store, productId, userId, rating, text) {\n  // your code here\n}'
  );
  const result = judgeMainCode({
    language: 'javascript',
    code: deletedBodyCode,
    requiredIdentifiers: REQUIRED_IDS,
    minContentLength: 100,
    tests: JS_MAIN_TESTS,
  });
  assert.strictEqual(result.allPassed, false, 'deleted body must not pass');
});

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(56)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\nSome tests failed. Review errors above.');
  process.exit(1);
} else {
  console.log('\nAll tests passed ✅');
}
