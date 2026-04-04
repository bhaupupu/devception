import { ITaskDoc } from '../models/Game.model';
import { v4 as uuidv4 } from 'uuid';

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
//  CODECREW CHALLENGE — Inventory Management System
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
const store = createStore('CodeCrew Shop');
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
#  CODECREW CHALLENGE — Task Manager System
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
//  CODECREW CHALLENGE — Bank Account System
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
//  CODECREW CHALLENGE — Social Network System
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
//  CODECREW CHALLENGE — Event Scheduler System
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
#  CODECREW CHALLENGE — Library Management System
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
#  CODECREW CHALLENGE — Weather Analytics System
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
//  CODECREW CHALLENGE — Student Grade Management System
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
//  CODECREW CHALLENGE — File System Simulator
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

    fs.createFile("/home/alice/notes.txt",  "alice", "Hello CodeCrew!");
    fs.createFile("/home/alice/solution.cpp","alice", "#include <iostream>\\nint main(){}");
    fs.createFile("/tmp/debug.log",          "root",  "error: null pointer at line 42");

    cout << "notes.txt: " << fs.readFile("/home/alice/notes.txt") << endl;
    cout << "/home/alice size: " << fs.getDirSize("/home/alice") << " bytes" << endl;
    cout << "Nodes in /home: " << fs.countNodes("/home") << endl;
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
  javascript: [JS_MAIN_CODE, JS_SOCIAL_CODE, JS_EVENTS_CODE],
  python: [PYTHON_MAIN_CODE, PYTHON_LIBRARY_CODE, PYTHON_WEATHER_CODE],
  cpp: [CPP_MAIN_CODE, CPP_GRADES_CODE, CPP_FILESYSTEM_CODE],
};

// Pick a random code template; for larger groups concatenate two modules for ~2x lines
export function getMainCodeTemplate(language: string, playerCount: number = 4): string {
  const templates = CODE_TEMPLATES[language as Language] ?? CODE_TEMPLATES.javascript;
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  const primary = shuffled[0];

  if (playerCount >= 6 && shuffled.length >= 2) {
    const secondary = shuffled[1];
    const sep = language === 'python'
      ? '\n\n# ============================================================\n#  MODULE 2 — Additional Challenges Below!\n# ============================================================\n\n'
      : '\n\n// ============================================================\n//  MODULE 2 — Additional Challenges Below!\n// ============================================================\n\n';
    return primary + sep + secondary;
  }

  return primary;
}

// 50% easy · 30% medium · 20% hard (normalized to allowed difficulties per skill level)
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

  // Shuffle each difficulty group independently for variety
  const byDiff: Record<string, typeof JS_TASKS> = {};
  for (const d of allowed) {
    byDiff[d] = [...bank.filter((t) => t.difficulty === d)].sort(() => Math.random() - 0.5);
  }

  // Calculate per-difficulty task counts, giving remainder to largest weight bucket
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

  // Build result cycling through each difficulty pool
  const result: ITaskDoc[] = [];
  for (const d of allowed) {
    const pool = byDiff[d];
    if (!pool || pool.length === 0) continue;
    for (let i = 0; i < (targets[d] ?? 0); i++) {
      result.push({
        ...pool[i % pool.length],
        _id: uuidv4(),
        assignedTo: null,
        completedBy: null,
        isCompleted: false,
      });
    }
  }

  // Interleave difficulties randomly
  return result.sort(() => Math.random() - 0.5);
}
