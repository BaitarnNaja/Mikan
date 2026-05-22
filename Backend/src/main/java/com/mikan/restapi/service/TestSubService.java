package com.mikan.restapi.service;

import com.mikan.restapi.entity.TestSub;
import com.mikan.restapi.model.test_sub.request.CreateTestSubRequest;
import com.mikan.restapi.model.test_sub.request.UpdateTestSubRequest;
import com.mikan.restapi.model.test_sub.response.TestSubResponse;
import com.mikan.restapi.repository.TestSubRepository;
import org.aspectj.weaver.ast.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TestSubService {
    private final TestSubRepository testSubRepository;

    public TestSubService(TestSubRepository testSubRepository) {
        this.testSubRepository = testSubRepository;
    }


    //Create
    public TestSubResponse create(CreateTestSubRequest request){
        TestSub t = new TestSub();
        t.setName(request.getName());
        TestSub db = testSubRepository.save(t);
        return mapToResponse(db);
    }

    //Read All + pagination
    public Page<TestSubResponse> getAll(int page, int limit) {
        Page<TestSub> db = testSubRepository.findAll(PageRequest.of(page, limit));
        return testSubRepository
                .findAll(PageRequest.of(page, limit))
                .map(this::mapToResponse);
    }

    //Search + pagination
    public Page<TestSubResponse> search(String name, int page, int limit) {
        return testSubRepository.findByNameContainingIgnoreCase(name, PageRequest.of(page, limit))
                .map(this::mapToResponse);
    }

    // READ BY ID
    public TestSubResponse getById(UUID id) {
        TestSub db = testSubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TestSub not found"));
        return mapToResponse(db);
    }

    //Update
    public TestSubResponse update(UUID id, UpdateTestSubRequest request){
        TestSub findDB = testSubRepository.findById(id).orElseThrow(()-> new RuntimeException("not found"));
        findDB.setName(request.getName());
        TestSub db = testSubRepository.save(findDB);
        return mapToResponse(db);
    }

    // DELETE
    public TestSubResponse delete(UUID id) {
        testSubRepository.deleteById(id);
        return TestSubResponse.builder()
                .code("200")
                .msg("success")
                .build();
    }

    //Mapper
    private TestSubResponse mapToResponse(TestSub t) {
        return TestSubResponse.builder()
                .code("200")
                .msg("success")
                .id(t.getId())
                .name(t.getName())
                .build();
    }

}
