package com.mikan.restapi.repository;

import com.mikan.restapi.constant.DatabaseConstant;
import com.mikan.restapi.model.contract.request.CreateContractRequest;
import com.mikan.restapi.model.contract.request.InquiryContractRequest;
import com.mikan.restapi.model.contract.request.UpdateContractRequest;
import com.mikan.restapi.model.contract.response.InquiryContractResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Repository
public class ContractRepository {
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public int insertContract(CreateContractRequest request){
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO " + DatabaseConstant.LG_CONTRACT_TABLE_NAME);
        sql.append(" (customer_name, customer_address, company_name, company_address, email, mobile, type, amount, start_date, end_date, details, status, created_at, updated_at, pdf_url)");
        sql.append(" VALUES(:customer_name, :customer_address, :company_name, :company_address, :email, :mobile, :type, :amount, :start_date, :end_date, :details, :status, :created_at, :updated_at, :pdf_url)");

        Map<String, Object> namedParameters = new HashMap<>();
        namedParameters.put("customer_name", request.getCustomerName());
        namedParameters.put("customer_address", request.getCustomerAddress());
        namedParameters.put("company_name", request.getCompanyName());
        namedParameters.put("company_address", request.getCompanyAddress());
        namedParameters.put("email", request.getEmail());
        namedParameters.put("mobile", request.getMobile());
        namedParameters.put("type", request.getType());
        namedParameters.put("amount", request.getAmount());
        namedParameters.put("start_date", request.getStartDate());
        namedParameters.put("end_date", request.getEndDate());
        namedParameters.put("details", request.getDetails());
        namedParameters.put("status", "submitted");
        namedParameters.put("created_at", LocalDateTime.now());
        namedParameters.put("updated_at", LocalDateTime.now());
        namedParameters.put("pdf_url", request.getPdfUrl());

        KeyHolder keyHolder = new GeneratedKeyHolder();

        namedParameterJdbcTemplate.update(sql.toString(), new MapSqlParameterSource(namedParameters), keyHolder ,new String[] {"contract_id"});
        return keyHolder.getKey().intValue();

    }

    public void updateContractStatus(String contractId, String Status) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE "+ DatabaseConstant.LG_CONTRACT_TABLE_NAME);
        sql.append(" SET  ");
        sql.append(" status = :status");
        sql.append(" WHERE contract_id = :contract_id ");

        Map<String, Object> namedParameters = new HashMap<>();
        namedParameters.put("status", Status);
        namedParameters.put("contract_id", Integer.parseInt(contractId));
        namedParameterJdbcTemplate.update(sql.toString(), new MapSqlParameterSource(namedParameters));
    }

    public void insertContractState(int contractId) {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO "+ DatabaseConstant.LG_CONTRACT_STATE_TABLE_NAME);
        sql.append(" (contract_id, updated_at)");
        sql.append(" VALUES(:user_id, :updated_at)");

        Map<String, Object> namedParameters = new HashMap<>();
        namedParameters.put("user_id", contractId);
        namedParameters.put("updated_at", LocalDateTime.now());
        namedParameterJdbcTemplate.update(sql.toString(), new MapSqlParameterSource(namedParameters));
    }

    public void updateContractStateByReview(String contractId, String Status) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE "+ DatabaseConstant.LG_CONTRACT_STATE_TABLE_NAME);
        sql.append(" SET  ");
        sql.append(" checked_by = :checked_by,");
        sql.append(" status = :status,");
        sql.append(" updated_at = :updated_at");
        sql.append(" WHERE contract_id = :contract_id ");


        Map<String, Object> namedParameters = new HashMap<>();
        namedParameters.put("checked_by", 52);
        namedParameters.put("status", Status);
        namedParameters.put("updated_at", LocalDateTime.now());
        namedParameters.put("contract_id", Integer.parseInt(contractId));
        namedParameterJdbcTemplate.update(sql.toString(), new MapSqlParameterSource(namedParameters));
    }

    public void updateContractStateByApprove(String contractId, String Status) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE "+ DatabaseConstant.LG_CONTRACT_STATE_TABLE_NAME);
        sql.append(" SET  ");
        sql.append(" approved_by = :approved_by,");
        sql.append(" status = :status, ");
        sql.append(" updated_at = :updated_at");
        sql.append(" WHERE contract_id = :contract_id ");


        Map<String, Object> namedParameters = new HashMap<>();
        namedParameters.put("approved_by", 51);
        namedParameters.put("status", Status);
        namedParameters.put("updated_at", LocalDateTime.now());
        namedParameters.put("contract_id", Integer.parseInt(contractId));
        namedParameterJdbcTemplate.update(sql.toString(), new MapSqlParameterSource(namedParameters));

        StringBuilder sqlContract = new StringBuilder();
        sql.append("UPDATE "+ DatabaseConstant.LG_CONTRACT_TABLE_NAME);
        sql.append(" SET  ");
        sql.append(" status = :status,");
        sql.append(" WHERE contract_id = :contract_id ");

        Map<String, Object> namedParametersContract = new HashMap<>();
        namedParameters.put("status", Status);
        namedParameters.put("contract_id", Integer.parseInt(contractId));
        namedParameterJdbcTemplate.update(sqlContract.toString(), new MapSqlParameterSource(namedParametersContract));
    }

    public List<InquiryContractResponse> inquiryContract(InquiryContractRequest request){
        Map<String, Object> namedParameters = new HashMap<>();

        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT * FROM "+ DatabaseConstant.LG_CONTRACT_TABLE_NAME);
        sql.append(" WHERE 1 = 1 ");

        if (StringUtils.isNotEmpty(request.getContractId())) {
            sql.append(" AND contract_id = :contract_id ");
            namedParameters.put("contract_id", Integer.parseInt(request.getContractId()));
        }
        if (StringUtils.isNotEmpty(request.getCustomerName())) {
            sql.append(" AND customer_name LIKE :customer_name ");
            namedParameters.put("customer_name", "%" + request.getCustomerName() + "%");
        }
        if (StringUtils.isNotEmpty(request.getCompanyName())) {
            sql.append(" AND company_name LIKE :company_name ");
            namedParameters.put("company_name", "%" + request.getCompanyName() + "%");
        }
        if (StringUtils.isNotEmpty(request.getEmail())) {
            sql.append(" AND email LIKE :email ");
            namedParameters.put("email", "%" + request.getEmail() + "%");
        }
        if (StringUtils.isNotEmpty(request.getType())) {
            sql.append(" AND type LIKE :type ");
            namedParameters.put("type", "%" + request.getType() + "%");
        }
        if (StringUtils.isNotEmpty(request.getAmount())) {
            sql.append(" AND amount = :amount ");
            namedParameters.put("amount", request.getAmount());
        }
        if (StringUtils.isNotEmpty(request.getStatus())) {
            sql.append(" AND status = :status ");
            namedParameters.put("status", request.getStatus());
        }
        if (request.getStartDate() != null ) {
            sql.append(" AND start_date = :start_date ");
            namedParameters.put("start_date", request.getStartDate());
        }
        if (request.getStartDate() != null ) {
            sql.append(" AND end_date = :end_date ");
            namedParameters.put("end_date", request.getEndDate());
        }

//        namedParameterJdbcTemplate.update(sql.toString(), new MapSqlParameterSource(namedParameters));

        return namedParameterJdbcTemplate.query(
                sql.toString(),
                namedParameters, // ใช้ MapSqlParameterSource เปล่าๆ
                (rs, rowNum) -> { // RowMapper
                    InquiryContractResponse user = new InquiryContractResponse();
// 1. Mapping Integer/Numeric Fields
                    user.setContractId(rs.getString("contract_id"));
                    user.setAmount(rs.getString("amount"));

                    // 2. Mapping String Fields
                    user.setCompanyName(rs.getString("company_name"));
                    user.setCustomerName(rs.getString("customer_name"));
                    user.setCustomerAddress(rs.getString("customer_address"));
                    user.setCompanyAddress(rs.getString("company_address"));
                    user.setEmail(rs.getString("email"));
                    user.setMobile(rs.getString("mobile"));
                    user.setType(rs.getString("type"));
                    user.setDetails(rs.getString("details"));
                    user.setStatus(rs.getString("status"));
                    user.setPdfUrl(rs.getString("pdf_url"));

                    // 3. Mapping Date/Time Fields (LocalDate)
                    // ใช้ getObject(columnName, LocalDate.class) หรือ getTimestamp().toLocalDateTime().toLocalDate()
                    // ถ้าใช้ Spring Boot/JPA/JDBC 4.2+ มักจะใช้ getObject ได้โดยตรง

                    // For startDate
                    java.sql.Date startDateSql = rs.getDate("start_date");
                    if (startDateSql != null) {
                        user.setStartDate(startDateSql.toLocalDate());
                    }

                    // For endDate
                    java.sql.Date endDateSql = rs.getDate("end_date");
                    if (endDateSql != null) {
                        user.setEndDate(endDateSql.toLocalDate());
                    }

                    // For createdDate
                    java.sql.Timestamp createdTimestamp = rs.getTimestamp("created_at");
                    if (createdTimestamp != null) {
                        user.setCreated_at(createdTimestamp.toLocalDateTime().toLocalDate());
                    }

                    // For updated_at
                    java.sql.Timestamp updatedTimestamp = rs.getTimestamp("updated_at");
                    if (updatedTimestamp != null) {
                        user.setUpdated_at(updatedTimestamp.toLocalDateTime().toLocalDate());
                    }


                    return user;
                }
        );
    }

    public void updateContract(UpdateContractRequest request) {

        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE "+ DatabaseConstant.LG_CONTRACT_TABLE_NAME);
        sql.append(" SET  ");
        sql.append(" customer_name = :customer_name, ");
        sql.append(" customer_address = :customer_address, ");
        sql.append(" company_name = :company_name, ");
        sql.append(" company_address = :company_address, ");
        sql.append(" email = :email, ");
        sql.append(" mobile = :mobile, ");
        sql.append(" type = :type, ");
        sql.append(" amount = :amount, ");
        sql.append(" start_date = :start_date, ");
        sql.append(" end_date = :end_date, ");
        sql.append(" details = :details, ");
        sql.append(" updated_at = :updated_at");
        sql.append(" WHERE contract_id = :contract_id ");

        Map<String, Object> namedParameters = new HashMap<>();
        namedParameters.put("customer_name", request.getCustomerName());
        namedParameters.put("customer_address", request.getCustomerAddress());
        namedParameters.put("company_name", request.getCompanyName());
        namedParameters.put("company_address", request.getCompanyAddress());
        namedParameters.put("email", request.getEmail());
        namedParameters.put("mobile", request.getMobile());
        namedParameters.put("type", request.getType());
        namedParameters.put("amount", request.getAmount());
        namedParameters.put("start_date", request.getStartDate());
        namedParameters.put("end_date", request.getEndDate());
        namedParameters.put("details", request.getDetails());
        namedParameters.put("updated_at", LocalDateTime.now());
        namedParameters.put("contract_id", Integer.parseInt(request.getContractId()));

        namedParameterJdbcTemplate.update(sql.toString(), namedParameters);
    }

    public int deleteContractById(Long id) {

        StringBuilder sql = new StringBuilder();
        sql.append(" DELETE FROM "+ DatabaseConstant.LG_CONTRACT_TABLE_NAME);
        sql.append(" WHERE contract_id = :contract_id  ");

        // 2. Map ค่า id เข้ากับชื่อ parameter ใน SQL
        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("contract_id", id);

        // 3. สั่ง Execute และคืนค่าจำนวน row ที่ถูกลบ (ปกติคือ 1 ถ้าลบสำเร็จ)
        return namedParameterJdbcTemplate.update(sql.toString(), parameters);
    }

    public int deleteContractStatusById(Long id) {

        StringBuilder sql = new StringBuilder();
        sql.append(" DELETE FROM "+ DatabaseConstant.LG_CONTRACT_STATE_TABLE_NAME);
        sql.append(" WHERE contract_id = :contract_id  ");

        // 2. Map ค่า id เข้ากับชื่อ parameter ใน SQL
        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("contract_id", id);

        // 3. สั่ง Execute และคืนค่าจำนวน row ที่ถูกลบ (ปกติคือ 1 ถ้าลบสำเร็จ)
        return namedParameterJdbcTemplate.update(sql.toString(), parameters);
    }
}
