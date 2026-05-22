package com.mikan.restapi.service;

import com.mikan.restapi.entity.TestMain;
import com.mikan.restapi.entity.TestSub;
import com.mikan.restapi.model.test_main.request.CreateTestMainRequest;
import com.mikan.restapi.model.test_main.response.TestMainResponse;
import com.mikan.restapi.repository.TestMainRepository;
import com.mikan.restapi.repository.TestSubRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TestMainService {
    private final TestSubRepository testSubRepository;
    private final TestMainRepository testMainRepository;

    public TestMainService(TestSubRepository testSubRepository, TestMainRepository testMainRepository) {
        this.testSubRepository = testSubRepository;
        this.testMainRepository = testMainRepository;
    }


    // ================= CREATE =================
    public TestMainResponse create(CreateTestMainRequest request) {

        TestSub sub = testSubRepository.findById(request.getTestSubId())
                .orElseThrow(() -> new RuntimeException("TestSub not found"));

        TestMain t = new TestMain();
        t.setName(request.getName());
        t.setTestSub(sub);

        TestMain saved = testMainRepository.save(t);

        return mapToResponse(saved);
    }

    // ================= GET ALL =================
    public Page<TestMainResponse> getAll(int page, int size) {

        return testMainRepository.findAll(PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    // ================= SEARCH =================
    public Page<TestMainResponse> search(String name, String subName, int page, int size) {

        return testMainRepository.search(name, subName, PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    // ================= GET BY ID =================
    public TestMainResponse getById(UUID id) {

        TestMain t = testMainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TestMain not found"));

        return mapToResponse(t);
    }

    // ================= UPDATE =================
    public TestMainResponse update(UUID id, CreateTestMainRequest request) {

        TestMain t = testMainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TestMain not found"));

        if (request.getName() != null) {
            t.setName(request.getName());
        }

        if (request.getTestSubId() != null) {
            TestSub sub = testSubRepository.findById(request.getTestSubId())
                    .orElseThrow(() -> new RuntimeException("TestSub not found"));
            t.setTestSub(sub);
        }

        TestMain updated = testMainRepository.save(t);

        return mapToResponse(updated);
    }

    // ================= DELETE =================
    public TestMainResponse delete(UUID id) {

        testMainRepository.deleteById(id);

        return TestMainResponse.builder()
                .code("200")
                .msg("success")
                .build();
    }

    // ================= MAPPER =================
    private TestMainResponse mapToResponse(TestMain t) {

        return TestMainResponse.builder()
                .code("200")
                .msg("success")
                .id(t.getId())
                .name(t.getName())
                .testSubId(t.getTestSub().getId())
                .testSubName(t.getTestSub().getName())
                .build();
    }
    
}
