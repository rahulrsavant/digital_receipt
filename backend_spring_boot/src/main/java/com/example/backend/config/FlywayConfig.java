package com.example.backend.config;

import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Value("${spring.flyway.locations:classpath:db/migration}")
    private String locations;

    @Value("${spring.flyway.baseline-on-migrate:false}")
    private boolean baselineOnMigrate;

    @Bean(initMethod = "migrate")
    public Flyway flyway(DataSource dataSource) {
        String[] locationArray = locations.split(",");
        return Flyway.configure()
                .dataSource(dataSource)
                .locations(locationArray)
                .baselineOnMigrate(baselineOnMigrate)
                .load();
    }
}
