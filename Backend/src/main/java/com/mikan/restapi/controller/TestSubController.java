package com.mikan.restapi.controller;


import com.mikan.restapi.entity.TestSub;
import com.mikan.restapi.model.test_sub.request.CreateTestSubRequest;
import com.mikan.restapi.model.test_sub.request.UpdateTestSubRequest;
import com.mikan.restapi.model.test_sub.response.TestSubResponse;
import com.mikan.restapi.repository.TestSubRepository;
import com.mikan.restapi.service.TestSubService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Test;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/test-sub")
public class TestSubController {

    private final TestSubService testSubService ;

    public TestSubController(TestSubService testSubService) {
        this.testSubService = testSubService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<TestSubResponse> create(@Valid @RequestBody CreateTestSubRequest request) {
        log.info("[API TEST_SUB] create request: {}", request);
        TestSubResponse response = testSubService.create(request);
        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    //GET ALL + Pagination
    @GetMapping
    public ResponseEntity<Page<TestSubResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        log.info("[API TEST_SUB] getAll page={}, size={}", page, size);
        Page<TestSubResponse> response = testSubService.getAll(page, size);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    // SEARCH
    @GetMapping("/search")
    public ResponseEntity<Page<TestSubResponse>> search(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        log.info("[API TEST_SUB] search name={}, page={}, size={}", name, page, size);

        Page<TestSubResponse> response = testSubService.search(name, page, size);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    //Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<TestSubResponse> getById(@PathVariable UUID id) {
        log.info("[API TEST_SUB] getById id={}", id);

        TestSubResponse response = testSubService.getById(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    //Update
    @PutMapping("/{id}")
    public ResponseEntity<TestSubResponse> update(
            @PathVariable UUID id,
            @RequestBody UpdateTestSubRequest request
    ) {
        log.info("[API TEST_SUB] update id={}, request={}", id, request);
        TestSubResponse response = testSubService.update(id, request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    //Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<TestSubResponse> delete(@PathVariable UUID id) {
        log.info("[API TEST_SUB] delete id={}", id);

        TestSubResponse response = testSubService.delete(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }
}
