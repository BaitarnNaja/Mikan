package com.mikan.restapi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class MikanRestApiApplicationTests {
	@MockitoBean
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Test
	void contextLoads() {
	}

}
