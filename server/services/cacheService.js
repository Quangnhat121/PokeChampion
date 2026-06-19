import NodeCache from 'node-cache';

/**
 * In-memory cache using node-cache.
 * Default TTL: 24 hours (86400 seconds).
 * checkperiod: every 10 minutes, prune expired keys.
 */
const cache = new NodeCache({
  stdTTL: 86400,
  checkperiod: 600,
  useClones: false,
});

const cacheService = {
  get: (key) => cache.get(key),
  set: (key, value, ttl) => cache.set(key, value, ttl || 86400),
  del: (key) => cache.del(key),
  has: (key) => cache.has(key),
  flush: () => cache.flushAll(),
  stats: () => cache.getStats(),
  keys: () => cache.keys(),
};

export default cacheService;
