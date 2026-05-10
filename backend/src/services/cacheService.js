// Cache en memoria con TTL
class CacheService {
  constructor() {
    this.store = new Map();
    this.stats = { hits: 0, misses: 0 };
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) {
      this.stats.misses++;
      return null;
    }
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      this.stats.misses++;
      return null;
    }
    this.stats.hits++;
    return item.value;
  }

  set(key, value, ttlSeconds = 300) {
    this.store.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }

  invalidate(pattern) {
    for (const key of this.store.keys()) {
      if (key.includes(pattern)) {
        this.store.delete(key);
      }
    }
  }

  getStats() {
    return {
      ...this.stats,
      size: this.store.size,
      keys: Array.from(this.store.keys())
    };
  }

  clear() {
    this.store.clear();
    this.stats = { hits: 0, misses: 0 };
  }
}

module.exports = new CacheService();
