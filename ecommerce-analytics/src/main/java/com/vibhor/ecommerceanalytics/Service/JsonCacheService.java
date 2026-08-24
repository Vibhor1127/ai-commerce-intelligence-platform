package com.vibhor.ecommerceanalytics.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * General-purpose JSON string cache backed by StringRedisTemplate.
 * Avoids all Jackson polymorphic type-info issues by storing plain JSON strings.
 * Each cache namespace gets its own TTL configuration.
 */
@Service
public class JsonCacheService {

    private static final Logger logger = LoggerFactory.getLogger(JsonCacheService.class);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    // Cache namespace → TTL
    private final Map<String, Duration> ttls = new ConcurrentHashMap<>();

    public JsonCacheService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());

        // Default TTLs
        ttls.put("analytics", Duration.ofMinutes(10));
        ttls.put("dashboard", Duration.ofMinutes(5));
        ttls.put("ai", Duration.ofMinutes(30));
    }

    public void setTtl(String namespace, Duration ttl) {
        ttls.put(namespace, ttl);
    }

    /**
     * Get a cached value by namespace + key.
     */
    public <T> T get(String namespace, String key, Class<T> type) {
        try {
            String fullKey = namespace + ":" + key;
            String json = redisTemplate.opsForValue().get(fullKey);
            if (json == null || json.isBlank()) return null;
            return objectMapper.readValue(json, type);
        } catch (Exception e) {
            logger.warn("Cache read failed [{}:{}]: {}", namespace, key, e.getMessage());
            return null;
        }
    }

    /**
     * Get a cached value by namespace + key using TypeReference for complex types like List<T>.
     */
    public <T> T get(String namespace, String key, TypeReference<T> typeRef) {
        try {
            String fullKey = namespace + ":" + key;
            String json = redisTemplate.opsForValue().get(fullKey);
            if (json == null || json.isBlank()) return null;
            return objectMapper.readValue(json, typeRef);
        } catch (Exception e) {
            logger.warn("Cache read failed [{}:{}]: {}", namespace, key, e.getMessage());
            return null;
        }
    }

    /**
     * Store a value with namespace-scoped TTL.
     */
    public void put(String namespace, String key, Object value) {
        try {
            String fullKey = namespace + ":" + key;
            String json = objectMapper.writeValueAsString(value);
            Duration ttl = ttls.getOrDefault(namespace, Duration.ofMinutes(10));
            redisTemplate.opsForValue().set(fullKey, json, ttl);
        } catch (Exception e) {
            logger.warn("Cache write failed [{}:{}]: {}", namespace, key, e.getMessage());
        }
    }

    /**
     * Evict a specific cache entry.
     */
    public void evict(String namespace, String key) {
        redisTemplate.delete(namespace + ":" + key);
    }

    /**
     * Evict all entries in a namespace.
     */
    public void evictAll(String namespace) {
        var keys = redisTemplate.keys(namespace + ":*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
}
