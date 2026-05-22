package com.mikan.restapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication ()
public class MikanRestApiApplication {

  public static void main(String[] args) {
    SpringApplication.run(MikanRestApiApplication.class, args);
  }
}
