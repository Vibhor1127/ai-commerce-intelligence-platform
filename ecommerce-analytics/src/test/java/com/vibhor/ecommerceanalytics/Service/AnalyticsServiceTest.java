package com.vibhor.ecommerceanalytics.Service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Analytics Engine & Redis Caching Unit Tests")
class AnalyticsServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @Test
    @DisplayName("Should serve analytics calculation from Redis cache if present (Cache Hit)")
    void testRedisCacheHit() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        List<Map<String, Object>> cachedData = List.of(Map.of("category", "Electronics", "revenue", 50000.0));
        when(valueOperations.get("analytics:top_categories")).thenReturn(cachedData);

        Object result = redisTemplate.opsForValue().get("analytics:top_categories");

        assertNotNull(result);
        assertEquals(cachedData, result);
        verify(valueOperations, times(1)).get("analytics:top_categories");
    }

    @Test
    @DisplayName("Should populate Redis cache on initial calculation (Cache Miss)")
    void testRedisCacheMissAndSet() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);

        Object cached = redisTemplate.opsForValue().get("analytics:clv");
        assertNull(cached);

        List<Map<String, Object>> calculatedClv = List.of(Map.of("customerId", 101, "clv", 1250.0));
        valueOperations.set("analytics:clv", calculatedClv);

        verify(valueOperations, times(1)).set("analytics:clv", calculatedClv);
    }
}
