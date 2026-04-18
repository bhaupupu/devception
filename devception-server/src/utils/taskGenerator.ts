import { ITaskDoc } from '../models/Game.model';
import { randomUUID } from 'crypto';

export interface MainTestCase {
  id: string;
  description: string;
  pattern: RegExp;
}

// ---- JavaScript task bank ----
const JS_TASKS: Omit<ITaskDoc, '_id' | 'assignedTo' | 'completedBy' | 'isCompleted'>[] = [
  {
    title: 'Fix: Off-by-one in sumArray',
    description: 'The sumArray function skips the last element. Fix the loop condition.',
    language: 'javascript', difficulty: 'easy', type: 'fix-bug',
    starterCode: `function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length - 1; i++) {\n    total += arr[i];\n  }\n  return total;\n}`,
    solutionCode: `function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}`,
    testCases: [{ input: '[1,2,3,4,5]', expectedOutput: '15' }],
    progressValue: 10,
  },
  {
    title: 'Complete: isPalindrome',
    description: 'Implement isPalindrome(str) — returns true if reads same forwards and backwards.',
    language: 'javascript', difficulty: 'easy', type: 'complete-function',
    starterCode: `function isPalindrome(str) {\n  // your code here\n}`,
    solutionCode: `function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}`,
    testCases: [{ input: '"racecar"', expectedOutput: 'true' }],
    progressValue: 10,
  },
  {
    title: 'Fix: Broken factorial base case',
    description: 'The factorial function returns 0 for n=0 instead of 1. Fix the base case.',
    language: 'javascript', difficulty: 'easy', type: 'fix-bug',
    starterCode: `function factorial(n) {\n  if (n === 0) return 0;\n  return n * factorial(n - 1);\n}`,
    solutionCode: `function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}`,
    testCases: [{ input: '5', expectedOutput: '120' }],
    progressValue: 8,
  },
  {
    title: 'Complete: flattenArray',
    description: 'Implement flattenArray(arr) that flattens a nested array one level deep.',
    language: 'javascript', difficulty: 'medium', type: 'complete-function',
    starterCode: `function flattenArray(arr) {\n  // your code here\n}`,
    solutionCode: `function flattenArray(arr) {\n  return arr.reduce((acc, val) => acc.concat(val), []);\n}`,
    testCases: [{ input: '[[1,2],[3,4]]', expectedOutput: '[1,2,3,4]' }],
    progressValue: 12,
  },
  {
    title: 'Fix: Promise swallows error',
    description: 'fetchData catches the error but never rethrows. Fix so callers can catch it.',
    language: 'javascript', difficulty: 'medium', type: 'fix-bug',
    starterCode: `async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    return await res.json();\n  } catch (e) {\n    console.error(e);\n  }\n}`,
    solutionCode: `async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    return await res.json();\n  } catch (e) {\n    console.error(e);\n    throw e;\n  }\n}`,
    testCases: [{ input: '"bad-url"', expectedOutput: 'throws' }],
    progressValue: 12,
  },
  {
    title: 'Complete: debounce',
    description: 'Implement debounce(fn, delay) — delays execution until delay ms after last call.',
    language: 'javascript', difficulty: 'hard', type: 'complete-function',
    starterCode: `function debounce(fn, delay) {\n  // your code here\n}`,
    solutionCode: `function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}`,
    testCases: [{ input: 'rapid calls', expectedOutput: 'fires once' }],
    progressValue: 15,
  },
  {
    title: 'Fix: Object mutation bug',
    description: 'addProperty modifies the original object. Return a new object instead.',
    language: 'javascript', difficulty: 'easy', type: 'fix-bug',
    starterCode: `function addProperty(obj, key, value) {\n  obj[key] = value;\n  return obj;\n}`,
    solutionCode: `function addProperty(obj, key, value) {\n  return { ...obj, [key]: value };\n}`,
    testCases: [{ input: '{a:1}, "b", 2', expectedOutput: '{a:1,b:2}' }],
    progressValue: 8,
  },
  {
    title: 'Complete: groupBy',
    description: 'Implement groupBy(arr, key) that groups objects by a property key.',
    language: 'javascript', difficulty: 'medium', type: 'complete-function',
    starterCode: `function groupBy(arr, key) {\n  // your code here\n}`,
    solutionCode: `function groupBy(arr, key) {\n  return arr.reduce((acc, item) => {\n    const group = item[key];\n    if (!acc[group]) acc[group] = [];\n    acc[group].push(item);\n    return acc;\n  }, {});\n}`,
    testCases: [{ input: '[{t:"a"},{t:"b"},{t:"a"}], "t"', expectedOutput: '{a:[...],b:[...]}' }],
    progressValue: 14,
  },
  {
    title: 'Complete: memoize',
    description: 'Implement memoize(fn) that caches results of expensive function calls.',
    language: 'javascript', difficulty: 'hard', type: 'complete-function',
    starterCode: `function memoize(fn) {\n  // your code here\n}`,
    solutionCode: `function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}`,
    testCases: [{ input: 'fib(10)', expectedOutput: '55' }],
    progressValue: 15,
  },
  {
    title: 'Fix: Wrong cart total',
    description: 'calculateTotal adds the discount instead of subtracting it. Fix the formula.',
    language: 'javascript', difficulty: 'easy', type: 'fix-bug',
    starterCode: `function calculateTotal(items, discountPct) {\n  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);\n  return sub + (sub * discountPct / 100); // BUG\n}`,
    solutionCode: `function calculateTotal(items, discountPct) {\n  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);\n  return sub - (sub * discountPct / 100);\n}`,
    testCases: [{ input: '[{price:100,qty:2}], 10', expectedOutput: '180' }],
    progressValue: 10,
  },
  {
    title: 'Complete: chunk',
    description: 'Implement chunk(arr, size) that splits an array into chunks of given size.',
    language: 'javascript', difficulty: 'medium', type: 'complete-function',
    starterCode: `function chunk(arr, size) {\n  // your code here\n}`,
    solutionCode: `function chunk(arr, size) {\n  const result = [];\n  for (let i = 0; i < arr.length; i += size) {\n    result.push(arr.slice(i, i + size));\n  }\n  return result;\n}`,
    testCases: [{ input: '[1,2,3,4,5], 2', expectedOutput: '[[1,2],[3,4],[5]]' }],
    progressValue: 12,
  },
  {
    title: 'Fix: Wrong sort comparator',
    description: 'sortByAge sorts ascending but the game needs descending. Fix the comparator.',
    language: 'javascript', difficulty: 'easy', type: 'fix-bug',
    starterCode: `function sortByAge(users) {\n  return [...users].sort((a, b) => a.age - b.age);\n}`,
    solutionCode: `function sortByAge(users) {\n  return [...users].sort((a, b) => b.age - a.age);\n}`,
    testCases: [{ input: '[{age:3},{age:1},{age:2}]', expectedOutput: '[{age:3},{age:2},{age:1}]' }],
    progressValue: 8,
  },
];

// ---- Python task bank ----
const PYTHON_TASKS: Omit<ITaskDoc, '_id' | 'assignedTo' | 'completedBy' | 'isCompleted'>[] = [
  {
    title: 'Fix: List index out of range',
    description: 'get_last_element crashes on empty lists. Fix it to return None.',
    language: 'python', difficulty: 'easy', type: 'fix-bug',
    starterCode: `def get_last_element(lst):\n    return lst[-1]`,
    solutionCode: `def get_last_element(lst):\n    if not lst:\n        return None\n    return lst[-1]`,
    testCases: [{ input: '[]', expectedOutput: 'None' }],
    progressValue: 8,
  },
  {
    title: 'Complete: count_vowels',
    description: 'Implement count_vowels(s) that returns the number of vowels in a string.',
    language: 'python', difficulty: 'easy', type: 'complete-function',
    starterCode: `def count_vowels(s):\n    # your code here\n    pass`,
    solutionCode: `def count_vowels(s):\n    return sum(1 for c in s.lower() if c in 'aeiou')`,
    testCases: [{ input: '"hello"', expectedOutput: '2' }],
    progressValue: 8,
  },
  {
    title: 'Fix: Mutable default argument',
    description: 'append_to accumulates state across calls due to mutable default. Fix it.',
    language: 'python', difficulty: 'medium', type: 'fix-bug',
    starterCode: `def append_to(element, to=[]):\n    to.append(element)\n    return to`,
    solutionCode: `def append_to(element, to=None):\n    if to is None:\n        to = []\n    to.append(element)\n    return to`,
    testCases: [{ input: '1', expectedOutput: '[1]' }],
    progressValue: 12,
  },
  {
    title: 'Complete: flatten_dict',
    description: 'Implement flatten_dict(d) that flattens a nested dict with dot-notation keys.',
    language: 'python', difficulty: 'hard', type: 'complete-function',
    starterCode: `def flatten_dict(d, prefix=""):\n    # your code here\n    pass`,
    solutionCode: `def flatten_dict(d, prefix=""):\n    result = {}\n    for k, v in d.items():\n        key = f"{prefix}.{k}" if prefix else k\n        if isinstance(v, dict):\n            result.update(flatten_dict(v, key))\n        else:\n            result[key] = v\n    return result`,
    testCases: [{ input: '{"a":{"b":1}}', expectedOutput: '{"a.b":1}' }],
    progressValue: 18,
  },
  {
    title: 'Fix: Overdue check is backwards',
    description: 'is_overdue returns True when the task is NOT overdue. Fix the comparison.',
    language: 'python', difficulty: 'easy', type: 'fix-bug',
    starterCode: `from datetime import datetime\ndef is_overdue(due_date):\n    return due_date > datetime.now()  # BUG`,
    solutionCode: `from datetime import datetime\ndef is_overdue(due_date):\n    return due_date < datetime.now()`,
    testCases: [{ input: 'past date', expectedOutput: 'True' }],
    progressValue: 8,
  },
  {
    title: 'Complete: group_by_key',
    description: 'Implement group_by_key(items, key) that groups a list of dicts by a field.',
    language: 'python', difficulty: 'medium', type: 'complete-function',
    starterCode: `def group_by_key(items, key):\n    # your code here\n    pass`,
    solutionCode: `def group_by_key(items, key):\n    result = {}\n    for item in items:\n        k = item.get(key)\n        result.setdefault(k, []).append(item)\n    return result`,
    testCases: [{ input: '[{"t":"a"},{"t":"b"},{"t":"a"}], "t"', expectedOutput: '{"a":[...]}' }],
    progressValue: 14,
  },
  {
    title: 'Fix: Wrong stats denominator',
    description: 'get_avg divides by len-1 instead of len. Fix the denominator.',
    language: 'python', difficulty: 'medium', type: 'fix-bug',
    starterCode: `def get_avg(nums):\n    if not nums:\n        return 0\n    return sum(nums) / (len(nums) - 1)  # BUG`,
    solutionCode: `def get_avg(nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)`,
    testCases: [{ input: '[1,2,3]', expectedOutput: '2.0' }],
    progressValue: 10,
  },
  {
    title: 'Complete: binary_search',
    description: 'Implement binary_search(arr, target) returning index or -1 if not found.',
    language: 'python', difficulty: 'hard', type: 'complete-function',
    starterCode: `def binary_search(arr, target):\n    # your code here\n    pass`,
    solutionCode: `def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1`,
    testCases: [{ input: '[1,3,5,7,9], 5', expectedOutput: '2' }],
    progressValue: 15,
  },
];

// ---- C++ task bank ----
const CPP_TASKS: Omit<ITaskDoc, '_id' | 'assignedTo' | 'completedBy' | 'isCompleted'>[] = [
  {
    title: 'Fix: Wrong sort direction',
    description: 'sortDescending sorts ascending. Fix the comparator to sort in descending order.',
    language: 'cpp', difficulty: 'easy', type: 'fix-bug',
    starterCode: `#include <vector>\n#include <algorithm>\nvoid sortDescending(std::vector<int>& v) {\n    std::sort(v.begin(), v.end()); // BUG\n}`,
    solutionCode: `#include <vector>\n#include <algorithm>\nvoid sortDescending(std::vector<int>& v) {\n    std::sort(v.begin(), v.end(), std::greater<int>());\n}`,
    testCases: [{ input: '{5,2,8,1}', expectedOutput: '{8,5,2,1}' }],
    progressValue: 8,
  },
  {
    title: 'Complete: isPrime',
    description: 'Implement isPrime(n) that returns true if n is a prime number.',
    language: 'cpp', difficulty: 'easy', type: 'complete-function',
    starterCode: `bool isPrime(int n) {\n    // your code here\n    return false;\n}`,
    solutionCode: `bool isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++)\n        if (n % i == 0) return false;\n    return true;\n}`,
    testCases: [{ input: '7', expectedOutput: 'true' }],
    progressValue: 10,
  },
  {
    title: 'Fix: Off-by-one in loop',
    description: 'sumVector skips the last element. Fix the loop bound.',
    language: 'cpp', difficulty: 'easy', type: 'fix-bug',
    starterCode: `int sumVector(const std::vector<int>& v) {\n    int sum = 0;\n    for (int i = 0; i < (int)v.size() - 1; i++) // BUG\n        sum += v[i];\n    return sum;\n}`,
    solutionCode: `int sumVector(const std::vector<int>& v) {\n    int sum = 0;\n    for (int i = 0; i < (int)v.size(); i++)\n        sum += v[i];\n    return sum;\n}`,
    testCases: [{ input: '{1,2,3,4,5}', expectedOutput: '15' }],
    progressValue: 8,
  },
  {
    title: 'Complete: reverseString',
    description: 'Implement reverseString(s) that reverses a string in-place.',
    language: 'cpp', difficulty: 'easy', type: 'complete-function',
    starterCode: `#include <string>\nvoid reverseString(std::string& s) {\n    // your code here\n}`,
    solutionCode: `#include <string>\nvoid reverseString(std::string& s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) std::swap(s[l++], s[r--]);\n}`,
    testCases: [{ input: '"hello"', expectedOutput: '"olleh"' }],
    progressValue: 10,
  },
  {
    title: 'Fix: Null pointer dereference',
    description: 'getLength crashes on nullptr. Add a null check before dereferencing.',
    language: 'cpp', difficulty: 'medium', type: 'fix-bug',
    starterCode: `#include <string>\nint getLength(const std::string* s) {\n    return s->length(); // BUG: no null check\n}`,
    solutionCode: `#include <string>\nint getLength(const std::string* s) {\n    if (!s) return 0;\n    return s->length();\n}`,
    testCases: [{ input: 'nullptr', expectedOutput: '0' }],
    progressValue: 12,
  },
  {
    title: 'Complete: countOccurrences',
    description: 'Implement countOccurrences(v, target) that counts how many times target appears in v.',
    language: 'cpp', difficulty: 'medium', type: 'complete-function',
    starterCode: `#include <vector>\nint countOccurrences(const std::vector<int>& v, int target) {\n    // your code here\n    return 0;\n}`,
    solutionCode: `#include <vector>\nint countOccurrences(const std::vector<int>& v, int target) {\n    int count = 0;\n    for (int x : v) if (x == target) count++;\n    return count;\n}`,
    testCases: [{ input: '{1,2,2,3,2}, 2', expectedOutput: '3' }],
    progressValue: 12,
  },
  {
    title: 'Fix: Wrong average formula',
    description: 'calcAverage divides by size-1. Fix to divide by the correct count.',
    language: 'cpp', difficulty: 'medium', type: 'fix-bug',
    starterCode: `double calcAverage(const std::vector<int>& v) {\n    if (v.empty()) return 0;\n    double sum = 0;\n    for (int x : v) sum += x;\n    return sum / (v.size() - 1); // BUG\n}`,
    solutionCode: `double calcAverage(const std::vector<int>& v) {\n    if (v.empty()) return 0;\n    double sum = 0;\n    for (int x : v) sum += x;\n    return sum / v.size();\n}`,
    testCases: [{ input: '{2,4,6}', expectedOutput: '4.0' }],
    progressValue: 10,
  },
  {
    title: 'Complete: removeDuplicates',
    description: 'Implement removeDuplicates(v) that removes duplicate values from a sorted vector.',
    language: 'cpp', difficulty: 'hard', type: 'complete-function',
    starterCode: `#include <vector>\nstd::vector<int> removeDuplicates(std::vector<int> v) {\n    // your code here (v is sorted)\n    return v;\n}`,
    solutionCode: `#include <vector>\n#include <algorithm>\nstd::vector<int> removeDuplicates(std::vector<int> v) {\n    v.erase(std::unique(v.begin(), v.end()), v.end());\n    return v;\n}`,
    testCases: [{ input: '{1,1,2,3,3,4}', expectedOutput: '{1,2,3,4}' }],
    progressValue: 15,
  },
  {
    title: 'Fix: Stack overflow in fibonacci',
    description: 'fib(0) hits infinite recursion. Add the missing base case.',
    language: 'cpp', difficulty: 'easy', type: 'fix-bug',
    starterCode: `int fib(int n) {\n    if (n == 1) return 1; // BUG: missing n==0 case\n    return fib(n-1) + fib(n-2);\n}`,
    solutionCode: `int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2);\n}`,
    testCases: [{ input: '6', expectedOutput: '8' }],
    progressValue: 10,
  },
  {
    title: 'Complete: maxSubarraySum',
    description: 'Implement maxSubarraySum(v) using Kadane\'s algorithm.',
    language: 'cpp', difficulty: 'hard', type: 'complete-function',
    starterCode: `#include <vector>\nint maxSubarraySum(const std::vector<int>& v) {\n    // your code here (Kadane's algorithm)\n    return 0;\n}`,
    solutionCode: `#include <vector>\nint maxSubarraySum(const std::vector<int>& v) {\n    int maxSum = v[0], cur = v[0];\n    for (int i = 1; i < (int)v.size(); i++) {\n        cur = std::max(v[i], cur + v[i]);\n        maxSum = std::max(maxSum, cur);\n    }\n    return maxSum;\n}`,
    testCases: [{ input: '{-2,1,-3,4,-1,2,1,-5,4}', expectedOutput: '6' }],
    progressValue: 18,
  },
];

// ---- Large shared code templates ----
const JS_MAIN_CODE = `// ============================================================
//  DEVCEPTION CHALLENGE — Inventory Management System
//  Fix all bugs marked "// BUG" and complete all TODOs!
// ============================================================

class Product {
  constructor(id, name, category, price, stock) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.sold = 0;
    this.reviews = [];
    this.avgRating = 0;
    this.createdAt = Date.now();
  }
}

class Cart {
  constructor(userId) {
    this.userId = userId;
    this.items = [];   // { productId, quantity, price }
    this.discount = 0;
    this.createdAt = Date.now();
  }
}

// BUG: No stock check — should return false if product.stock < quantity
function addToCart(store, cart, productId, quantity) {
  const product = store.products.find(p => p.id === productId);
  if (!product) return { success: false, error: 'Product not found' };

  const existing = cart.items.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price: product.price });
  }
  return { success: true };
}

// BUG: Discount is added, not subtracted
function calculateCartTotal(cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (cart.discount / 100);
  return subtotal + discountAmount; // BUG: should be subtotal - discountAmount
}

// TODO: Implement checkout
// 1. Check all items have enough stock
// 2. Deduct stock, increment product.sold for each item
// 3. Clear cart.items
// 4. Return { success: true, orderId, total } or { success: false, error }
function checkout(store, cart) {
  // your code here
}

// BUG: Mutates original array — use slice/spread
function getTopProducts(store, limit = 5) {
  return store.products.sort((a, b) => b.sold - a.sold).slice(0, limit);
}

// TODO: Implement searchProducts
// Search by name or category (case-insensitive partial match)
// Return matching products array
function searchProducts(store, query) {
  // your code here
}

// BUG: Threshold wrong — low stock should be stock < 10, not stock <= 0
function getLowStockAlerts(store) {
  return store.products.filter(p => p.stock <= 0);
}

// TODO: Implement applyDiscount
// Valid codes: { 'SAVE10': 10, 'SAVE20': 20, 'HALFOFF': 50 }
// Set cart.discount to the percentage value
// Return { success, discountPct }
function applyDiscount(cart, couponCode) {
  // your code here
}

// BUG: avgRating divides by (reviews.length - 1)
function addReview(store, productId, userId, rating, comment) {
  const product = store.products.find(p => p.id === productId);
  if (!product) return false;
  if (rating < 1 || rating > 5) return false;

  product.reviews.push({ userId, rating, comment, date: Date.now() });
  const total = product.reviews.reduce((s, r) => s + r.rating, 0);
  product.avgRating = total / (product.reviews.length - 1); // BUG
  return true;
}

// TODO: Implement getRecommendations
// Return up to 'limit' products in the same category as productId
// Sorted by avgRating descending, excluding the product itself
function getRecommendations(store, productId, limit = 3) {
  // your code here
}

// BUG: Adds quantity to product.sold instead of product.stock
function restockProduct(store, productId, quantity) {
  const product = store.products.find(p => p.id === productId);
  if (!product || quantity <= 0) return false;
  product.sold += quantity; // BUG: should be product.stock
  return true;
}

// TODO: Implement generateSalesReport
// Return { totalRevenue, avgProductRating, lowStockCount, topCategory }
// totalRevenue = sum of (product.sold * product.price) for all products
function generateSalesReport(store) {
  // your code here
}

// ---- Helper functions (correct — do not modify) ----
function createStore(name) {
  return { name, products: [], revenue: 0 };
}

function addProduct(store, name, category, price, stock) {
  const id = 'prod_' + (store.products.length + 1);
  const product = new Product(id, name, category, price, stock);
  store.products.push(product);
  return product;
}

function removeFromCart(cart, productId) {
  cart.items = cart.items.filter(i => i.productId !== productId);
}

// ---- Test it out ----
const store = createStore('Devception Shop');
addProduct(store, 'Laptop', 'electronics', 999, 5);
addProduct(store, 'Keyboard', 'electronics', 79, 20);
addProduct(store, 'Desk Lamp', 'office', 39, 15);
addProduct(store, 'Mouse Pad', 'office', 12, 50);

const cart = new Cart('user_1');
addToCart(store, cart, 'prod_1', 1);
addToCart(store, cart, 'prod_2', 2);
applyDiscount(cart, 'SAVE10');
console.log('Total:', calculateCartTotal(cart));
console.log('Checkout:', checkout(store, cart));
console.log('Top products:', getTopProducts(store, 3));
`;

const PYTHON_MAIN_CODE = `# ============================================================
#  DEVCEPTION CHALLENGE — Task Manager System
#  Fix all bugs marked "# BUG" and complete all TODOs!
# ============================================================

from datetime import datetime, timedelta

class Task:
    def __init__(self, task_id, title, description, priority, days_until_due, assignee=None):
        self.id = task_id
        self.title = title
        self.description = description
        self.priority = priority      # 'low', 'medium', 'high', 'critical'
        self.due_date = datetime.now() + timedelta(days=days_until_due)
        self.assignee = assignee
        self.completed = False
        self.completed_at = None
        self.subtasks = []
        self.tags = []
        self.time_spent = 0           # minutes
        self.created_at = datetime.now()

# BUG: Returns tasks with priority > 'medium' using wrong comparison
# Priority order: low(0) < medium(1) < high(2) < critical(3)
def get_high_priority_tasks(manager):
    order = ['low', 'medium', 'high', 'critical']
    return [t for t in manager['tasks']
            if order.index(t.priority) > order.index('medium')]  # BUG: should be >= 'high' index (2)

# TODO: Implement complete_task
# Find task by id, set completed=True, set completed_at=datetime.now()
# Also complete all subtasks
# Return True on success, False if not found
def complete_task(manager, task_id):
    pass  # your code here

# BUG: Overdue check is backwards — due_date > now means NOT overdue
def get_overdue_tasks(manager):
    now = datetime.now()
    return [t for t in manager['tasks']
            if t.due_date > now and not t.completed]  # BUG: should be t.due_date < now

# TODO: Implement assign_task
# Find task by id, set task.assignee = user_id
# Return True on success, False if task not found
def assign_task(manager, task_id, user_id):
    pass  # your code here

# BUG: Sets time_spent instead of adding to it
def log_time(manager, task_id, minutes):
    task = next((t for t in manager['tasks'] if t.id == task_id), None)
    if not task:
        return False
    task.time_spent = minutes  # BUG: should be += minutes
    return True

# TODO: Implement add_subtask
# Find parent task by parent_id
# Create a new Task object and append to parent.subtasks
# Return the new subtask, or None if parent not found
def add_subtask(manager, parent_id, title, description):
    pass  # your code here

# BUG: Off-by-one in completion rate denominator
def get_completion_stats(manager):
    total = len(manager['tasks'])
    if total == 0:
        return {'rate': 0, 'completed': 0, 'pending': 0}
    completed = sum(1 for t in manager['tasks'] if t.completed)
    rate = (completed / (total - 1)) * 100 if total > 1 else 0  # BUG: divide by total
    return {'rate': round(rate, 2), 'completed': completed, 'pending': total - completed}

# TODO: Implement search_tasks
# Search title and description (case-insensitive)
# Return list of matching Task objects
def search_tasks(manager, query):
    pass  # your code here

# BUG: Filters OUT tasks with the tag instead of keeping them
def filter_by_tag(manager, tag):
    return [t for t in manager['tasks'] if tag not in t.tags]  # BUG: should be 'in'

# TODO: Implement get_workload_report
# Return dict: { assignee_id: { 'task_count': int, 'total_time': int, 'overdue_count': int } }
def get_workload_report(manager):
    pass  # your code here

# BUG: Extends by hours instead of days
def extend_due_date(manager, task_id, extra_days):
    task = next((t for t in manager['tasks'] if t.id == task_id), None)
    if not task or task.completed:
        return False
    task.due_date += timedelta(hours=extra_days)  # BUG: should be days=extra_days
    return True

# ---- Helper functions (correct — do not modify) ----
def create_manager():
    return {'tasks': [], 'users': {}, '_next_id': 1}

def add_user(manager, user_id, name):
    manager['users'][user_id] = {'name': name}

def create_task(manager, title, description, priority='medium', days=7, assignee=None):
    tid = f"task_{manager['_next_id']}"
    manager['_next_id'] += 1
    task = Task(tid, title, description, priority, days, assignee)
    manager['tasks'].append(task)
    return task

def add_tag(task, tag):
    if tag not in task.tags:
        task.tags.append(tag)

# ---- Test it out ----
mgr = create_manager()
add_user(mgr, 'u1', 'Alice')
add_user(mgr, 'u2', 'Bob')

t1 = create_task(mgr, 'Fix login bug', 'Auth token expires too soon', 'critical', 1, 'u1')
t2 = create_task(mgr, 'Write docs', 'Document the API endpoints', 'low', 14, 'u2')
t3 = create_task(mgr, 'Code review', 'Review PR #42', 'high', 3)
add_tag(t1, 'bug')
add_tag(t1, 'auth')

assign_task(mgr, t3.id, 'u1')
log_time(mgr, t1.id, 30)
complete_task(mgr, t2.id)

print('High priority:', [t.title for t in get_high_priority_tasks(mgr)])
print('Overdue:', [t.title for t in get_overdue_tasks(mgr)])
print('Stats:', get_completion_stats(mgr))
`;

const CPP_MAIN_CODE = `// ============================================================
//  DEVCEPTION CHALLENGE — Bank Account System
//  Fix all bugs marked "// BUG" and complete all TODOs!
// ============================================================

#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <algorithm>
#include <ctime>
#include <stdexcept>
using namespace std;

struct Transaction {
    string id, type, description, targetId;
    double amount;
    time_t timestamp;
    Transaction(string id, string type, double amt, string desc="", string tgt="")
        : id(id), type(type), amount(amt), description(desc),
          targetId(tgt), timestamp(time(nullptr)) {}
};

class Account {
public:
    string id, owner, type;
    double balance, interestRate, overdraftLimit;
    bool frozen;
    vector<Transaction> transactions;

    Account(string id, string owner, string type, double initial = 0.0)
        : id(id), owner(owner), type(type), balance(initial), frozen(false), overdraftLimit(0.0) {
        interestRate = (type == "savings") ? 0.035 : (type == "investment") ? 0.07 : 0.001;
    }

    // BUG: Does not check if account is frozen
    bool deposit(double amount, const string& desc = "deposit") {
        if (amount <= 0) return false;
        balance += amount;
        transactions.push_back(Transaction("t" + to_string(transactions.size()), "deposit", amount, desc));
        return true;
    }

    // BUG: Overdraft check inverted — should be (balance + overdraftLimit >= amount)
    bool withdraw(double amount, const string& desc = "withdrawal") {
        if (amount <= 0 || frozen) return false;
        if (balance + overdraftLimit <= amount) return false; // BUG: wrong comparison
        balance -= amount;
        transactions.push_back(Transaction("t" + to_string(transactions.size()), "withdrawal", amount, desc));
        return true;
    }
};

class Bank {
private:
    map<string, Account*> accounts;
    int nextId = 1000;

public:
    string createAccount(const string& owner, const string& type, double initial = 0.0) {
        string id = "ACC" + to_string(nextId++);
        accounts[id] = new Account(id, owner, type, initial);
        return id;
    }

    Account* getAccount(const string& id) {
        auto it = accounts.find(id);
        return (it != accounts.end()) ? it->second : nullptr;
    }

    // BUG: Deducts from source before checking balance
    bool transfer(const string& fromId, const string& toId, double amount) {
        Account* from = getAccount(fromId);
        Account* to   = getAccount(toId);
        if (!from || !to || amount <= 0) return false;
        if (from->frozen || to->frozen) return false;

        from->balance -= amount; // BUG: check first!
        if (from->balance < -from->overdraftLimit) {
            from->balance += amount; // rollback
            return false;
        }
        to->balance += amount;
        from->transactions.push_back(Transaction("t"+to_string(from->transactions.size()), "transfer", amount, "out", toId));
        to->transactions.push_back(Transaction("t"+to_string(to->transactions.size()), "transfer", amount, "in", fromId));
        return true;
    }

    // TODO: Implement applyInterest
    // For every savings/investment account: balance += balance * interestRate / 12
    void applyInterest() {
        // your code here
    }

    // BUG: avgBalance divides by (count - 1) instead of count
    map<string, double> getStats() {
        double total = 0; int count = 0;
        for (auto& p : accounts) { total += p.second->balance; count++; }
        return {
            {"totalAssets", total},
            {"avgBalance",  count > 0 ? total / (count - 1) : 0}, // BUG
            {"accountCount", (double)count}
        };
    }

    // TODO: Implement freezeAccount / unfreezeAccount
    // Set account->frozen = true / false, return false if not found
    bool freezeAccount(const string& id) {
        // your code here
        return false;
    }
    bool unfreezeAccount(const string& id) {
        // your code here
        return false;
    }

    // BUG: Only returns withdrawals — should return all transaction types
    vector<Transaction> getStatement(const string& id, int lastN = 10) {
        Account* acc = getAccount(id);
        if (!acc) return {};
        vector<Transaction> result;
        for (const auto& t : acc->transactions)
            if (t.type == "withdrawal") result.push_back(t); // BUG
        if ((int)result.size() > lastN)
            result = vector<Transaction>(result.end() - lastN, result.end());
        return result;
    }

    // TODO: Implement findRichestAccount
    // Return pointer to the Account with the highest balance, or nullptr if empty
    Account* findRichestAccount() {
        // your code here
        return nullptr;
    }

    // TODO: Implement getAccountsByOwner
    // Return all Account* whose owner matches the given name
    vector<Account*> getAccountsByOwner(const string& owner) {
        // your code here
        return {};
    }

    // BUG: Sorts ascending — should sort descending by balance
    vector<Account*> getTopAccounts(int limit = 5) {
        vector<Account*> result;
        for (auto& p : accounts) result.push_back(p.second);
        sort(result.begin(), result.end(),
             [](Account* a, Account* b) { return a->balance < b->balance; }); // BUG
        if ((int)result.size() > limit) result.resize(limit);
        return result;
    }

    ~Bank() { for (auto& p : accounts) delete p.second; }
};

// ---- Test it out ----
int main() {
    Bank bank;
    string alice   = bank.createAccount("Alice",   "savings",    1000.0);
    string bob     = bank.createAccount("Bob",     "checking",    500.0);
    string charlie = bank.createAccount("Charlie", "investment", 5000.0);
    string alice2  = bank.createAccount("Alice",   "checking",    200.0);

    bank.transfer(alice, bob, 200.0);
    bank.applyInterest();

    auto stats = bank.getStats();
    cout << "Total Assets: $" << stats["totalAssets"] << endl;
    cout << "Avg Balance:  $" << stats["avgBalance"]  << endl;

    bank.freezeAccount(bob);
    cout << "Bob frozen: " << bank.getAccount(bob)->frozen << endl;
    bank.unfreezeAccount(bob);

    auto top = bank.getTopAccounts(3);
    cout << "Top account: " << top[0]->owner << " $" << top[0]->balance << endl;

    auto aliceAccs = bank.getAccountsByOwner("Alice");
    cout << "Alice has " << aliceAccs.size() << " account(s)" << endl;

    return 0;
}
`;

// ---- Additional JavaScript code templates ----
const JS_SOCIAL_CODE = `// ============================================================
//  DEVCEPTION CHALLENGE — Social Network System
//  Fix all bugs marked "// BUG" and complete all TODOs!
// ============================================================

class User {
  constructor(id, username, email, bio = '') {
    this.id = id;
    this.username = username;
    this.email = email;
    this.bio = bio;
    this.followers = [];
    this.following = [];
    this.posts = [];
    this.liked = new Set();
    this.createdAt = Date.now();
  }
}

class Post {
  constructor(id, authorId, content, tags = []) {
    this.id = id;
    this.authorId = authorId;
    this.content = content;
    this.tags = tags;
    this.likes = 0;
    this.comments = [];
    this.shares = 0;
    this.createdAt = Date.now();
  }
}

// BUG: Doesn't prevent duplicate follows
function followUser(network, followerId, targetId) {
  if (followerId === targetId) return { success: false, error: 'Cannot follow yourself' };
  const follower = network.users.get(followerId);
  const target = network.users.get(targetId);
  if (!follower || !target) return { success: false, error: 'User not found' };
  follower.following.push(targetId);   // BUG: no duplicate check
  target.followers.push(followerId);   // BUG: no duplicate check
  return { success: true };
}

// TODO: Implement unfollowUser
// Remove targetId from follower.following and followerId from target.followers
// Return { success, error }
function unfollowUser(network, followerId, targetId) {
  // your code here
}

// BUG: Returns ALL posts, not just from followed users + own posts
function getFeed(network, userId, limit = 20) {
  const user = network.users.get(userId);
  if (!user) return [];
  return [...network.posts.values()].slice(0, limit); // BUG: should filter by following + self
}

// TODO: Implement createPost
// Create Post, add to network.posts map and user.posts array
// Return the new post
function createPost(network, authorId, content, tags = []) {
  // your code here
}

// BUG: Allows liking the same post more than once
function likePost(network, userId, postId) {
  const user = network.users.get(userId);
  const post = network.posts.get(postId);
  if (!user || !post) return false;
  post.likes++;          // BUG: no check if user already liked
  user.liked.add(postId);
  return true;
}

// TODO: Implement addComment
// Push { commentId, authorId, text, createdAt } into post.comments
// Return the comment or null if post not found
function addComment(network, userId, postId, text) {
  // your code here
}

// BUG: Score ignores comments — should weight them
function getTrendingPosts(network, limit = 5) {
  return [...network.posts.values()]
    .sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares))  // BUG: missing + b.comments.length
    .slice(0, limit);
}

// TODO: Implement searchUsers
// Return users whose username contains the query (case-insensitive)
function searchUsers(network, query) {
  // your code here
}

// BUG: Checks following list of wrong user (direction reversed)
function isFollowing(network, userId, targetId) {
  const target = network.users.get(targetId);  // BUG: should get userId's user
  if (!target) return false;
  return target.following.includes(userId);    // BUG: wrong direction
}

// TODO: Implement getMutualFollowers
// Return array of user IDs that both userA and userB follow
function getMutualFollowers(network, userAId, userBId) {
  // your code here
}

// BUG: avgLikesPerPost divides by (posts.length - 1) instead of posts.length
function getUserStats(network, userId) {
  const user = network.users.get(userId);
  if (!user) return null;
  const posts = user.posts.map(id => network.posts.get(id)).filter(Boolean);
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
  return {
    postCount: posts.length,
    followerCount: user.followers.length,
    followingCount: user.following.length,
    avgLikesPerPost: posts.length > 1 ? totalLikes / (posts.length - 1) : 0, // BUG
  };
}

// TODO: Implement deletePost
// Remove from network.posts map and from user.posts array
// Return true on success, false if not found or not author
function deletePost(network, userId, postId) {
  // your code here
}

// ---- Helper functions (correct — do not modify) ----
function createNetwork() {
  return { users: new Map(), posts: new Map(), _nextPostId: 1 };
}
function createUser(network, username, email, bio = '') {
  const id = 'u_' + username.toLowerCase();
  const user = new User(id, username, email, bio);
  network.users.set(id, user);
  return user;
}

// ---- Test it out ----
const net = createNetwork();
const alice = createUser(net, 'alice', 'alice@code.dev', 'Full-stack dev');
const bob   = createUser(net, 'bob',   'bob@code.dev',   'DevOps engineer');
const carol = createUser(net, 'carol', 'carol@code.dev', 'ML researcher');

followUser(net, alice.id, bob.id);
followUser(net, bob.id, alice.id);
followUser(net, carol.id, alice.id);

const p1 = createPost(net, alice.id, 'Just deployed my first k8s cluster!', ['devops','cloud']);
const p2 = createPost(net, bob.id, 'TypeScript 5.0 is amazing', ['typescript','webdev']);
likePost(net, carol.id, p1?.id);
likePost(net, bob.id, p1?.id);

console.log('Alice feed:', getFeed(net, alice.id, 5)?.map(p => p?.content));
console.log('Trending:', getTrendingPosts(net, 3)?.map(p => p?.content));
console.log('Alice stats:', getUserStats(net, alice.id));
`;

const JS_EVENTS_CODE = `// ============================================================
//  DEVCEPTION CHALLENGE — Event Scheduler System
//  Fix all bugs marked "// BUG" and complete all TODOs!
// ============================================================

class CalendarEvent {
  constructor(id, title, description, startTime, endTime, hostId, capacity) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.hostId = hostId;
    this.capacity = capacity;
    this.attendees = [];
    this.waitlist = [];
    this.tags = [];
    this.isCancelled = false;
    this.createdAt = Date.now();
  }
}

// BUG: Allows overbooking — no capacity check, no waitlist fallback
function registerForEvent(scheduler, userId, eventId) {
  const event = scheduler.events.get(eventId);
  if (!event) return { success: false, error: 'Event not found' };
  if (event.isCancelled) return { success: false, error: 'Event is cancelled' };
  if (event.attendees.includes(userId)) return { success: false, error: 'Already registered' };
  event.attendees.push(userId);  // BUG: no capacity check or waitlist logic
  return { success: true };
}

// TODO: Implement cancelRegistration
// Remove from attendees (or waitlist), if removed from attendees promote first waitlist person
// Return { success, promoted } where promoted is userId or null
function cancelRegistration(scheduler, userId, eventId) {
  // your code here
}

// BUG: Overlap logic is inverted — returns true when there is NO conflict
function hasConflict(eventA, eventB) {
  return eventA.endTime <= eventB.startTime || eventA.startTime >= eventB.endTime; // BUG
}

// TODO: Implement createEvent
// Validate startTime < endTime, create CalendarEvent, store in scheduler.events
// Return the event or null on validation failure
function createEvent(scheduler, hostId, title, description, startTime, endTime, capacity) {
  // your code here
}

// BUG: Returns cancelled events too
function getUpcomingEvents(scheduler, fromTime = new Date()) {
  return [...scheduler.events.values()]
    .filter(e => e.startTime >= fromTime)  // BUG: missing !e.isCancelled check
    .sort((a, b) => a.startTime - b.startTime);
}

// TODO: Implement getEventsForUser
// Return all events where userId is in attendees, sorted by startTime
function getEventsForUser(scheduler, userId) {
  // your code here
}

// BUG: Duration can be negative — should clamp to 0
function getEventDurationMinutes(event) {
  return (event.endTime - event.startTime) / (1000 * 60); // BUG: no Math.max(0, ...)
}

// TODO: Implement cancelEvent
// Mark event.isCancelled = true, clear attendees + waitlist
// Return total number of people affected
function cancelEvent(scheduler, hostId, eventId) {
  // your code here
}

// BUG: Off-by-one — should not subtract 1
function getAvailableSlots(event) {
  return event.capacity - event.attendees.length - 1; // BUG
}

// TODO: Implement searchEvents
// Match title or description case-insensitively, filter by optional tag
// Return only non-cancelled events
function searchEvents(scheduler, query, tag = null) {
  // your code here
}

// BUG: Sorts by raw attendee count instead of fill percentage
function getMostPopularEvents(scheduler, limit = 5) {
  return [...scheduler.events.values()]
    .filter(e => !e.isCancelled)
    .sort((a, b) => b.attendees.length - a.attendees.length)  // BUG: should be % filled
    .slice(0, limit);
}

// TODO: Implement getScheduleReport
// Return { totalEvents, cancelledCount, avgAttendance, busiestDay }
function getScheduleReport(scheduler) {
  // your code here
}

// ---- Helper functions (correct — do not modify) ----
function createScheduler() {
  return { events: new Map(), _nextId: 1 };
}

// ---- Test it out ----
const sched = createScheduler();
const evt1 = createEvent(sched, 'alice', 'React Workshop', 'Learn React hooks in depth', '2025-08-01T10:00', '2025-08-01T12:00', 3);
const evt2 = createEvent(sched, 'bob', 'Git Masterclass', 'Advanced git workflows', '2025-08-02T14:00', '2025-08-02T16:00', 5);

registerForEvent(sched, 'carol', evt1?.id);
registerForEvent(sched, 'dave', evt1?.id);
registerForEvent(sched, 'eve', evt1?.id);
registerForEvent(sched, 'bob', evt1?.id);  // should go to waitlist

console.log('Upcoming:', getUpcomingEvents(sched).map(e => e?.title));
console.log('Slots for evt1:', getAvailableSlots(evt1));
console.log('Report:', getScheduleReport(sched));
`;

// ---- Additional Python code templates ----
const PYTHON_LIBRARY_CODE = `# ============================================================
#  DEVCEPTION CHALLENGE — Library Management System
#  Fix all bugs marked "# BUG" and complete all TODOs!
# ============================================================

from datetime import datetime, timedelta

class Book:
    def __init__(self, isbn, title, author, genre, copies=1):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.genre = genre
        self.total_copies = copies
        self.available_copies = copies
        self.ratings = []
        self.added_at = datetime.now()

class Member:
    def __init__(self, member_id, name, email, tier='standard'):
        self.member_id = member_id
        self.name = name
        self.email = email
        self.tier = tier  # 'standard', 'premium', 'student'
        self.borrowed = []  # list of { isbn, due_date, borrowed_at }
        self.history = []
        self.fines = 0.0
        self.joined_at = datetime.now()

# BUG: Allows borrowing when available_copies is 0
def borrow_book(library, member_id, isbn):
    book = library['books'].get(isbn)
    member = library['members'].get(member_id)
    if not book or not member:
        return {'success': False, 'error': 'Not found'}
    if member.fines > 0:
        return {'success': False, 'error': 'Outstanding fines'}
    # BUG: missing check for book.available_copies > 0
    loan_days = 21 if member.tier == 'premium' else 14
    due = datetime.now() + timedelta(days=loan_days)
    book.available_copies -= 1
    member.borrowed.append({'isbn': isbn, 'due_date': due, 'borrowed_at': datetime.now()})
    return {'success': True, 'due_date': due}

# TODO: Implement return_book
# Find loan in member.borrowed, remove it, increment book.available_copies
# Charge 0.50/day fine if overdue, add to member.fines
# Move loan to member.history with return info
# Return { success, fine_charged }
def return_book(library, member_id, isbn):
    pass  # your code here

# BUG: Only matches exact title (case-sensitive)
def search_books(library, query, genre=None):
    results = [b for b in library['books'].values()
               if b.title == query]  # BUG: should be case-insensitive substring match
    if genre:
        results = [b for b in results if b.genre == genre]
    return results

# TODO: Implement add_rating
# Add rating (1-5) to book.ratings list
# Return updated average or None if book not found / invalid rating
def add_rating(library, isbn, rating):
    pass  # your code here

# BUG: Returns members WITH fines, not members in good standing (inverted)
def get_members_in_good_standing(library):
    return [m for m in library['members'].values() if m.fines > 0]  # BUG: should be == 0

# TODO: Implement get_overdue_loans
# Return list of { member, book, days_overdue } for all overdue loans
def get_overdue_loans(library):
    pass  # your code here

# BUG: avgRating divides by (len - 1) instead of len
def get_popular_books(library, limit=5):
    def avg(book):
        if not book.ratings:
            return 0
        return sum(book.ratings) / (len(book.ratings) - 1) if len(book.ratings) > 1 else book.ratings[0]  # BUG
    return sorted(library['books'].values(), key=avg, reverse=True)[:limit]

# TODO: Implement renew_loan
# Extend due_date by 7 days if not overdue and member has no fines
# Return { success, new_due_date }
def renew_loan(library, member_id, isbn):
    pass  # your code here

# BUG: Counts total_copies instead of available_copies
def get_availability_report(library):
    total_titles = len(library['books'])
    available = sum(b.total_copies for b in library['books'].values())  # BUG: should be available_copies
    borrowed_count = sum(len(m.borrowed) for m in library['members'].values())
    return {
        'total_titles': total_titles,
        'available_copies': available,
        'borrowed_count': borrowed_count,
    }

# TODO: Implement get_member_report
# Return { member_name, books_borrowed, total_fines, favorite_genre }
# favorite_genre = most common genre across member.history
def get_member_report(library, member_id):
    pass  # your code here

# ---- Helper functions (correct — do not modify) ----
def create_library():
    return {'books': {}, 'members': {}}

def add_book(library, isbn, title, author, genre, copies=1):
    library['books'][isbn] = Book(isbn, title, author, genre, copies)

def add_member(library, member_id, name, email, tier='standard'):
    library['members'][member_id] = Member(member_id, name, email, tier)

# ---- Test it out ----
lib = create_library()
add_book(lib, '978-0', 'Clean Code', 'Martin', 'programming', 2)
add_book(lib, '978-1', 'The Pragmatic Programmer', 'Hunt', 'programming', 1)
add_book(lib, '978-2', 'Dune', 'Herbert', 'sci-fi', 3)
add_member(lib, 'm1', 'Alice', 'alice@lib.org', 'premium')
add_member(lib, 'm2', 'Bob', 'bob@lib.org', 'standard')

print(borrow_book(lib, 'm1', '978-0'))
print(borrow_book(lib, 'm2', '978-1'))
print(search_books(lib, 'clean'))
print(get_availability_report(lib))
`;

const PYTHON_WEATHER_CODE = `# ============================================================
#  DEVCEPTION CHALLENGE — Weather Analytics System
#  Fix all bugs marked "# BUG" and complete all TODOs!
# ============================================================

from datetime import datetime, timedelta
import random

class WeatherReading:
    def __init__(self, station_id, timestamp, temp_c, humidity, wind_kph, condition):
        self.station_id = station_id
        self.timestamp = datetime.fromisoformat(str(timestamp)) if isinstance(timestamp, str) else timestamp
        self.temp_c = temp_c
        self.humidity = humidity      # 0-100
        self.wind_kph = wind_kph
        self.condition = condition    # 'sunny','cloudy','rainy','stormy','snowy'

class WeatherStation:
    def __init__(self, station_id, name, latitude, longitude, elevation=0):
        self.station_id = station_id
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.elevation = elevation
        self.readings = []

# BUG: Celsius to Fahrenheit formula wrong — should be (c * 9/5) + 32
def celsius_to_fahrenheit(c):
    return (c * 9) + 32  # BUG: missing / 5

# TODO: Implement add_reading
# Create a WeatherReading and append to station.readings
# Return the reading or None if station not found
def add_reading(system, station_id, timestamp, temp_c, humidity, wind_kph, condition):
    pass  # your code here

# BUG: Returns min temperature instead of max
def get_max_temp(system, station_id, days=7):
    station = system['stations'].get(station_id)
    if not station or not station.readings:
        return None
    cutoff = datetime.now() - timedelta(days=days)
    recent = [r for r in station.readings if r.timestamp >= cutoff]
    return min(r.temp_c for r in recent) if recent else None  # BUG: should be max()

# TODO: Implement get_average_temp
# Return average temperature for the last 'days' days, or None if no data
def get_average_temp(system, station_id, days=7):
    pass  # your code here

# BUG: Off-by-one: divides humidity sum by (len - 1)
def get_humidity_stats(system, station_id):
    station = system['stations'].get(station_id)
    if not station or not station.readings:
        return None
    humidities = [r.humidity for r in station.readings]
    return {
        'min': min(humidities),
        'max': max(humidities),
        'avg': sum(humidities) / (len(humidities) - 1) if len(humidities) > 1 else humidities[0],  # BUG
    }

# TODO: Implement detect_storm_warnings
# Return list of station_ids where wind_kph > 80 OR condition == 'stormy'
# in the last 24 hours
def detect_storm_warnings(system):
    pass  # your code here

# BUG: Compares humidity values instead of temperature for trend
def get_temperature_trend(system, station_id, days=7):
    """Returns 'rising', 'falling', or 'stable'"""
    station = system['stations'].get(station_id)
    if not station or len(station.readings) < 2:
        return 'stable'
    sorted_r = sorted(station.readings, key=lambda r: r.timestamp)
    mid = len(sorted_r) // 2
    avg_first  = sum(r.humidity for r in sorted_r[:mid]) / mid          # BUG: should be r.temp_c
    avg_second = sum(r.humidity for r in sorted_r[mid:]) / (len(sorted_r) - mid)  # BUG
    if avg_second - avg_first > 2:
        return 'rising'
    elif avg_first - avg_second > 2:
        return 'falling'
    return 'stable'

# TODO: Implement compare_stations
# Return { warmer_station, cooler_station, temp_difference } using avg temp
def compare_stations(system, station_a_id, station_b_id, days=7):
    pass  # your code here

# BUG: Returns count of readings instead of the most frequent condition string
def get_dominant_condition(system, station_id, days=7):
    station = system['stations'].get(station_id)
    if not station:
        return None
    cutoff = datetime.now() - timedelta(days=days)
    recent = [r.condition for r in station.readings if r.timestamp >= cutoff]
    return len(recent)  # BUG: should return most frequent condition using max(set(...), key=...)

# TODO: Implement generate_daily_summary
# For each of the last 'days' days compute { date, min_temp, max_temp, avg_temp, condition }
# Return list sorted by date
def generate_daily_summary(system, station_id, days=7):
    pass  # your code here

# ---- Helper functions (correct — do not modify) ----
def create_system():
    return {'stations': {}}

def add_station(system, station_id, name, latitude, longitude, elevation=0):
    system['stations'][station_id] = WeatherStation(station_id, name, latitude, longitude, elevation)

# ---- Test it out ----
sys_data = create_system()
add_station(sys_data, 'S1', 'City Center',   40.71, -74.00, 10)
add_station(sys_data, 'S2', 'Mountain Peak', 40.68, -73.95, 850)

base = datetime.now()
for i in range(14):
    ts = base - timedelta(hours=i * 6)
    add_reading(sys_data, 'S1', ts, 18 + random.uniform(-5, 5), 65, 20 + random.uniform(0, 30), 'sunny')
    add_reading(sys_data, 'S2', ts,  8 + random.uniform(-3, 3), 80, 40 + random.uniform(0, 40), 'cloudy')

print('Max temp S1:', get_max_temp(sys_data, 'S1'))
print('Trend S2:', get_temperature_trend(sys_data, 'S2'))
print('Warnings:', detect_storm_warnings(sys_data))
`;

// ---- Additional C++ code templates ----
const CPP_GRADES_CODE = `// ============================================================
//  DEVCEPTION CHALLENGE — Student Grade Management System
//  Fix all bugs marked "// BUG" and complete all TODOs!
// ============================================================

#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <algorithm>
using namespace std;

struct Assignment {
    string id, title, type;  // 'homework','quiz','midterm','final'
    double maxScore, weight;
    map<string, double> scores;  // studentId -> score
    Assignment(string id, string title, string type, double max, double wt)
        : id(id), title(title), type(type), maxScore(max), weight(wt) {}
};

class Student {
public:
    string id, name, email, major;
    int year;
    vector<string> enrolledCourses;
    Student(string id, string name, string email, string major, int year)
        : id(id), name(name), email(email), major(major), year(year) {}
};

class Course {
public:
    string id, title, instructor;
    int maxCapacity;
    vector<string> enrolledStudents;
    vector<Assignment> assignments;

    Course(string id, string title, string instructor, int cap)
        : id(id), title(title), instructor(instructor), maxCapacity(cap) {}

    // BUG: Does not check maxCapacity before enrolling
    bool enroll(const string& studentId) {
        if (find(enrolledStudents.begin(), enrolledStudents.end(), studentId) != enrolledStudents.end())
            return false;
        enrolledStudents.push_back(studentId);  // BUG: no capacity check
        return true;
    }

    // BUG: Divides by assignments.size() instead of totalWeight
    double getStudentGrade(const string& studentId) {
        double totalWeightedScore = 0, totalWeight = 0;
        for (const auto& a : assignments) {
            auto it = a.scores.find(studentId);
            if (it != a.scores.end()) {
                totalWeightedScore += (it->second / a.maxScore) * a.weight;
                totalWeight += a.weight;
            }
        }
        if (totalWeight == 0) return 0;
        return (totalWeightedScore / assignments.size()) * 100;  // BUG: divide by totalWeight
    }

    // TODO: Implement getLetterGrade
    // A >= 90, B >= 80, C >= 70, D >= 60, F < 60
    string getLetterGrade(const string& studentId) {
        // your code here
        return "F";
    }

    // BUG: Sorts ascending — should be descending for top performers
    vector<pair<string,double>> getLeaderboard() {
        vector<pair<string,double>> board;
        for (const auto& sid : enrolledStudents)
            board.push_back({sid, getStudentGrade(sid)});
        sort(board.begin(), board.end(),
             [](const auto& a, const auto& b){ return a.second < b.second; }); // BUG: should be >
        return board;
    }
};

class GradeBook {
private:
    map<string, Student*> students;
    map<string, Course*>  courses;
    int nextStudentNum = 1000, nextCourseNum = 100;

public:
    string addStudent(const string& name, const string& email, const string& major, int year) {
        string id = "S" + to_string(nextStudentNum++);
        students[id] = new Student(id, name, email, major, year);
        return id;
    }

    string addCourse(const string& title, const string& instructor, int cap = 30) {
        string id = "C" + to_string(nextCourseNum++);
        courses[id] = new Course(id, title, instructor, cap);
        return id;
    }

    // BUG: Does not push courseId into student.enrolledCourses
    bool enrollStudent(const string& studentId, const string& courseId) {
        Student* s = students.count(studentId) ? students[studentId] : nullptr;
        Course*  c = courses.count(courseId)   ? courses[courseId]   : nullptr;
        if (!s || !c) return false;
        return c->enroll(studentId);  // BUG: missing s->enrolledCourses.push_back(courseId)
    }

    void addAssignment(const string& courseId, const string& aid,
                       const string& title, const string& type,
                       double maxScore, double weight) {
        if (courses.count(courseId))
            courses[courseId]->assignments.emplace_back(aid, title, type, maxScore, weight);
    }

    // BUG: Allows score > maxScore
    bool submitScore(const string& courseId, const string& assignId,
                     const string& studentId, double score) {
        Course* c = courses.count(courseId) ? courses[courseId] : nullptr;
        if (!c) return false;
        for (auto& a : c->assignments) {
            if (a.id == assignId) {
                a.scores[studentId] = score;  // BUG: no check score <= a.maxScore
                return true;
            }
        }
        return false;
    }

    // TODO: Implement getAtRiskStudents
    // Return vector of student IDs with grade < 60 in any enrolled course
    vector<string> getAtRiskStudents() {
        // your code here
        return {};
    }

    // TODO: Implement getCourseStats
    // Return map with avgGrade, highestGrade, lowestGrade, passRate (>= 60)
    map<string, double> getCourseStats(const string& courseId) {
        // your code here
        return {};
    }

    // BUG: Divides by enrolledCourses.size() instead of count of courses with data
    double getStudentGPA(const string& studentId) {
        Student* s = students.count(studentId) ? students[studentId] : nullptr;
        if (!s || s->enrolledCourses.empty()) return 0;
        double total = 0; int count = 0;
        for (const auto& cid : s->enrolledCourses) {
            Course* c = courses.count(cid) ? courses[cid] : nullptr;
            if (c) { total += c->getStudentGrade(studentId); count++; }
        }
        return count > 0 ? total / s->enrolledCourses.size() : 0; // BUG: use count
    }

    ~GradeBook() {
        for (auto& p : students) delete p.second;
        for (auto& p : courses)  delete p.second;
    }
};

// ---- Test it out ----
int main() {
    GradeBook gb;
    string alice = gb.addStudent("Alice", "alice@uni.edu", "CS", 2);
    string bob   = gb.addStudent("Bob",   "bob@uni.edu",   "CS", 3);
    string carol = gb.addStudent("Carol", "carol@uni.edu", "Math", 1);

    string cs101 = gb.addCourse("Intro to CS", "Dr. Smith", 30);
    string math1 = gb.addCourse("Calculus I",  "Dr. Jones", 25);

    gb.enrollStudent(alice, cs101);
    gb.enrollStudent(bob,   cs101);
    gb.enrollStudent(carol, cs101);
    gb.enrollStudent(alice, math1);

    gb.addAssignment(cs101, "hw1", "Homework 1", "homework", 100, 20);
    gb.addAssignment(cs101, "mid", "Midterm",    "midterm",  100, 40);
    gb.addAssignment(cs101, "fin", "Final Exam", "final",    100, 40);

    gb.submitScore(cs101, "hw1", alice, 95);
    gb.submitScore(cs101, "mid", alice, 82);
    gb.submitScore(cs101, "fin", alice, 78);
    gb.submitScore(cs101, "hw1", bob,   60);
    gb.submitScore(cs101, "mid", bob,   55);

    cout << "At-risk students: " << gb.getAtRiskStudents().size() << endl;
    auto stats = gb.getCourseStats(cs101);
    cout << "CS101 avg grade: " << stats["avgGrade"] << "%" << endl;
    return 0;
}
`;

const CPP_FILESYSTEM_CODE = `// ============================================================
//  DEVCEPTION CHALLENGE — File System Simulator
//  Fix all bugs marked "// BUG" and complete all TODOs!
// ============================================================

#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <algorithm>
#include <sstream>
#include <ctime>
using namespace std;

enum class NodeType { FILE_NODE, DIR_NODE };

struct FSNode {
    string name, owner, content;
    NodeType type;
    size_t size;
    time_t createdAt, modifiedAt;
    map<string, FSNode*> children;
    int permissions;

    FSNode(const string& n, NodeType t, const string& own, int perms = 644)
        : name(n), owner(own), type(t), content(""), size(0), permissions(perms),
          createdAt(time(nullptr)), modifiedAt(time(nullptr)) {}

    bool isDir() const { return type == NodeType::DIR_NODE; }
};

class FileSystem {
private:
    FSNode* root;

    vector<string> splitPath(const string& path) {
        vector<string> parts;
        stringstream ss(path);
        string token;
        while (getline(ss, token, '/'))
            if (!token.empty()) parts.push_back(token);
        return parts;
    }

    FSNode* navigate(const vector<string>& parts, int depth = -1) {
        FSNode* cur = root;
        int limit = depth == -1 ? (int)parts.size() : depth;
        for (int i = 0; i < limit && cur; i++) {
            if (!cur->isDir()) return nullptr;
            auto it = cur->children.find(parts[i]);
            if (it == cur->children.end()) return nullptr;
            cur = it->second;
        }
        return cur;
    }

public:
    FileSystem() { root = new FSNode("", NodeType::DIR_NODE, "root", 755); }

    // BUG: Does not update parent directory size after file creation
    bool createFile(const string& path, const string& owner, const string& content = "") {
        auto parts = splitPath(path);
        if (parts.empty()) return false;
        FSNode* parent = navigate(parts, (int)parts.size() - 1);
        if (!parent || !parent->isDir()) return false;
        const string& fname = parts.back();
        if (parent->children.count(fname)) return false;
        FSNode* f = new FSNode(fname, NodeType::FILE_NODE, owner);
        f->content = content;
        f->size = content.size();
        parent->children[fname] = f;
        // BUG: parent->size += f->size is missing
        return true;
    }

    // BUG: Does not check if directory already exists before creating
    bool makeDir(const string& path, const string& owner) {
        auto parts = splitPath(path);
        if (parts.empty()) return false;
        FSNode* parent = navigate(parts, (int)parts.size() - 1);
        if (!parent || !parent->isDir()) return false;
        const string& dname = parts.back();
        // BUG: should return false if parent->children.count(dname)
        FSNode* d = new FSNode(dname, NodeType::DIR_NODE, owner, 755);
        parent->children[dname] = d;
        return true;
    }

    // TODO: Implement readFile
    // Return file content, or empty string if path is invalid or is a directory
    string readFile(const string& path) {
        // your code here
        return "";
    }

    // TODO: Implement writeFile
    // Update content and size, update modifiedAt to now()
    // Return false if path not found or is a directory
    bool writeFile(const string& path, const string& content) {
        // your code here
        return false;
    }

    // BUG: Erases node without freeing memory (memory leak)
    bool deleteNode(const string& path) {
        auto parts = splitPath(path);
        if (parts.empty()) return false;
        FSNode* parent = navigate(parts, (int)parts.size() - 1);
        if (!parent || !parent->isDir()) return false;
        auto it = parent->children.find(parts.back());
        if (it == parent->children.end()) return false;
        parent->children.erase(it);  // BUG: should delete it->second before erase
        return true;
    }

    // TODO: Implement listDir
    // Return vector of { name, isDirectory, size } for direct children
    struct DirEntry { string name; bool isDirectory; size_t size; };
    vector<DirEntry> listDir(const string& path) {
        // your code here
        return {};
    }

    // BUG: Does not recurse into subdirectories — misses nested file sizes
    size_t getDirSize(const string& path) {
        auto parts = splitPath(path);
        FSNode* node = navigate(parts);
        if (!node || !node->isDir()) return 0;
        size_t total = 0;
        for (const auto& child : node->children)
            total += child.second->size;  // BUG: subdirs not recursed
        return total;
    }

    // TODO: Implement findFiles
    // Recursively find files whose name contains pattern (case-insensitive)
    // starting from startPath; return list of full absolute paths
    vector<string> findFiles(const string& startPath, const string& pattern) {
        // your code here
        return {};
    }

    // BUG: Non-recursive count misses nested nodes
    int countNodes(const string& path, bool filesOnly = false) {
        auto parts = splitPath(path);
        FSNode* node = navigate(parts);
        if (!node) return 0;
        if (!node->isDir()) return 1;
        int count = 0;
        for (const auto& child : node->children)
            if (!filesOnly || !child.second->isDir()) count++;  // BUG: not recursive
        return count;
    }

    // TODO: Implement copyFile
    // Copy file at srcPath to dstPath (must not already exist)
    // Return false if src not found, is a directory, or dst exists
    bool copyFile(const string& srcPath, const string& dstPath) {
        // your code here
        return false;
    }

    ~FileSystem() { delete root; }
};

// ---- Test it out ----
int main() {
    FileSystem fs;
    fs.makeDir("/home", "root");
    fs.makeDir("/home/alice", "alice");
    fs.makeDir("/home/bob", "bob");
    fs.makeDir("/tmp", "root");

    fs.createFile("/home/alice/notes.txt",  "alice", "Hello Devception!");
    fs.createFile("/home/alice/solution.cpp","alice", "#include <iostream>\\nint main(){}");
    fs.createFile("/tmp/debug.log",          "root",  "error: null pointer at line 42");

    cout << "notes.txt: " << fs.readFile("/home/alice/notes.txt") << endl;
    cout << "/home/alice size: " << fs.getDirSize("/home/alice") << " bytes" << endl;
    cout << "Nodes in /home: " << fs.countNodes("/home") << endl;
    return 0;
}
`;

// ============================================================
//  ADDITIONAL JAVASCRIPT TEMPLATES
// ============================================================

const JS_ECOMMERCE_CODE = `
// DEVCEPTION CHALLENGE — E-Commerce Cart System
// Fix bugs and complete missing logic to make all operations work correctly.

class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock; // BUG: should decrement on purchase, currently never changes
  }

  isAvailable(qty = 1) {
    // BUG: should return false when stock < qty, currently always returns true
    return true;
  }

  applyDiscount(pct) {
    if (pct < 0 || pct > 100) throw new Error('Invalid discount');
    // BUG: discount applied twice — fix so new price = price * (1 - pct/100)
    this.price = this.price - (this.price * pct / 100) - (this.price * pct / 100);
  }
}

class Cart {
  constructor(userId) {
    this.userId = userId;
    this.items = []; // { product, qty }
    this.coupon = null;
  }

  addItem(product, qty = 1) {
    if (!product.isAvailable(qty)) throw new Error('Out of stock');
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      // TODO: push new item into this.items
    }
  }

  removeItem(productId) {
    // TODO: filter out item with matching productId
    this.items = this.items; // BUG: no actual filter
  }

  updateQty(productId, newQty) {
    if (newQty <= 0) { this.removeItem(productId); return; }
    const item = this.items.find(i => i.product.id === productId);
    if (item) item.qty = newQty;
  }

  subtotal() {
    // BUG: multiplies price * qty but forgets to sum — returns last value only
    let total = 0;
    for (const item of this.items) {
      total = item.product.price * item.qty;
    }
    return total;
  }

  applyCoupon(code, discountPct) {
    this.coupon = { code, discountPct };
  }

  total() {
    const sub = this.subtotal();
    if (!this.coupon) return sub;
    // TODO: apply coupon discount and return final total
    return sub;
  }

  checkout() {
    if (this.items.length === 0) throw new Error('Cart is empty');
    const order = {
      orderId: Math.random().toString(36).slice(2),
      userId: this.userId,
      items: this.items.map(i => ({ name: i.product.name, qty: i.qty, price: i.product.price })),
      total: this.total(),
      placedAt: new Date().toISOString(),
    };
    // TODO: decrement stock for each purchased item
    this.items = [];
    return order;
  }
}

class OrderHistory {
  constructor() {
    this.orders = [];
  }

  add(order) {
    this.orders.push(order);
  }

  getByUser(userId) {
    // BUG: strict equality check is correct but variable is shadowed — fix
    return this.orders.filter(o => o.userId = userId);
  }

  totalSpent(userId) {
    return this.getByUser(userId)
      // BUG: uses o.price instead of o.total
      .reduce((sum, o) => sum + o.price, 0);
  }

  mostRecent(userId, n = 5) {
    // TODO: return last n orders for user sorted by placedAt descending
    return [];
  }
}

// ---- Driver ----
const p1 = new Product('p1', 'Mechanical Keyboard', 120, 10);
const p2 = new Product('p2', 'Mouse Pad XL', 25, 50);
const p3 = new Product('p3', 'USB Hub', 35, 5);

const cart = new Cart('user_42');
cart.addItem(p1, 1);
cart.addItem(p2, 2);
cart.applyCoupon('SAVE10', 10);

console.log('Subtotal:', cart.subtotal());
console.log('Total after coupon:', cart.total());

const history = new OrderHistory();
const order = cart.checkout();
history.add(order);
console.log('Order placed:', order.orderId);
console.log('Total spent:', history.totalSpent('user_42'));
`;

const JS_TASKMANAGER_CODE = `
// DEVCEPTION CHALLENGE — Task Manager & Priority Queue
// Fix bugs and complete missing functions.

class Task {
  constructor(id, title, priority, dueDate, tags = []) {
    this.id = id;
    this.title = title;
    // BUG: priority should be 1(high) to 5(low), but stored inverted
    this.priority = 6 - priority;
    this.dueDate = new Date(dueDate);
    this.tags = tags;
    this.done = false;
    this.subtasks = [];
    this.createdAt = new Date();
  }

  addSubtask(title) {
    this.subtasks.push({ title, done: false });
  }

  completeSubtask(title) {
    const st = this.subtasks.find(s => s.title === title);
    // BUG: should set st.done = true, currently sets st.done = false
    if (st) st.done = false;
  }

  completionRate() {
    if (this.subtasks.length === 0) return this.done ? 1 : 0;
    // TODO: return fraction of completed subtasks
    return 0;
  }

  isOverdue() {
    // TODO: return true if dueDate is before now and task is not done
    return false;
  }
}

class TaskManager {
  constructor() {
    this.tasks = new Map(); // id -> Task
  }

  add(task) {
    this.tasks.set(task.id, task);
  }

  remove(id) {
    // TODO: delete from map, throw if not found
  }

  complete(id) {
    const t = this.tasks.get(id);
    if (!t) throw new Error('Task not found');
    t.done = true;
  }

  getByTag(tag) {
    // BUG: uses == instead of includes — won't work for tag arrays
    return [...this.tasks.values()].filter(t => t.tags == tag);
  }

  getOverdue() {
    return [...this.tasks.values()].filter(t => t.isOverdue());
  }

  sortByPriority() {
    // TODO: return array of tasks sorted by priority ascending (1 = highest)
    return [];
  }

  sortByDueDate() {
    return [...this.tasks.values()].sort((a, b) => {
      // BUG: comparison inverted — fix to sort ascending (soonest first)
      return b.dueDate - a.dueDate;
    });
  }

  stats() {
    const all = [...this.tasks.values()];
    return {
      total: all.length,
      completed: all.filter(t => t.done).length,
      // TODO: add overdue count
      overdue: 0,
      completionRate: 0, // TODO: average completionRate across all tasks
    };
  }
}

class NotificationSystem {
  constructor(manager) {
    this.manager = manager;
    this.subscribers = {};
  }

  subscribe(event, cb) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(cb);
  }

  emit(event, data) {
    // TODO: call all subscribers for this event with data
  }

  checkDueSoon(withinHours = 24) {
    const cutoff = new Date(Date.now() + withinHours * 3600 * 1000);
    const dueSoon = [...this.manager.tasks.values()].filter(
      t => !t.done && t.dueDate <= cutoff
    );
    // TODO: emit 'due-soon' event with dueSoon list
    return dueSoon;
  }
}

// ---- Driver ----
const mgr = new TaskManager();
const notif = new NotificationSystem(mgr);

notif.subscribe('due-soon', tasks => {
  console.log('Due soon:', tasks.map(t => t.title));
});

const t1 = new Task('1', 'Fix login bug', 1, '2025-01-15', ['bug', 'auth']);
const t2 = new Task('2', 'Write docs', 3, '2025-02-01', ['docs']);
const t3 = new Task('3', 'Deploy to prod', 1, '2025-01-10', ['devops']);

t1.addSubtask('Reproduce issue');
t1.addSubtask('Write fix');
t1.addSubtask('Write test');
t1.completeSubtask('Reproduce issue');

mgr.add(t1); mgr.add(t2); mgr.add(t3);

console.log('Priority order:', mgr.sortByPriority().map(t => t.title));
console.log('Overdue:', mgr.getOverdue().map(t => t.title));
console.log('Stats:', mgr.stats());
notif.checkDueSoon(48);
`;

const JS_CHATAPP_CODE = `
// DEVCEPTION CHALLENGE — Real-Time Chat Room System
// Fix bugs and complete missing logic.

class Message {
  constructor(id, roomId, authorId, authorName, text) {
    this.id = id;
    this.roomId = roomId;
    this.authorId = authorId;
    this.authorName = authorName;
    this.text = text;
    this.timestamp = Date.now();
    this.reactions = {}; // emoji -> Set of userIds
    this.edited = false;
    this.replyTo = null;
  }

  addReaction(emoji, userId) {
    if (!this.reactions[emoji]) this.reactions[emoji] = new Set();
    this.reactions[emoji].add(userId);
  }

  removeReaction(emoji, userId) {
    // BUG: deletes the whole emoji entry instead of just this user
    if (this.reactions[emoji]) delete this.reactions[emoji];
  }

  reactionCount(emoji) {
    // TODO: return size of the set for emoji, or 0 if none
    return 0;
  }

  edit(newText) {
    if (!newText || newText.trim() === '') throw new Error('Empty message');
    // BUG: sets edited to false instead of true
    this.text = newText;
    this.edited = false;
  }
}

class ChatRoom {
  constructor(id, name, isPrivate = false) {
    this.id = id;
    this.name = name;
    this.isPrivate = isPrivate;
    this.members = new Set();
    this.messages = [];
    this.pinnedMessages = [];
  }

  join(userId) {
    this.members.add(userId);
  }

  leave(userId) {
    // TODO: remove userId from members set
  }

  send(message) {
    if (this.isPrivate && !this.members.has(message.authorId)) {
      throw new Error('Not a member of this private room');
    }
    this.messages.push(message);
    return message;
  }

  pin(messageId) {
    const msg = this.messages.find(m => m.id === messageId);
    if (!msg) throw new Error('Message not found');
    // BUG: pushes the message even if already pinned
    this.pinnedMessages.push(msg);
  }

  unpin(messageId) {
    // TODO: remove message with matching id from pinnedMessages
  }

  getHistory(limit = 50, before = Date.now()) {
    // BUG: filter uses > instead of < — returns messages AFTER timestamp
    return this.messages
      .filter(m => m.timestamp > before)
      .slice(-limit);
  }

  search(query) {
    const q = query.toLowerCase();
    // TODO: return messages where text includes query (case-insensitive)
    return [];
  }

  memberCount() { return this.members.size; }
}

class ChatServer {
  constructor() {
    this.rooms = new Map();
    this.users = new Map(); // userId -> { name, online }
    this.dmRooms = new Map(); // 'userId1:userId2' -> roomId
  }

  registerUser(userId, name) {
    this.users.set(userId, { name, online: false });
  }

  setOnline(userId, isOnline) {
    const u = this.users.get(userId);
    if (u) u.online = isOnline;
  }

  createRoom(id, name, isPrivate = false) {
    const room = new ChatRoom(id, name, isPrivate);
    this.rooms.set(id, room);
    return room;
  }

  getOrCreateDM(userId1, userId2) {
    const key = [userId1, userId2].sort().join(':');
    if (this.dmRooms.has(key)) {
      return this.rooms.get(this.dmRooms.get(key));
    }
    // TODO: create a new private room for these two users, store in dmRooms, return it
    return null;
  }

  onlineUsers() {
    // BUG: returns offline users — fix condition
    return [...this.users.entries()]
      .filter(([, u]) => !u.online)
      .map(([id, u]) => ({ id, name: u.name }));
  }
}

// ---- Driver ----
const server = new ChatServer();
server.registerUser('alice', 'Alice');
server.registerUser('bob', 'Bob');
server.registerUser('charlie', 'Charlie');
server.setOnline('alice', true);
server.setOnline('bob', true);

const general = server.createRoom('general', 'General');
general.join('alice'); general.join('bob'); general.join('charlie');

const msgCounter = { n: 0 };
function mkMsg(roomId, authorId, name, text) {
  return new Message(\`msg_\${++msgCounter.n}\`, roomId, authorId, name, text);
}

const m1 = general.send(mkMsg('general', 'alice', 'Alice', 'Hello everyone!'));
const m2 = general.send(mkMsg('general', 'bob', 'Bob', 'Hey Alice!'));

m1.addReaction('👍', 'bob');
m1.addReaction('❤️', 'charlie');
m1.removeReaction('👍', 'bob');

general.pin(m1.id);
console.log('Pinned:', general.pinnedMessages.map(m => m.text));
console.log('Online users:', server.onlineUsers().map(u => u.name));
console.log('History:', general.getHistory(10).map(m => m.text));

const dm = server.getOrCreateDM('alice', 'bob');
if (dm) {
  dm.send(mkMsg(dm.id, 'alice', 'Alice', 'Hey Bob, private message!'));
  console.log('DM sent');
}
`;

const JS_RPGGAME_CODE = `
// DEVCEPTION CHALLENGE — RPG Battle System
// Fix bugs and complete missing combat logic.

class Character {
  constructor(name, hp, attack, defense, speed) {
    this.name = name;
    this.maxHp = hp;
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
    this.speed = speed;
    this.level = 1;
    this.xp = 0;
    this.statusEffects = []; // { type, duration, value }
    this.skills = [];
  }

  isAlive() {
    // BUG: should return true when hp > 0, returns opposite
    return this.hp <= 0;
  }

  takeDamage(amount) {
    const reduced = Math.max(0, amount - this.defense);
    // BUG: adds damage instead of subtracting
    this.hp = Math.min(this.maxHp, this.hp + reduced);
    return reduced;
  }

  heal(amount) {
    const before = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return this.hp - before; // actual healed amount
  }

  addStatus(type, duration, value = 0) {
    this.statusEffects.push({ type, duration, value });
  }

  tickStatuses() {
    // TODO: decrement duration on each status, remove those with duration <= 0
    // Apply 'poison' damage (value per tick) and 'regen' healing (value per tick)
    for (const s of this.statusEffects) {
      if (s.type === 'poison') this.takeDamage(s.value);
      if (s.type === 'regen') this.heal(s.value);
    }
    this.statusEffects = this.statusEffects; // BUG: should filter expired statuses
  }

  gainXp(amount) {
    this.xp += amount;
    const needed = this.level * 100;
    if (this.xp >= needed) {
      this.xp -= needed;
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    // TODO: increase maxHp by 10, attack by 2, defense by 1, refill hp
    console.log(\`\${this.name} leveled up to \${this.level}!\`);
  }

  learnSkill(skill) {
    this.skills.push(skill);
  }

  useSkill(skillName, target) {
    const skill = this.skills.find(s => s.name === skillName);
    if (!skill) throw new Error('Skill not known');
    // TODO: apply skill effect to target (damage, heal, or status)
    console.log(\`\${this.name} uses \${skillName} on \${target.name}\`);
  }
}

class Battle {
  constructor(attacker, defender) {
    this.attacker = attacker;
    this.defender = defender;
    this.log = [];
    this.turn = 1;
  }

  doAttack(source, target) {
    const dmg = source.attack + Math.floor(Math.random() * 6);
    const actual = target.takeDamage(dmg);
    this.log.push(\`[T\${this.turn}] \${source.name} hits \${target.name} for \${actual} dmg (HP: \${target.hp}/\${target.maxHp})\`);
    return actual;
  }

  runTurn() {
    // BUG: always attacker goes first regardless of speed — fix to check speed
    this.doAttack(this.attacker, this.defender);
    if (this.defender.isAlive()) {
      this.doAttack(this.defender, this.attacker);
    }
    this.attacker.tickStatuses();
    this.defender.tickStatuses();
    this.turn++;
  }

  run(maxTurns = 20) {
    while (this.attacker.isAlive() && this.defender.isAlive() && this.turn <= maxTurns) {
      this.runTurn();
    }
    return this.result();
  }

  result() {
    if (!this.attacker.isAlive() && !this.defender.isAlive()) return { winner: null, log: this.log };
    if (!this.attacker.isAlive()) return { winner: this.defender, log: this.log };
    if (!this.defender.isAlive()) return { winner: this.attacker, log: this.log };
    return { winner: null, log: this.log }; // timeout
  }
}

class Inventory {
  constructor(maxSlots = 10) {
    this.slots = [];
    this.maxSlots = maxSlots;
  }

  addItem(item) {
    if (this.slots.length >= this.maxSlots) throw new Error('Inventory full');
    // BUG: pushes item.name instead of item object
    this.slots.push(item.name);
  }

  removeItem(itemName) {
    // TODO: find first item with matching name and remove it, return it
    return null;
  }

  useItem(itemName, target) {
    const item = this.removeItem(itemName);
    if (!item) throw new Error('Item not in inventory');
    item.effect(target);
  }
}

// ---- Driver ----
const hero = new Character('Hero', 100, 18, 5, 12);
const slime = new Character('Slime King', 60, 10, 2, 8);

hero.learnSkill({ name: 'Fireball', type: 'damage', power: 25 });
slime.addStatus('regen', 5, 3);

const inv = new Inventory();
inv.addItem({ name: 'Health Potion', effect: (t) => t.heal(30) });

const battle = new Battle(hero, slime);
const result = battle.run();

console.log('--- Battle Log ---');
result.log.forEach(l => console.log(l));
console.log('Winner:', result.winner?.name ?? 'Draw/Timeout');
`;

// ============================================================
//  ADDITIONAL PYTHON TEMPLATES
// ============================================================

const PYTHON_SOCIAL_CODE = `
# DEVCEPTION CHALLENGE — Social Media Platform
# Fix bugs and complete missing logic.

from datetime import datetime
from collections import defaultdict

class User:
    def __init__(self, user_id, username, email):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.bio = ""
        self.following = set()   # user_ids this user follows
        self.followers = set()   # user_ids that follow this user
        self.posts = []
        self.liked_posts = set()
        self.joined_at = datetime.now()

    def follow(self, other_user):
        # BUG: adds to own following but doesn't add to other's followers
        self.following.add(other_user.user_id)

    def unfollow(self, other_user):
        # TODO: remove from following, remove self from other's followers
        pass

    def is_following(self, other_user):
        return other_user.user_id in self.following

    def feed_ids(self):
        """Return set of user_ids whose posts appear in this user's feed."""
        # TODO: return following set plus own user_id
        return set()


class Post:
    def __init__(self, post_id, author, content, tags=None):
        self.post_id = post_id
        self.author = author
        self.content = content
        self.tags = tags or []
        self.likes = set()
        self.comments = []
        self.created_at = datetime.now()
        self.shares = 0

    def like(self, user):
        # BUG: adds user.user_id but should also add post to user.liked_posts
        self.likes.add(user.user_id)

    def unlike(self, user):
        self.likes.discard(user.user_id)
        user.liked_posts.discard(self.post_id)

    def add_comment(self, user, text):
        # TODO: append dict with user_id, username, text, created_at
        pass

    def like_count(self):
        # BUG: returns length of content string instead of likes set
        return len(self.content)

    def is_trending(self, threshold=10):
        return self.like_count() >= threshold or self.shares >= threshold // 2


class Platform:
    def __init__(self):
        self.users = {}    # user_id -> User
        self.posts = {}    # post_id -> Post
        self._post_counter = 0
        self.hashtags = defaultdict(set)  # tag -> set of post_ids

    def register(self, username, email):
        uid = f"u{len(self.users) + 1}"
        user = User(uid, username, email)
        self.users[uid] = user
        return user

    def create_post(self, author, content, tags=None):
        self._post_counter += 1
        pid = f"p{self._post_counter}"
        post = Post(pid, author, content, tags or [])
        author.posts.append(pid)
        self.posts[pid] = post
        for tag in post.tags:
            self.hashtags[tag].add(pid)
        return post

    def get_feed(self, user, limit=20):
        """Return posts from followed users + own posts, newest first."""
        feed_ids = user.feed_ids()
        relevant = [p for p in self.posts.values() if p.author.user_id in feed_ids]
        # BUG: sorts ascending by created_at (oldest first) — fix to descending
        return sorted(relevant, key=lambda p: p.created_at)[:limit]

    def trending_posts(self, n=5):
        # TODO: return top n posts by like_count descending
        return []

    def search_hashtag(self, tag):
        pids = self.hashtags.get(tag, set())
        return [self.posts[pid] for pid in pids if pid in self.posts]

    def suggested_users(self, user, n=5):
        """Suggest users followed by people user follows but not yet followed."""
        candidates = set()
        for fid in user.following:
            followed = self.users.get(fid)
            if followed:
                candidates |= followed.following
        # TODO: remove already-followed and self, return up to n User objects
        return []


# ---- Driver ----
platform = Platform()
alice = platform.register("alice", "alice@example.com")
bob   = platform.register("bob",   "bob@example.com")
carol = platform.register("carol", "carol@example.com")

alice.follow(bob)
alice.follow(carol)
bob.follow(alice)

p1 = platform.create_post(alice, "Hello world! #python #coding", ["python","coding"])
p2 = platform.create_post(bob, "Working on a new project #dev", ["dev"])
p3 = platform.create_post(carol, "Beautiful day #life", ["life"])

p1.like(bob)
p1.like(carol)
p2.like(alice)

print("Alice's feed:", [platform.posts[p.post_id].content[:20] for p in platform.get_feed(alice)])
print("p1 likes:", p1.like_count())
print("Trending:", [p.content[:20] for p in platform.trending_posts()])
print("Suggested for carol:", [u.username for u in platform.suggested_users(carol)])
`;

const PYTHON_SCHEDULER_CODE = `
# DEVCEPTION CHALLENGE — Job Scheduler & Worker Pool
# Fix bugs and complete the missing scheduling logic.

import heapq
from datetime import datetime, timedelta
from collections import deque

class Job:
    def __init__(self, job_id, name, func, priority=5, max_retries=3):
        self.job_id = job_id
        self.name = name
        self.func = func
        self.priority = priority  # 1=highest, 10=lowest
        self.max_retries = max_retries
        self.retries = 0
        self.status = "pending"   # pending | running | done | failed
        self.result = None
        self.error = None
        self.created_at = datetime.now()
        self.started_at = None
        self.finished_at = None

    def run(self):
        self.status = "running"
        self.started_at = datetime.now()
        try:
            self.result = self.func()
            # BUG: should set status to "done" not "running"
            self.status = "running"
        except Exception as e:
            self.error = str(e)
            self.retries += 1
            # BUG: marks failed immediately even if retries remain
            self.status = "failed"
        finally:
            self.finished_at = datetime.now()

    def duration_ms(self):
        if self.started_at and self.finished_at:
            return (self.finished_at - self.started_at).total_seconds() * 1000
        # TODO: return None if not finished yet
        return 0

    def can_retry(self):
        # TODO: return True if status is failed and retries < max_retries
        return False

    def __lt__(self, other):
        # For heap: lower priority number = higher urgency
        return self.priority < other.priority


class PriorityQueue:
    def __init__(self):
        self._heap = []

    def push(self, job):
        # BUG: should use heapq.heappush, currently appends unsorted
        self._heap.append(job)

    def pop(self):
        if not self._heap:
            return None
        # TODO: use heapq.heappop
        return self._heap.pop(0)

    def peek(self):
        if not self._heap:
            return None
        return self._heap[0]

    def __len__(self):
        return len(self._heap)


class Scheduler:
    def __init__(self, max_workers=4):
        self.queue = PriorityQueue()
        self.running = {}      # job_id -> Job
        self.completed = []
        self.failed = []
        self.max_workers = max_workers
        self._id_counter = 0

    def submit(self, name, func, priority=5, max_retries=3):
        self._id_counter += 1
        job = Job(f"job_{self._id_counter}", name, func, priority, max_retries)
        self.queue.push(job)
        return job.job_id

    def _can_run_more(self):
        return len(self.running) < self.max_workers

    def tick(self):
        """Process one scheduling cycle."""
        # Complete running jobs
        done_ids = []
        for jid, job in self.running.items():
            # Simulate: jobs finish immediately in this single-threaded version
            if job.status in ("done", "failed"):
                done_ids.append(jid)

        for jid in done_ids:
            job = self.running.pop(jid)
            if job.status == "done":
                self.completed.append(job)
            elif job.can_retry():
                job.status = "pending"
                self.queue.push(job)
            else:
                # TODO: append to self.failed
                pass

        # Start new jobs
        while self._can_run_more() and len(self.queue) > 0:
            job = self.queue.pop()
            if job:
                self.running[job.job_id] = job
                job.run()

    def run_all(self, max_ticks=100):
        tick = 0
        while (len(self.queue) > 0 or len(self.running) > 0) and tick < max_ticks:
            self.tick()
            tick += 1
        return tick

    def stats(self):
        return {
            "completed": len(self.completed),
            "failed": len(self.failed),
            "pending": len(self.queue),
            "running": len(self.running),
            # TODO: average duration of completed jobs in ms
            "avg_duration_ms": 0,
        }


# ---- Driver ----
sched = Scheduler(max_workers=2)

def make_job(n):
    def job():
        return n * n
    return job

def failing_job():
    raise ValueError("Simulated failure")

for i in range(1, 6):
    sched.submit(f"square_{i}", make_job(i), priority=i)

sched.submit("will_fail", failing_job, priority=2, max_retries=2)

ticks = sched.run_all()
print(f"Finished in {ticks} ticks")
print("Stats:", sched.stats())
print("Completed jobs:", [j.name for j in sched.completed])
print("Failed jobs:", [j.name for j in sched.failed])
print("Results:", [j.result for j in sched.completed if j.result is not None])
`;

const PYTHON_DATAPROCESSOR_CODE = `
# DEVCEPTION CHALLENGE — Data Pipeline & Analytics Engine
# Fix bugs and complete missing aggregation logic.

from collections import defaultdict
import statistics

class Record:
    def __init__(self, record_id, source, data, timestamp=None):
        self.record_id = record_id
        self.source = source
        self.data = dict(data)
        self.timestamp = timestamp or 0
        self.tags = []
        self.processed = False

    def get(self, key, default=None):
        return self.data.get(key, default)

    def set(self, key, value):
        self.data[key] = value

    def tag(self, *tags):
        for t in tags:
            if t not in self.tags:
                self.tags.append(t)


class Filter:
    def __init__(self, field, op, value):
        self.field = field
        self.op = op    # 'eq','ne','gt','lt','gte','lte','in','contains'
        self.value = value

    def matches(self, record):
        v = record.get(self.field)
        if v is None:
            return False
        if self.op == 'eq':      return v == self.value
        if self.op == 'ne':      return v != self.value
        if self.op == 'gt':      return v > self.value
        if self.op == 'lt':
            # BUG: uses > instead of <
            return v > self.value
        if self.op == 'gte':     return v >= self.value
        if self.op == 'lte':     return v <= self.value
        if self.op == 'in':      return v in self.value
        if self.op == 'contains':
            # BUG: checks if value contains v, should be v contains self.value
            return self.value in v
        return False


class Pipeline:
    def __init__(self, name):
        self.name = name
        self.stages = []   # list of (stage_type, config)
        self.records = []
        self.errors = []

    def add_stage(self, stage_type, **config):
        self.stages.append((stage_type, config))
        return self

    def _apply_filter(self, records, config):
        f = Filter(config['field'], config['op'], config['value'])
        return [r for r in records if f.matches(r)]

    def _apply_transform(self, records, config):
        field = config['field']
        fn = config['fn']
        for r in records:
            try:
                r.set(field, fn(r.get(field)))
            except Exception as e:
                self.errors.append({'record_id': r.record_id, 'error': str(e)})
        return records

    def _apply_enrich(self, records, config):
        new_field = config['new_field']
        fn = config['fn']
        for r in records:
            # TODO: set new_field on record using fn(record)
            pass
        return records

    def _apply_dedupe(self, records, config):
        key = config['key']
        seen = set()
        result = []
        for r in records:
            k = r.get(key)
            # BUG: adds duplicate instead of skipping — fix logic
            if k in seen:
                result.append(r)
            else:
                seen.add(k)
        return result

    def run(self, records):
        self.records = list(records)
        current = list(records)
        for stage_type, config in self.stages:
            if stage_type == 'filter':    current = self._apply_filter(current, config)
            elif stage_type == 'transform': current = self._apply_transform(current, config)
            elif stage_type == 'enrich':  current = self._apply_enrich(current, config)
            elif stage_type == 'dedupe':  current = self._apply_dedupe(current, config)
        for r in current:
            r.processed = True
        return current


class Aggregator:
    def __init__(self, records):
        self.records = records

    def group_by(self, field):
        groups = defaultdict(list)
        for r in self.records:
            groups[r.get(field)].append(r)
        return dict(groups)

    def count(self, group_field=None):
        if group_field is None:
            return len(self.records)
        groups = self.group_by(group_field)
        return {k: len(v) for k, v in groups.items()}

    def sum(self, value_field, group_field=None):
        if group_field is None:
            return sum(r.get(value_field, 0) for r in self.records)
        groups = self.group_by(group_field)
        # TODO: return dict of group -> sum of value_field
        return {}

    def average(self, value_field, group_field=None):
        if group_field is None:
            vals = [r.get(value_field) for r in self.records if r.get(value_field) is not None]
            # BUG: uses sum() instead of statistics.mean() — will fail on empty list
            return sum(vals) if vals else 0
        groups = self.group_by(group_field)
        result = {}
        for k, recs in groups.items():
            vals = [r.get(value_field) for r in recs if r.get(value_field) is not None]
            result[k] = statistics.mean(vals) if vals else 0
        return result

    def top_n(self, value_field, n=5, descending=True):
        # TODO: return top n records sorted by value_field
        return []


# ---- Driver ----
records = [
    Record("r1", "web",    {"user": "alice", "region": "US", "revenue": 120, "clicks": 5}),
    Record("r2", "mobile", {"user": "bob",   "region": "EU", "revenue":  80, "clicks": 3}),
    Record("r3", "web",    {"user": "carol", "region": "US", "revenue": 200, "clicks": 9}),
    Record("r4", "web",    {"user": "alice", "region": "US", "revenue": 150, "clicks": 7}),
    Record("r5", "mobile", {"user": "bob",   "region": "EU", "revenue":  60, "clicks": 2}),
    Record("r6", "web",    {"user": "dave",  "region": "AP", "revenue": 300, "clicks":12}),
]

pipe = Pipeline("revenue_pipe")
pipe.add_stage("dedupe", key="user")
pipe.add_stage("filter", field="revenue", op="gt", value=70)
pipe.add_stage("enrich", new_field="revenue_per_click",
               fn=lambda r: round(r.get("revenue",0) / max(r.get("clicks",1),1), 2))

result = pipe.run(records)
print("Processed:", len(result), "records")

agg = Aggregator(result)
print("Count by region:", agg.count("region"))
print("Total revenue:", agg.sum("revenue"))
print("Avg revenue by source:", agg.average("revenue", "source"))
print("Top 3 by revenue:", [r.get("user") for r in agg.top_n("revenue", 3)])
`;

// ============================================================
//  ADDITIONAL C++ TEMPLATES
// ============================================================

const CPP_NETWORK_CODE = `
// DEVCEPTION CHALLENGE — Graph Network & Pathfinding
// Fix bugs and complete the missing algorithms.
#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <set>
#include <climits>
#include <algorithm>
using namespace std;

struct Edge {
    string to;
    int weight;
};

class Graph {
public:
    unordered_map<string, vector<Edge>> adj;
    bool directed;

    Graph(bool directed = false) : directed(directed) {}

    void addEdge(const string& from, const string& to, int weight = 1) {
        adj[from].push_back({to, weight});
        if (!directed) {
            // BUG: adds undirected edge with wrong weight (weight+1)
            adj[to].push_back({from, weight + 1});
        }
        // Ensure nodes exist even if no outgoing edges
        if (adj.find(to) == adj.end()) adj[to] = {};
    }

    vector<string> nodes() const {
        vector<string> result;
        for (auto& [node, _] : adj) result.push_back(node);
        return result;
    }

    // BFS shortest path (unweighted)
    vector<string> bfs(const string& start, const string& end) {
        unordered_map<string, string> parent;
        queue<string> q;
        set<string> visited;
        q.push(start);
        visited.insert(start);
        parent[start] = "";

        while (!q.empty()) {
            string cur = q.front(); q.pop();
            if (cur == end) {
                // Reconstruct path
                vector<string> path;
                for (string n = end; n != ""; n = parent[n])
                    path.push_back(n);
                // BUG: path is built correctly but needs to be reversed
                return path;
            }
            for (auto& e : adj.at(cur)) {
                if (visited.find(e.to) == visited.end()) {
                    visited.insert(e.to);
                    parent[e.to] = cur;
                    q.push(e.to);
                }
            }
        }
        return {}; // no path
    }

    // Dijkstra shortest weighted path
    pair<int, vector<string>> dijkstra(const string& start, const string& end) {
        unordered_map<string, int> dist;
        unordered_map<string, string> parent;
        // min-heap: (distance, node)
        priority_queue<pair<int,string>, vector<pair<int,string>>, greater<>> pq;

        for (auto& [n, _] : adj) dist[n] = INT_MAX;
        dist[start] = 0;
        pq.push({0, start});
        parent[start] = "";

        while (!pq.empty()) {
            auto [d, cur] = pq.top(); pq.pop();
            // BUG: missing early termination when cur == end
            if (d > dist[cur]) continue;
            for (auto& e : adj.at(cur)) {
                int newDist = dist[cur] + e.weight;
                if (newDist < dist[e.to]) {
                    dist[e.to] = newDist;
                    parent[e.to] = cur;
                    pq.push({newDist, e.to});
                }
            }
        }

        if (dist[end] == INT_MAX) return {-1, {}};
        vector<string> path;
        for (string n = end; n != ""; n = parent[n]) path.push_back(n);
        reverse(path.begin(), path.end());
        return {dist[end], path};
    }

    bool hasCycle() {
        set<string> visited, recStack;
        function<bool(const string&)> dfs = [&](const string& node) -> bool {
            visited.insert(node);
            recStack.insert(node);
            for (auto& e : adj.at(node)) {
                if (recStack.count(e.to)) return true;
                // BUG: should also check if not yet visited before recursing
                if (dfs(e.to)) return true;
            }
            recStack.erase(node);
            return false;
        };
        for (auto& [n, _] : adj)
            if (!visited.count(n) && dfs(n)) return true;
        return false;
    }

    // TODO: implement topological sort (Kahn's algorithm)
    vector<string> topoSort() {
        return {};
    }

    int connectedComponents() {
        set<string> visited;
        int count = 0;
        function<void(const string&)> dfs = [&](const string& n) {
            visited.insert(n);
            for (auto& e : adj.at(n))
                if (!visited.count(e.to)) dfs(e.to);
        };
        for (auto& [n, _] : adj) {
            if (!visited.count(n)) {
                dfs(n);
                // BUG: forgets to increment count
            }
        }
        return count;
    }
};

int main() {
    Graph g(false);
    g.addEdge("A", "B", 4);
    g.addEdge("A", "C", 2);
    g.addEdge("B", "D", 3);
    g.addEdge("C", "D", 1);
    g.addEdge("C", "E", 5);
    g.addEdge("D", "E", 1);

    auto bfsPath = g.bfs("A", "E");
    cout << "BFS A->E: ";
    for (auto& n : bfsPath) cout << n << " ";
    cout << endl;

    auto [cost, path] = g.dijkstra("A", "E");
    cout << "Dijkstra A->E cost=" << cost << " path: ";
    for (auto& n : path) cout << n << " ";
    cout << endl;

    cout << "Has cycle: " << (g.hasCycle() ? "yes" : "no") << endl;
    cout << "Components: " << g.connectedComponents() << endl;

    // Directed graph for topo sort
    Graph dag(true);
    dag.addEdge("build", "test");
    dag.addEdge("test", "deploy");
    dag.addEdge("lint", "test");
    auto topo = dag.topoSort();
    cout << "Topo: ";
    for (auto& n : topo) cout << n << " ";
    cout << endl;

    return 0;
}
`;

const CPP_STRINGPARSER_CODE = `
// DEVCEPTION CHALLENGE — String Parser & Expression Evaluator
// Fix bugs and complete missing parsing logic.
#include <iostream>
#include <string>
#include <vector>
#include <stack>
#include <unordered_map>
#include <sstream>
#include <stdexcept>
#include <cctype>
using namespace std;

// ---- Tokenizer ----
enum class TokenType { NUMBER, IDENT, OP, LPAREN, RPAREN, END };

struct Token {
    TokenType type;
    string value;
};

vector<Token> tokenize(const string& expr) {
    vector<Token> tokens;
    size_t i = 0;
    while (i < expr.size()) {
        if (isspace(expr[i])) { i++; continue; }
        if (isdigit(expr[i]) || (expr[i] == '.' && i+1 < expr.size() && isdigit(expr[i+1]))) {
            size_t j = i;
            while (j < expr.size() && (isdigit(expr[j]) || expr[j] == '.')) j++;
            tokens.push_back({TokenType::NUMBER, expr.substr(i, j - i)});
            i = j;
        } else if (isalpha(expr[i]) || expr[i] == '_') {
            size_t j = i;
            while (j < expr.size() && (isalnum(expr[j]) || expr[j] == '_')) j++;
            tokens.push_back({TokenType::IDENT, expr.substr(i, j - i)});
            i = j;
        } else if (string("+-*/^%").find(expr[i]) != string::npos) {
            tokens.push_back({TokenType::OP, string(1, expr[i])});
            i++;
        } else if (expr[i] == '(') {
            tokens.push_back({TokenType::LPAREN, "("});
            i++;
        } else if (expr[i] == ')') {
            tokens.push_back({TokenType::RPAREN, ")"});
            i++;
        } else {
            throw runtime_error("Unknown character: " + string(1, expr[i]));
        }
    }
    tokens.push_back({TokenType::END, ""});
    return tokens;
}

// ---- Shunting-Yard to RPN ----
int precedence(const string& op) {
    if (op == "+" || op == "-") return 1;
    if (op == "*" || op == "/") return 2;
    // BUG: ^ (power) should have highest precedence (3), currently returns 2
    if (op == "^") return 2;
    return 0;
}

bool isRightAssoc(const string& op) { return op == "^"; }

vector<Token> toRPN(const vector<Token>& tokens) {
    vector<Token> output;
    stack<Token> ops;
    for (const auto& tok : tokens) {
        if (tok.type == TokenType::NUMBER || tok.type == TokenType::IDENT) {
            output.push_back(tok);
        } else if (tok.type == TokenType::OP) {
            while (!ops.empty() && ops.top().type == TokenType::OP) {
                int topPrec = precedence(ops.top().value);
                int curPrec = precedence(tok.value);
                // BUG: right-associative check inverted — should pop when topPrec > curPrec
                // OR (topPrec == curPrec AND NOT rightAssoc)
                if (topPrec >= curPrec) {
                    output.push_back(ops.top()); ops.pop();
                } else break;
            }
            ops.push(tok);
        } else if (tok.type == TokenType::LPAREN) {
            ops.push(tok);
        } else if (tok.type == TokenType::RPAREN) {
            while (!ops.empty() && ops.top().type != TokenType::LPAREN) {
                output.push_back(ops.top()); ops.pop();
            }
            if (ops.empty()) throw runtime_error("Mismatched parentheses");
            ops.pop(); // discard LPAREN
        } else if (tok.type == TokenType::END) {
            break;
        }
    }
    while (!ops.empty()) {
        if (ops.top().type == TokenType::LPAREN) throw runtime_error("Mismatched parentheses");
        output.push_back(ops.top()); ops.pop();
    }
    return output;
}

// ---- RPN Evaluator ----
double evalRPN(const vector<Token>& rpn, const unordered_map<string,double>& vars) {
    stack<double> s;
    for (const auto& tok : rpn) {
        if (tok.type == TokenType::NUMBER) {
            s.push(stod(tok.value));
        } else if (tok.type == TokenType::IDENT) {
            auto it = vars.find(tok.value);
            if (it == vars.end()) throw runtime_error("Undefined variable: " + tok.value);
            s.push(it->second);
        } else if (tok.type == TokenType::OP) {
            if (s.size() < 2) throw runtime_error("Not enough operands");
            double b = s.top(); s.pop();
            double a = s.top(); s.pop();
            if (tok.value == "+") s.push(a + b);
            else if (tok.value == "-") s.push(a - b);
            else if (tok.value == "*") s.push(a * b);
            else if (tok.value == "/") {
                // BUG: divides b by a instead of a by b
                if (b == 0) throw runtime_error("Division by zero");
                s.push(b / a);
            }
            // TODO: handle ^ (power) and % (modulo)
        }
    }
    if (s.size() != 1) throw runtime_error("Invalid expression");
    return s.top();
}

double evaluate(const string& expr, const unordered_map<string,double>& vars = {}) {
    auto tokens = tokenize(expr);
    auto rpn    = toRPN(tokens);
    return evalRPN(rpn, vars);
}

// ---- String Utilities ----
vector<string> split(const string& s, char delim) {
    vector<string> result;
    stringstream ss(s);
    string token;
    while (getline(ss, token, delim)) {
        // BUG: should push token, currently pushes s (the original string)
        result.push_back(s);
    }
    return result;
}

string trim(const string& s) {
    // TODO: remove leading and trailing whitespace
    return s;
}

string replace_all(string s, const string& from, const string& to) {
    size_t pos = 0;
    while ((pos = s.find(from, pos)) != string::npos) {
        s.replace(pos, from.size(), to);
        // BUG: pos not advanced — causes infinite loop when 'to' contains 'from'
        pos += 0;
    }
    return s;
}

int main() {
    cout << "3 + 4 * 2 = "     << evaluate("3 + 4 * 2")     << endl; // 11
    cout << "(3+4) * 2 = "     << evaluate("(3 + 4) * 2")   << endl; // 14
    cout << "10 / 2 - 1 = "    << evaluate("10 / 2 - 1")    << endl; // 4
    cout << "2 ^ 3 ^ 2 = "     << evaluate("2 ^ 3 ^ 2")     << endl; // 512 (right-assoc)

    unordered_map<string,double> vars = {{"x", 3.0}, {"y", 4.0}};
    cout << "x*x + y*y = "     << evaluate("x * x + y * y", vars) << endl; // 25

    auto parts = split("hello,world,foo", ',');
    cout << "Split: ";
    for (auto& p : parts) cout << "[" << p << "]";
    cout << endl;

    cout << "Trim: [" << trim("  hello  ") << "]" << endl;
    cout << "Replace: " << replace_all("aabbaa", "aa", "x") << endl; // xbbx

    return 0;
}
`;

const CPP_MEMORYPOOL_CODE = `
// DEVCEPTION CHALLENGE — Memory Pool & Smart Pointer System
// Fix bugs and implement missing memory management logic.
#include <iostream>
#include <vector>
#include <unordered_map>
#include <functional>
#include <stdexcept>
#include <cstring>
using namespace std;

// ---- Memory Pool ----
class MemoryPool {
    struct Block { void* ptr; size_t size; bool inUse; };
    vector<Block> blocks;
    size_t blockSize;
    size_t capacity;
    size_t allocated = 0;

public:
    MemoryPool(size_t blockSize, size_t capacity)
        : blockSize(blockSize), capacity(capacity) {
        blocks.resize(capacity);
        for (auto& b : blocks) {
            b.ptr = malloc(blockSize);
            b.size = blockSize;
            b.inUse = false;
        }
    }

    void* acquire() {
        for (auto& b : blocks) {
            if (!b.inUse) {
                b.inUse = true;
                allocated++;
                return b.ptr;
            }
        }
        throw runtime_error("Pool exhausted");
    }

    void release(void* ptr) {
        for (auto& b : blocks) {
            if (b.ptr == ptr) {
                if (!b.inUse) throw runtime_error("Double free detected");
                b.inUse = false;
                // BUG: decrements allocated but doesn't zero the memory
                allocated--;
                return;
            }
        }
        throw runtime_error("Pointer not from this pool");
    }

    size_t usedBlocks()  const { return allocated; }
    size_t freeBlocks()  const {
        // BUG: should be capacity - allocated, currently returns allocated
        return allocated;
    }
    size_t totalBlocks() const { return capacity; }

    ~MemoryPool() {
        for (auto& b : blocks) free(b.ptr);
    }
};

// ---- Reference-Counted Smart Pointer ----
template<typename T>
class SharedPtr {
    T* ptr;
    int* refCount;

public:
    explicit SharedPtr(T* p = nullptr) : ptr(p), refCount(new int(p ? 1 : 0)) {}

    SharedPtr(const SharedPtr& other) : ptr(other.ptr), refCount(other.refCount) {
        // BUG: should increment refCount, currently does nothing
    }

    SharedPtr& operator=(const SharedPtr& other) {
        if (this == &other) return *this;
        decrement();
        ptr = other.ptr;
        refCount = other.refCount;
        (*refCount)++;
        return *this;
    }

    SharedPtr(SharedPtr&& other) noexcept : ptr(other.ptr), refCount(other.refCount) {
        other.ptr = nullptr;
        other.refCount = nullptr;
    }

    void decrement() {
        if (!refCount) return;
        (*refCount)--;
        if (*refCount == 0) {
            delete ptr;
            delete refCount;
            ptr = nullptr;
            refCount = nullptr;
        }
    }

    ~SharedPtr() { decrement(); }

    T& operator*()  { if (!ptr) throw runtime_error("Null deref"); return *ptr; }
    T* operator->() { if (!ptr) throw runtime_error("Null deref"); return ptr; }
    T* get() const  { return ptr; }
    int useCount() const { return refCount ? *refCount : 0; }
    bool valid() const { return ptr != nullptr; }
};

// ---- Object Cache with Eviction ----
template<typename K, typename V>
class LRUCache {
    struct Entry { V value; int lastUsed; };
    unordered_map<K, Entry> cache;
    size_t maxSize;
    int clock = 0;

public:
    LRUCache(size_t maxSize) : maxSize(maxSize) {}

    void put(const K& key, const V& value) {
        if (cache.size() >= maxSize && cache.find(key) == cache.end()) {
            evict();
        }
        cache[key] = {value, clock++};
    }

    bool get(const K& key, V& out) {
        auto it = cache.find(key);
        if (it == cache.end()) return false;
        // TODO: update lastUsed to current clock value before returning
        out = it->second.value;
        return true;
    }

    void evict() {
        if (cache.empty()) return;
        auto oldest = cache.begin();
        for (auto it = cache.begin(); it != cache.end(); ++it) {
            // BUG: evicts most-recently-used (highest lastUsed) instead of LRU
            if (it->second.lastUsed > oldest->second.lastUsed) oldest = it;
        }
        cache.erase(oldest);
    }

    size_t size() const { return cache.size(); }
    bool contains(const K& key) const { return cache.find(key) != cache.end(); }
};

// ---- Driver ----
int main() {
    // Pool test
    MemoryPool pool(64, 4);
    cout << "Free blocks: " << pool.freeBlocks() << "/" << pool.totalBlocks() << endl;

    void* a = pool.acquire();
    void* b = pool.acquire();
    cout << "After 2 acquires — used: " << pool.usedBlocks() << endl;

    pool.release(a);
    cout << "After release — free: " << pool.freeBlocks() << endl;

    // SharedPtr test
    SharedPtr<int> p1(new int(42));
    cout << "p1 value: " << *p1 << " refcount: " << p1.useCount() << endl;
    {
        SharedPtr<int> p2 = p1;
        cout << "p2 value: " << *p2 << " refcount: " << p1.useCount() << endl;
    }
    cout << "After p2 gone, refcount: " << p1.useCount() << endl;

    // LRU Cache test
    LRUCache<string, int> lru(3);
    lru.put("a", 1); lru.put("b", 2); lru.put("c", 3);
    int v;
    lru.get("a", v); // access a -> now b is LRU
    lru.put("d", 4); // should evict b
    cout << "Has 'b': " << (lru.contains("b") ? "yes" : "no") << endl; // no
    cout << "Has 'a': " << (lru.contains("a") ? "yes" : "no") << endl; // yes
    cout << "Cache size: " << lru.size() << endl;

    return 0;
}
`;

type Language = 'javascript' | 'python' | 'cpp';

const TASK_BANKS: Record<Language, typeof JS_TASKS> = {
  javascript: JS_TASKS,
  python: PYTHON_TASKS,
  cpp: CPP_TASKS,
};

const CODE_TEMPLATES: Record<Language, string[]> = {
  javascript: [JS_MAIN_CODE, JS_SOCIAL_CODE, JS_EVENTS_CODE, JS_ECOMMERCE_CODE, JS_TASKMANAGER_CODE, JS_CHATAPP_CODE, JS_RPGGAME_CODE],
  python: [PYTHON_MAIN_CODE, PYTHON_LIBRARY_CODE, PYTHON_WEATHER_CODE, PYTHON_SOCIAL_CODE, PYTHON_SCHEDULER_CODE, PYTHON_DATAPROCESSOR_CODE],
  cpp: [CPP_MAIN_CODE, CPP_GRADES_CODE, CPP_FILESYSTEM_CODE, CPP_NETWORK_CODE, CPP_STRINGPARSER_CODE, CPP_MEMORYPOOL_CODE],
};

// Per-template test cases: regex patterns that match FIXED code (not buggy code)
const TEMPLATE_TEST_CASES: Map<string, MainTestCase[]> = new Map([
  [JS_MAIN_CODE, [
    { id: 'js_inv_1', description: 'addToCart: Stock check before adding item', pattern: /product\.stock\s*[<>]=?\s*quantity/ },
    { id: 'js_inv_2', description: 'calculateCartTotal: Discount is subtracted, not added', pattern: /subtotal\s*-\s*discountAmount/ },
    { id: 'js_inv_3', description: 'getTopProducts: Does not mutate original array', pattern: /\[\.\.\..*products\]|products\.slice\s*\(\s*\)/ },
    { id: 'js_inv_4', description: 'getLowStockAlerts: Threshold is stock < 10', pattern: /p\.stock\s*<\s*10/ },
    { id: 'js_inv_5', description: 'addReview: avgRating uses correct divisor', pattern: /reviews\.length(?!\s*-\s*1)/ },
    { id: 'js_inv_6', description: 'restockProduct: Increments product.stock (not sold)', pattern: /product\.stock\s*\+=/ },
    { id: 'js_inv_7', description: 'checkout: Function implemented with orderId', pattern: /function checkout[\s\S]*?\borderId\b/ },
  ]],
  [JS_SOCIAL_CODE, [
    { id: 'js_soc_1', description: 'followUser: Prevents duplicate follows', pattern: /includes\s*\(\s*targetId\s*\)|\.has\s*\(\s*targetId\s*\)/ },
    { id: 'js_soc_2', description: 'getFeed: Filters posts by followed users', pattern: /following\.includes|user\.following/ },
    { id: 'js_soc_3', description: 'likePost: Prevents duplicate likes', pattern: /likedBy|likes.*includes|\.has\s*\(\s*userId\s*\)/ },
    { id: 'js_soc_4', description: 'getTopPosts: Score includes comment weight', pattern: /comments\.length/ },
    { id: 'js_soc_5', description: 'isFollowing: Checks correct user\'s following list', pattern: /users\.get\s*\(\s*userId\s*\)|\.get\s*\(\s*userId\s*\)/ },
    { id: 'js_soc_6', description: 'getStats: avgLikesPerPost uses correct divisor', pattern: /posts\.length(?!\s*-\s*1)/ },
  ]],
  [JS_EVENTS_CODE, [
    { id: 'js_evt_1', description: 'registerForEvent: Capacity check before enrolling', pattern: /attendees\.length\s*[<>]=?\s*[a-zA-Z_$][\w.$]*capacity|capacity\s*[<>]=?\s*[a-zA-Z_$][\w.$]*attendees\.length/ },
    { id: 'js_evt_2', description: 'getUpcomingEvents: Excludes cancelled events', pattern: /!.*isCancelled|isCancelled.*!/ },
    { id: 'js_evt_3', description: 'getEventDuration: Duration clamped to 0 minimum', pattern: /Math\.max\s*\(\s*0/ },
    { id: 'js_evt_4', description: 'getMostPopularEvents: Sorts by fill percentage', pattern: /attendees\.length\s*\/.*capacity|\/\s*capacity/ },
  ]],
  [JS_ECOMMERCE_CODE, [
    { id: 'js_eco_1', description: 'Product: Stock decrements on purchase', pattern: /this\.stock\s*-=|stock\s*-=\s*qty/ },
    { id: 'js_eco_2', description: 'Cart.removeItem: Actually filters items', pattern: /this\.items\s*=\s*this\.items\.filter/ },
    { id: 'js_eco_3', description: 'Cart.getTotal: Correctly sums all items', pattern: /\.reduce\s*\(|reduce\s*\(.*sum/ },
    { id: 'js_eco_4', description: 'Order: Uses order total, not item price', pattern: /o\.total|order\.total/ },
  ]],
  [JS_TASKMANAGER_CODE, [
    { id: 'js_tm_1', description: 'completeSubtask: Sets st.done = true', pattern: /st\.done\s*=\s*true/ },
    { id: 'js_tm_2', description: 'getByPriority: Sorts ascending (1=highest)', pattern: /a\.priority\s*-\s*b\.priority|a\.priority\s*<\s*b\.priority/ },
    { id: 'js_tm_3', description: 'filterByTag: Uses includes for array match', pattern: /\.includes\s*\(\s*tag\s*\)/ },
    { id: 'js_tm_4', description: 'getDueSoon: Sorts by dueDate ascending', pattern: /a\.dueDate\s*-\s*b\.dueDate/ },
  ]],
  [JS_CHATAPP_CODE, [
    { id: 'js_chat_1', description: 'removeReaction: Removes user from set, not whole emoji', pattern: /reactions.*delete\s*\(userId\)|delete.*userId/ },
    { id: 'js_chat_2', description: 'editMessage: Sets edited = true', pattern: /this\.edited\s*=\s*true/ },
    { id: 'js_chat_3', description: 'getMessagesBefore: Filters messages with timestamp <', pattern: /m\.timestamp\s*<\s*timestamp|timestamp.*<.*m\.timestamp/ },
    { id: 'js_chat_4', description: 'getOnlineUsers: Returns online users', pattern: /\.isOnline|status.*online/ },
  ]],
  [JS_RPGGAME_CODE, [
    { id: 'js_rpg_1', description: 'isAlive: Returns true when hp > 0', pattern: /this\.hp\s*>\s*0/ },
    { id: 'js_rpg_2', description: 'takeDamage: Subtracts damage from hp', pattern: /this\.hp\s*-=/ },
    { id: 'js_rpg_3', description: 'tickStatusEffects: Filters expired statuses', pattern: /\.filter\s*\(.*duration|duration.*filter/ },
    { id: 'js_rpg_4', description: 'battle: Faster unit attacks first', pattern: /speed|initiative/ },
  ]],
  [PYTHON_MAIN_CODE, [
    { id: 'py_tm_1', description: 'get_high_priority_tasks: Uses >= for high priority check', pattern: />=\s*order\.index|order\.index\s*\(['"']high['"']\)|>=\s*2/ },
    { id: 'py_tm_2', description: 'get_overdue_tasks: due_date < now (not >)', pattern: /due_date\s*<\s*now/ },
    { id: 'py_tm_3', description: 'log_time: Uses += to accumulate time', pattern: /time_spent\s*\+=/ },
    { id: 'py_tm_4', description: 'get_completion_stats: Divides by total (not total-1)', pattern: /completed\s*\/\s*total(?!\s*-\s*1)/ },
    { id: 'py_tm_5', description: 'filter_by_tag: Keeps tasks WITH the tag', pattern: /tag\s+in\s+t\.tags/ },
    { id: 'py_tm_6', description: 'extend_due_date: Uses timedelta(days=...)', pattern: /timedelta\s*\(\s*days\s*=/ },
  ]],
  [PYTHON_LIBRARY_CODE, [
    { id: 'py_lib_1', description: 'borrow_book: Checks available_copies > 0', pattern: /available_copies\s*>\s*0/ },
    { id: 'py_lib_2', description: 'search_books: Case-insensitive substring match', pattern: /\.lower\s*\(\s*\)|casefold\s*\(\s*\)/ },
    { id: 'py_lib_3', description: 'get_members_in_good_standing: Fines == 0 filter', pattern: /fines\s*==\s*0/ },
    { id: 'py_lib_4', description: 'get_avg_rating: Divides by len(ratings)', pattern: /len\s*\(\s*book\.ratings\s*\)(?!\s*-\s*1)/ },
    { id: 'py_lib_5', description: 'get_available_books: Counts available_copies', pattern: /available_copies(?!.*total_copies)/ },
  ]],
  [PYTHON_WEATHER_CODE, [
    { id: 'py_wx_1', description: 'celsius_to_fahrenheit: Correct formula (×9/5 + 32)', pattern: /9\s*\/\s*5|9\/5/ },
    { id: 'py_wx_2', description: 'get_max_temp: Uses max() not min()', pattern: /max\s*\(\s*r\.temp_c/ },
    { id: 'py_wx_3', description: 'analyze_temp_trend: Compares temp_c values', pattern: /temp_c(?!.*humidity)/ },
    { id: 'py_wx_4', description: 'get_dominant_condition: Returns condition string', pattern: /max\s*\([^)]+key\s*=/ },
  ]],
  [PYTHON_SOCIAL_CODE, [
    { id: 'py_soc_1', description: 'follow: Also adds self to other\'s followers', pattern: /followers\.add\s*\(\s*self\.user_id\s*\)/ },
    { id: 'py_soc_2', description: 'like_post: Adds to user\'s liked_posts', pattern: /liked_posts/ },
    { id: 'py_soc_3', description: 'get_timeline: Sorts newest first (descending)', pattern: /reverse\s*=\s*True|key.*created_at.*reverse/ },
  ]],
  [PYTHON_SCHEDULER_CODE, [
    { id: 'py_sch_1', description: 'run_job: Sets status to "done" on success', pattern: /status\s*=\s*['"]done['"]/ },
    { id: 'py_sch_2', description: 'add_job: Uses heapq.heappush for priority queue', pattern: /heapq\.heappush/ },
    { id: 'py_sch_3', description: 'get_next_job: Uses heapq.heappop', pattern: /heapq\.heappop/ },
  ]],
  [PYTHON_DATAPROCESSOR_CODE, [
    { id: 'py_dp_1', description: 'FilterStep: Uses < for less-than comparison', pattern: /['"']<['"]|operator.*lt/ },
    { id: 'py_dp_2', description: 'ContainsFilter: Checks if value contains pattern', pattern: /self\.value\s+in\s+v|value.*in.*self\.value/ },
    { id: 'py_dp_3', description: 'TransformStep.update_field: Applies transform fn', pattern: /setattr|record\[.*\]\s*=\s*fn\s*\(|fn\s*\(record/ },
  ]],
  [CPP_MAIN_CODE, [
    { id: 'cpp_bank_1', description: 'deposit: Checks account is not frozen', pattern: /frozen.*return\s+false|if\s*\(.*frozen/ },
    { id: 'cpp_bank_2', description: 'withdraw: Correct overdraft comparison (>=)', pattern: /overdraftLimit\s*>=\s*amount|balance\s*\+\s*overdraftLimit\s*>=/ },
    { id: 'cpp_bank_3', description: 'getStats: avgBalance divides by count', pattern: /total\s*\/\s*count(?!\s*-\s*1)/ },
    { id: 'cpp_bank_4', description: 'getStatement: Returns all transaction types', pattern: /(?<!type\s*==\s*")withdrawal(?!")/ },
    { id: 'cpp_bank_5', description: 'getTopAccounts: Sorts descending by balance', pattern: /a->balance\s*>\s*b->balance|b->balance\s*<\s*a->balance/ },
    { id: 'cpp_bank_6', description: 'applyInterest: Function implemented', pattern: /void applyInterest[\s\S]{40,}balance\s*\+=/ },
  ]],
  [CPP_GRADES_CODE, [
    { id: 'cpp_grd_1', description: 'enroll: Checks maxCapacity before enrolling', pattern: /enrolledStudents\.size\s*\(\s*\)\s*<\s*maxCapacity|maxCapacity/ },
    { id: 'cpp_grd_2', description: 'calculateGrade: Divides by totalWeight', pattern: /totalWeight(?!\s*==\s*0)/ },
    { id: 'cpp_grd_3', description: 'getTopPerformers: Sorts descending', pattern: /a\.second\s*>\s*b\.second/ },
    { id: 'cpp_grd_4', description: 'addScore: Clamps score to maxScore', pattern: /score\s*<=\s*a\.maxScore|score\s*>\s*a\.maxScore/ },
    { id: 'cpp_grd_5', description: 'getOverallGPA: Divides by count (not enrolledCourses.size)', pattern: /total\s*\/\s*count(?!\s*-\s*1)/ },
  ]],
  [CPP_FILESYSTEM_CODE, [
    { id: 'cpp_fs_1', description: 'createFile: Updates parent directory size', pattern: /parent->size\s*\+=|size\s*\+=.*size/ },
    { id: 'cpp_fs_2', description: 'deleteNode: Frees memory before erasing', pattern: /delete\s+it->second|delete.*->second/ },
    { id: 'cpp_fs_3', description: 'getDirSize: Recursively sums subdirectory sizes', pattern: /getDirSize\s*\(|recursive|getSize\s*\(/ },
  ]],
  [CPP_NETWORK_CODE, [
    { id: 'cpp_net_1', description: 'addEdge: Undirected edge preserves weight', pattern: /adj\[to\]\.push_back\s*\(\s*\{\s*from\s*,\s*weight\s*\}/ },
    { id: 'cpp_net_2', description: 'bfs: Reverses path before returning', pattern: /vector<string>\s+bfs[\s\S]*?reverse\s*\(\s*path/ },
    { id: 'cpp_net_3', description: 'dijkstra: Early termination when end reached', pattern: /dijkstra[\s\S]*?if\s*\(\s*cur\s*==\s*end\s*\)/ },
    { id: 'cpp_net_4', description: 'hasCycle: Checks unvisited before recursing', pattern: /hasCycle[\s\S]*?!\s*visited\.count\s*\(\s*e\.to\s*\)/ },
    { id: 'cpp_net_5', description: 'topoSort: Implements Kahn\'s algorithm', pattern: /topoSort[\s\S]*?(?:queue<|in_degree|inDegree|indegree)/ },
    { id: 'cpp_net_6', description: 'connectedComponents: Increments count after dfs', pattern: /dfs\s*\(\s*n\s*\)\s*;\s*count\s*\+\+/ },
  ]],
  [CPP_STRINGPARSER_CODE, [
    { id: 'cpp_str_1', description: 'precedence: ^ returns 3 (highest)', pattern: /op\s*==\s*"\^"\s*\)\s*return\s+3/ },
    { id: 'cpp_str_2', description: 'evalRPN: Division computes a / b (not b / a)', pattern: /s\.push\s*\(\s*a\s*\/\s*b\s*\)/ },
    { id: 'cpp_str_3', description: 'split: Pushes token (not original string)', pattern: /result\.push_back\s*\(\s*token\s*\)/ },
    { id: 'cpp_str_4', description: 'replace_all: Advances pos to avoid infinite loop', pattern: /pos\s*\+=\s*to\.(size|length)\s*\(\s*\)/ },
    { id: 'cpp_str_5', description: 'trim: Strips leading/trailing whitespace', pattern: /trim[\s\S]*?(?:isspace|find_first_not_of|find_last_not_of)/ },
  ]],
  [CPP_MEMORYPOOL_CODE, [
    { id: 'cpp_mem_1', description: 'freeBlocks: Returns capacity - allocated', pattern: /return\s+capacity\s*-\s*allocated/ },
    { id: 'cpp_mem_2', description: 'SharedPtr copy ctor: Increments refCount', pattern: /SharedPtr\s*\(\s*const\s+SharedPtr[^)]*\)\s*:[^{]*\{[^}]*\(\s*\*\s*refCount\s*\)\s*\+\+/ },
    { id: 'cpp_mem_3', description: 'LRUCache::get: Updates lastUsed on access', pattern: /bool\s+get\s*\([\s\S]*?it->second\.lastUsed\s*=\s*clock/ },
    { id: 'cpp_mem_4', description: 'LRUCache::evict: Removes least-recently-used', pattern: /void\s+evict[\s\S]*?lastUsed\s*<\s*oldest->second\.lastUsed/ },
  ]],
]);

// Stable keys → template code. Used to persist the chosen template across server restarts
// so that test patterns reloaded from DB match the same IDs as the saved mainTestCases.
export const TEMPLATE_KEYS: Record<string, string> = {
  js_main: JS_MAIN_CODE,
  js_social: JS_SOCIAL_CODE,
  js_events: JS_EVENTS_CODE,
  js_ecommerce: JS_ECOMMERCE_CODE,
  js_taskmanager: JS_TASKMANAGER_CODE,
  js_chatapp: JS_CHATAPP_CODE,
  js_rpggame: JS_RPGGAME_CODE,
  py_main: PYTHON_MAIN_CODE,
  py_library: PYTHON_LIBRARY_CODE,
  py_weather: PYTHON_WEATHER_CODE,
  py_social: PYTHON_SOCIAL_CODE,
  py_scheduler: PYTHON_SCHEDULER_CODE,
  py_dataprocessor: PYTHON_DATAPROCESSOR_CODE,
  cpp_main: CPP_MAIN_CODE,
  cpp_grades: CPP_GRADES_CODE,
  cpp_filesystem: CPP_FILESYSTEM_CODE,
  cpp_network: CPP_NETWORK_CODE,
  cpp_stringparser: CPP_STRINGPARSER_CODE,
  cpp_memorypool: CPP_MEMORYPOOL_CODE,
};

const CODE_TO_KEY = new Map<string, string>(
  Object.entries(TEMPLATE_KEYS).map(([k, v]) => [v, k])
);

// Pick a random code template; for larger groups concatenate two modules for ~2x lines.
// If primaryKey (and optionally secondaryKey) are supplied, use them instead of random selection —
// this is how `getOrLoadGame` repopulates test patterns after a server restart.
export function getMainCodeTemplate(
  language: string,
  playerCount: number = 4,
  opts?: { primaryKey?: string; secondaryKey?: string | null }
): { code: string; testCases: MainTestCase[]; primaryKey: string; secondaryKey: string | null } {
  const templates = CODE_TEMPLATES[language as Language] ?? CODE_TEMPLATES.javascript;

  const primary = opts?.primaryKey && TEMPLATE_KEYS[opts.primaryKey]
    ? TEMPLATE_KEYS[opts.primaryKey]
    : [...templates].sort(() => Math.random() - 0.5)[0];
  const primaryKey = CODE_TO_KEY.get(primary) ?? '';

  const shouldCombine = playerCount >= 6 && templates.length >= 2;
  let secondary: string | null = null;

  if (opts?.secondaryKey && TEMPLATE_KEYS[opts.secondaryKey]) {
    secondary = TEMPLATE_KEYS[opts.secondaryKey];
  } else if (shouldCombine && !opts?.primaryKey) {
    // Only auto-pick secondary on fresh start (not on reload with only primaryKey)
    const others = templates.filter(t => t !== primary).sort(() => Math.random() - 0.5);
    secondary = others[0] ?? null;
  }

  const secondaryKey = secondary ? (CODE_TO_KEY.get(secondary) ?? null) : null;

  if (secondary) {
    const sep = language === 'python'
      ? '\n\n# ============================================================\n#  MODULE 2 — Additional Challenges Below!\n# ============================================================\n\n'
      : '\n\n// ============================================================\n//  MODULE 2 — Additional Challenges Below!\n// ============================================================\n\n';
    const combinedTestCases = [
      ...(TEMPLATE_TEST_CASES.get(primary) ?? []),
      ...(TEMPLATE_TEST_CASES.get(secondary) ?? []),
    ];
    return { code: primary + sep + secondary, testCases: combinedTestCases, primaryKey, secondaryKey };
  }

  return { code: primary, testCases: TEMPLATE_TEST_CASES.get(primary) ?? [], primaryKey, secondaryKey: null };
}

// 50% easy · 30% medium · 20% hard (normalized to allowed difficulties per skill level)
// Tasks are globally deduplicated by title — no two players receive the same task.
export function generateTasksForGame(
  language: string,
  skillLevel: 'beginner' | 'intermediate' | 'advanced',
  totalTasksNeeded: number
): ITaskDoc[] {
  const bank = TASK_BANKS[language as Language] ?? JS_TASKS;

  const difficultyMap: Record<string, ('easy' | 'medium' | 'hard')[]> = {
    beginner: ['easy', 'medium'],
    intermediate: ['easy', 'medium', 'hard'],
    advanced: ['easy', 'medium', 'hard'],
  };
  const allowed = difficultyMap[skillLevel] ?? ['easy', 'medium', 'hard'];

  // Normalize target weights to allowed set
  const baseWeights: Record<string, number> = { easy: 0.5, medium: 0.3, hard: 0.2 };
  let totalW = 0;
  for (const d of allowed) totalW += baseWeights[d] ?? 0;
  const weights: Record<string, number> = {};
  for (const d of allowed) weights[d] = (baseWeights[d] ?? 0) / totalW;

  // Shuffle each difficulty pool independently
  const byDiff: Record<string, typeof JS_TASKS> = {};
  for (const d of allowed) {
    byDiff[d] = [...bank.filter((t) => t.difficulty === d)].sort(() => Math.random() - 0.5);
  }

  // Calculate per-difficulty task counts
  const sortedByWeight = [...allowed].sort((a, b) => weights[b] - weights[a]);
  const targets: Record<string, number> = {};
  let assigned = 0;
  for (let i = 0; i < sortedByWeight.length; i++) {
    const d = sortedByWeight[i];
    if (i === sortedByWeight.length - 1) {
      targets[d] = totalTasksNeeded - assigned;
    } else {
      targets[d] = Math.round(weights[d] * totalTasksNeeded);
      assigned += targets[d];
    }
  }

  // Build a globally deduplicated candidate pool (by title)
  const usedTitles = new Set<string>();
  const uniquePool: ITaskDoc[] = [];

  // First pass: pick unique tasks from each difficulty pool
  for (const d of allowed) {
    const pool = byDiff[d];
    if (!pool) continue;
    for (const task of pool) {
      if (!usedTitles.has(task.title)) {
        usedTitles.add(task.title);
        uniquePool.push({ ...task, _id: randomUUID(), assignedTo: null, completedBy: null, isCompleted: false });
      }
    }
  }

  // Shuffle the unique pool, then slice to totalTasksNeeded.
  // If pool is smaller than needed, cycle through again (different UUIDs, same content) —
  // this only happens when bank is very small relative to player count.
  uniquePool.sort(() => Math.random() - 0.5);

  const result: ITaskDoc[] = [];
  for (let i = 0; i < totalTasksNeeded; i++) {
    const source = uniquePool[i % uniquePool.length];
    result.push({ ...source, _id: randomUUID() });
  }

  return result;
}
