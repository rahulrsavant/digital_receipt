package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.jpa.hibernate.ddl-auto=none",
		"spring.flyway.enabled=false"
})
class BackendSpringBootApplicationTests {

	@Test
	void contextLoads() {
	}

}
