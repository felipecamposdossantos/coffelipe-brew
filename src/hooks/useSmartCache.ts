
import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/pages/Index';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SmartCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100;
  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    // Limpar cache se exceder o tamanho máximo
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

const globalCache = new SmartCache();

export const useSmartCache = () => {
  const [cacheStats, setCacheStats] = useState(globalCache.getStats());

  const updateStats = useCallback(() => {
    setCacheStats(globalCache.getStats());
  }, []);

  const cacheRecipes = useCallback((recipes: Recipe[], cacheKey: string = 'recipes') => {
    globalCache.set(cacheKey, recipes, 10 * 60 * 1000); // 10 minutos para receitas
    updateStats();
  }, [updateStats]);

  const getCachedRecipes = useCallback((cacheKey: string = 'recipes'): Recipe[] | null => {
    return globalCache.get<Recipe[]>(cacheKey);
  }, []);

  const cacheBrewHistory = useCallback((history: any[], userId: string) => {
    globalCache.set(`brew_history_${userId}`, history, 5 * 60 * 1000); // 5 minutos
    updateStats();
  }, [updateStats]);

  const getCachedBrewHistory = useCallback((userId: string) => {
    return globalCache.get(`brew_history_${userId}`);
  }, []);

  const invalidateUserCache = useCallback((userId: string) => {
    globalCache.invalidate(userId);
    updateStats();
  }, [updateStats]);

  const clearCache = useCallback(() => {
    globalCache.clear();
    updateStats();
  }, [updateStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateStats();
    }, 30000); // Atualizar stats a cada 30 segundos

    return () => clearInterval(interval);
  }, [updateStats]);

  return {
    cacheRecipes,
    getCachedRecipes,
    cacheBrewHistory,
    getCachedBrewHistory,
    invalidateUserCache,
    clearCache,
    cacheStats
  };
};
