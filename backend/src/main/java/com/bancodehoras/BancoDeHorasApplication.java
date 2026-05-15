package com.bancodehoras;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;

@SpringBootApplication
public class BancoDeHorasApplication {
    public static void main(String[] args) {
        try {
            SpringApplication.run(BancoDeHorasApplication.class, args);
        } catch (Throwable t) {
            System.err.println("=== STARTUP FAILED: " + t.getClass().getName() + ": " + t.getMessage());
            Throwable cause = t.getCause();
            while (cause != null) {
                System.err.println("=== CAUSED BY: " + cause.getClass().getName() + ": " + cause.getMessage());
                cause = cause.getCause();
            }
            logToDatabase(t);
            System.exit(1);
        }
    }

    private static void logToDatabase(Throwable t) {
        String url = System.getenv("SPRING_DATASOURCE_URL");
        String user = System.getenv("SPRING_DATASOURCE_USERNAME");
        String pass = System.getenv("SPRING_DATASOURCE_PASSWORD");
        if (url == null) return;
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            try (Statement s = conn.createStatement()) {
                s.execute("CREATE TABLE IF NOT EXISTS startup_errors (id SERIAL PRIMARY KEY, ts TIMESTAMP DEFAULT NOW(), error TEXT)");
            }
            StringWriter sw = new StringWriter();
            t.printStackTrace(new PrintWriter(sw));
            try (PreparedStatement ps = conn.prepareStatement("INSERT INTO startup_errors(error) VALUES (?)")) {
                ps.setString(1, sw.toString().substring(0, Math.min(sw.toString().length(), 5000)));
                ps.execute();
            }
        } catch (Exception e) {
            System.err.println("=== COULD NOT LOG TO DB: " + e.getMessage());
        }
    }
}
