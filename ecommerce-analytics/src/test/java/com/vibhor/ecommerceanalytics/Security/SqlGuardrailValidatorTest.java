package com.vibhor.ecommerceanalytics.Security;

import com.vibhor.ecommerceanalytics.Exception.AiSecurityException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AI SQL Guardrail Security Unit Tests")
class SqlGuardrailValidatorTest {

    private SqlGuardrailValidator validator;

    @BeforeEach
    void setUp() {
        validator = new SqlGuardrailValidator();
    }

    @Test
    @DisplayName("Should accept valid SELECT queries")
    void testValidSelectQuery() {
        String query = "SELECT c.id, c.name, SUM(o.total_amount) AS clv FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id ORDER BY clv DESC LIMIT 10;";
        String sanitized = validator.validateAndSanitize(query);
        assertNotNull(sanitized);
        assertFalse(sanitized.endsWith(";"));
        assertTrue(sanitized.toUpperCase().startsWith("SELECT"));
    }

    @Test
    @DisplayName("Should accept valid CTE WITH queries")
    void testValidCteQuery() {
        String cteQuery = "WITH monthly_revenue AS (SELECT DATE_FORMAT(order_date, '%Y-%m') AS month, SUM(total_amount) AS revenue FROM orders GROUP BY month) SELECT * FROM monthly_revenue ORDER BY month DESC";
        String sanitized = validator.validateAndSanitize(cteQuery);
        assertNotNull(sanitized);
        assertTrue(sanitized.toUpperCase().startsWith("WITH"));
    }

    @Test
    @DisplayName("Should strip markdown code fences returned by LLMs")
    void testMarkdownCodeFences() {
        String rawLlmResponse = "```sql\nSELECT COUNT(*) FROM products WHERE stock_quantity < 10;\n```";
        String sanitized = validator.validateAndSanitize(rawLlmResponse);
        assertEquals("SELECT COUNT(*) FROM products WHERE stock_quantity < 10", sanitized);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "DROP TABLE customers;",
            "DELETE FROM orders WHERE id = 1;",
            "UPDATE products SET price = 0.0;",
            "INSERT INTO users (username, role) VALUES ('hacker', 'ROLE_ADMIN');",
            "TRUNCATE TABLE payments;",
            "ALTER TABLE users ADD COLUMN is_admin BOOLEAN;",
            "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';"
    })
    @DisplayName("Should reject forbidden DDL and DML operations")
    void testRejectForbiddenOperations(String maliciousQuery) {
        assertThrows(AiSecurityException.class, () -> validator.validateAndSanitize(maliciousQuery));
    }

    @Test
    @DisplayName("Should reject multi-statement injection attacks")
    void testRejectMultiStatementAttack() {
        String injection = "SELECT * FROM products; DROP TABLE customers;";
        assertThrows(AiSecurityException.class, () -> validator.validateAndSanitize(injection));
    }

    @Test
    @DisplayName("Should reject SQL comment injection bypasses")
    void testRejectCommentInjection() {
        String commentAttack = "SELECT * FROM customers -- inline comment bypass";
        assertThrows(AiSecurityException.class, () -> validator.validateAndSanitize(commentAttack));
    }
}
