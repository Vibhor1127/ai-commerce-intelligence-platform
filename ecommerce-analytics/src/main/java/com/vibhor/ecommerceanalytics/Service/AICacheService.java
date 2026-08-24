package com.vibhor.ecommerceanalytics.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibhor.ecommerceanalytics.DTO.AIExplanationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Manual Redis cache for AI copilot responses.
 * Uses StringRedisTemplate (plain string serialization) to avoid
 * all the Jackson polymorphic type-info headaches that come with
 * GenericJacksonJsonRedisSerializer and complex Object fields.
 */
@Service
public class AICacheService {

    private static final Logger logger = LoggerFactory.getLogger(AICacheService.class);
    private static final String PREFIX = "ai:cache:";
    private static final Duration TTL = Duration.ofMinutes(30);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public AICacheService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Get a cached AI response for the given normalized question.
     * Returns null if not found or on any deserialization error.
     */
    public AIExplanationResponse get(String normalizedQuestion) {
        try {
            String key = PREFIX + normalizedQuestion;
            String json = redisTemplate.opsForValue().get(key);
            if (json == null || json.isBlank()) {
                return null;
            }
            return objectMapper.readValue(json, AIExplanationResponse.class);
        } catch (Exception e) {
            logger.warn("AI cache read failed for '{}': {}", normalizedQuestion, e.getMessage());
            return null;
        }
    }

    /**
     * Store an AI response in Redis with a 30-minute TTL.
     */
    public void put(String normalizedQuestion, AIExplanationResponse response) {
        try {
            String key = PREFIX + normalizedQuestion;
            String json = objectMapper.writeValueAsString(response);
            redisTemplate.opsForValue().set(key, json, TTL);
            logger.debug("AI cache stored for '{}'", normalizedQuestion);
        } catch (Exception e) {
            logger.warn("AI cache write failed for '{}': {}", normalizedQuestion, e.getMessage());
        }
    }

    /**
     * Evict a specific cached question.
     */
    public void evict(String normalizedQuestion) {
        redisTemplate.delete(PREFIX + normalizedQuestion);
    }

    /**
     * Evict all cached AI responses.
     */
    public void evictAll() {
        var keys = redisTemplate.keys(PREFIX + "*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            logger.info("Evicted {} AI cache entries", keys.size());
        }
    }
}
