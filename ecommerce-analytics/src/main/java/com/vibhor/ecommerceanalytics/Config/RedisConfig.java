package com.vibhor.ecommerceanalytics.Config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    public static final String CACHE_TOP_CUSTOMERS = "topCustomers";
    public static final String CACHE_TOP_PRODUCTS = "topProducts";
    public static final String CACHE_LOW_PRODUCTS = "lowPerformingProducts";
    public static final String CACHE_MONTHLY_REVENUE = "monthlyRevenue";
    public static final String CACHE_CATEGORY_REVENUE = "categoryRevenue";
    public static final String CACHE_LIFETIME_VALUE = "customerLifetimeValue";
    public static final String CACHE_INACTIVE_CUSTOMERS = "inactiveCustomers";
    public static final String CACHE_INVENTORY_ALERTS = "inventoryAlerts";
    public static final String CACHE_DASHBOARD = "dashboard";
    public static final String CACHE_AI_RESPONSE = "aiResponses";

    private GenericJacksonJsonRedisSerializer createJsonSerializer() {
        return GenericJacksonJsonRedisSerializer.builder()
                .enableUnsafeDefaultTyping()
                .build();
    }

    @Bean
    public RedisCacheConfiguration defaultCacheConfiguration() {
        GenericJacksonJsonRedisSerializer serializer = createJsonSerializer();

        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(serializer)
                );
    }

    @Bean
    public RedisCacheManager cacheManager(
            RedisConnectionFactory connectionFactory) {

        RedisCacheConfiguration defaultConfig = defaultCacheConfiguration();
        GenericJacksonJsonRedisSerializer serializer = createJsonSerializer();

        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();

        // Real-time / Operational Caches: 5 minutes TTL
        RedisCacheConfiguration shortLived = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));

        cacheConfigs.put(CACHE_DASHBOARD, shortLived);
        cacheConfigs.put(CACHE_INVENTORY_ALERTS, shortLived);

        // Core Analytics Caches: 10 minutes TTL
        RedisCacheConfiguration standard = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));

        cacheConfigs.put(CACHE_TOP_CUSTOMERS, standard);
        cacheConfigs.put(CACHE_TOP_PRODUCTS, standard);
        cacheConfigs.put(CACHE_LOW_PRODUCTS, standard);

        // Macro Trends & Historical Caches: 15 minutes TTL
        RedisCacheConfiguration longLived = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(15))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));

        cacheConfigs.put(CACHE_MONTHLY_REVENUE, longLived);
        cacheConfigs.put(CACHE_CATEGORY_REVENUE, longLived);
        cacheConfigs.put(CACHE_LIFETIME_VALUE, longLived);
        cacheConfigs.put(CACHE_INACTIVE_CUSTOMERS, longLived);

        // AI Response Cache: 30 minutes TTL (same question returns instantly)
        RedisCacheConfiguration aiCache = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));

        cacheConfigs.put(CACHE_AI_RESPONSE, aiCache);

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        GenericJacksonJsonRedisSerializer serializer = createJsonSerializer();
        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}