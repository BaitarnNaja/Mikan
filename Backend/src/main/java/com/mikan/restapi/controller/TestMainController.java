package com.mikan.restapi.controller;

import com.mikan.restapi.model.test_main.request.CreateTestMainRequest;
import com.mikan.restapi.model.test_main.response.TestMainResponse;
import com.mikan.restapi.service.TestMainService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/test-main")
public class TestMainController {

    private final TestMainService testMainService;

    public TestMainController(TestMainService testMainService) {
        this.testMainService = testMainService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<TestMainResponse> create(@Valid @RequestBody CreateTestMainRequest request) {
        log.info("[API TEST_MAIN] create request: {}", request);
        TestMainResponse response = testMainService.create(request);
        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    // GET ALL + Pagination
    @GetMapping
    public ResponseEntity<Page<TestMainResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        log.info("[API TEST_MAIN] getAll page={}, size={}", page, size);
        Page<TestMainResponse> response = testMainService.getAll(page, size);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    // SEARCH
    @GetMapping("/search")
    public ResponseEntity<Page<TestMainResponse>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String subName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        log.info("[API TEST_MAIN] search name={}, subName={}, page={}, size={}", name, subName, page, size);

        Page<TestMainResponse> response = testMainService.search(name, subName, page, size);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TestMainResponse> getById(@PathVariable UUID id) {
        log.info("[API TEST_MAIN] getById id={}", id);

        TestMainResponse response = testMainService.getById(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<TestMainResponse> update(
            @PathVariable UUID id,
            @RequestBody CreateTestMainRequest request
    ) {
        log.info("[API TEST_MAIN] update id={}, request={}", id, request);
        TestMainResponse response = testMainService.update(id, request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<TestMainResponse> delete(@PathVariable UUID id) {
        log.info("[API TEST_MAIN] delete id={}", id);

        TestMainResponse response = testMainService.delete(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }
}