const assert = require('assert').strict;

const { searchItems } = require('../api/search');

function testSearchItemsReturnsMatchingListItemsForAKeyword() {
  const result = searchItems('AI');

  assert.ok(Array.isArray(result.list));
  assert.ok(result.list.length > 0);
  assert.ok(result.list.every((item) => item.title || item.desc));
  assert.ok(
    result.list.some((item) => `${item.title} ${item.desc}`.toLowerCase().includes('ai')),
  );
}

testSearchItemsReturnsMatchingListItemsForAKeyword();
console.log('search tests passed');
