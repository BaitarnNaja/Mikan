package com.mikan.restapi.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
public class ExcelUtils {
    public byte[] generateExcelFile(String extension, Map<String, Map> dataSheets, Map<String, String> dataFormats) throws Exception{
        try {
            Workbook workbook = getWorkbook(extension);
            DataFormat poiFormat = workbook.createDataFormat();
            Map<String, CellStyle> styleCache = new HashMap<>();

            Set<String> sheetNames = dataSheets.keySet();

            for(String sheetName : sheetNames){
                Sheet sheet = initSheet(workbook, sheetName);
                Map<String, Object[]> data = dataSheets.get(sheetName);

                Set<String> keySet = data.keySet();

                int rownum = 0;
                for(String key : keySet){
                    Row row = sheet.createRow(rownum++);

                    Object[] objArr = data.get(key);
                    int cellnum = 0;
                    for(Object obj : objArr){
                        int currentCellIndex = cellnum;
                        Cell cell = row.createCell(cellnum++);

                        CellStyle currentStyle = null;

                        String colKey = String.valueOf(currentCellIndex + 1);
                        String dataFormatStr = dataFormats.get(colKey);

                        if(dataFormatStr != null && dataFormatStr.contains(";")){
                            String[] parts = dataFormatStr.split(";");
                            String formatPattern = (parts.length > 1) ? parts[1] : "";
//                            log.info("formatPatternformatPattern : {}",formatPattern);

                            if(!formatPattern.isEmpty()){
                                if(styleCache.containsKey(formatPattern)){
                                    currentStyle = styleCache.get(formatPattern);
                                } else {
                                    CellStyle newStyle = workbook.createCellStyle();
                                    newStyle.setDataFormat(poiFormat.getFormat(formatPattern));
                                    styleCache.put(formatPattern, newStyle);
                                    currentStyle = newStyle;
                                }
                            }
                        }

                        // --- ส่วนใส่ข้อมูล ---
                        if (obj != null) {
                            if (obj instanceof String){
                                cell.setCellValue((String) obj);
                            } else if (obj instanceof Integer) {
                                cell.setCellValue(((Integer) obj).doubleValue());
                            } else if (obj instanceof BigDecimal) {
                                // Cast ตรงๆ เร็วกว่าแปลงเป็น String แล้ว new ใหม่
                                cell.setCellValue(((BigDecimal) obj).doubleValue());
                                if(currentStyle != null) cell.setCellStyle(currentStyle);
                            } else if (obj instanceof Double) {
                                cell.setCellValue((Double) obj);
                                if(currentStyle != null) cell.setCellStyle(currentStyle);
                            } else if (obj instanceof Date) {
                                cell.setCellValue((Date) obj);
                                if(currentStyle != null) cell.setCellStyle(currentStyle);
                            } else {
                                cell.setCellValue(String.valueOf(obj));
                            }
                        } else {
                            cell.setCellValue("");
                        }
                    }
                }
            }
            return workbookToByteArray(workbook);
        }catch (Exception e){
            throw new Exception("Error in generateExcelFile: "+ e.getMessage());
        }

    }

    public static byte[] workbookToByteArray(Workbook workbook) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()){
            workbook.write(outputStream);
            workbook.close();
            return outputStream.toByteArray();
        }
    }

    public Sheet initSheet(Workbook workbook, String sheetName) throws Exception {
        try {
            return workbook.createSheet(sheetName);
        } catch (Exception e) {
            throw new Exception("Error in initSheet: " + e.getMessage());
        }
    }

    public Workbook getWorkbook(String extension) throws Exception {
        try {
            if ("xls".equalsIgnoreCase(extension)) {
                return new HSSFWorkbook();
            } else if ("xlsx".equalsIgnoreCase(extension)) {
                return new XSSFWorkbook();
            } else {
                // ดักกรณีส่งนามสกุลผิดเข้ามา
                throw new IllegalArgumentException("Invalid excel extension: " + extension);
            }
        } catch (Exception e) {
            // ส่ง Exception ต่อไปให้ Controller หรือผู้เรียกใช้จัดการ
            throw new Exception("Error in getWorkbook: " + e.getMessage());
        }
    }

}
