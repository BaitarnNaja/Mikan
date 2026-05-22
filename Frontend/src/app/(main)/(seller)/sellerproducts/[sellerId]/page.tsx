'use client'

import React, { useState } from 'react';
import {
  Box, TextField, Typography, Button, MenuItem, Switch,
  Stack, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, AddPhotoAlternate } from '@mui/icons-material';
import { sellerProductService } from '@/src/services/sellerProfileService';

const ProductForm = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [productData, setProductData] = useState({
    name: '',
    categoryId: '',
    type: '',
    productDsc: '',
  });

  // เพิ่ม State ต่อจากที่มีอยู่เดิม
  const [activeTab, setActiveTab] = useState<'all' | 'options'>('all');

  // แยก State รูปภาพ
  const [mainImages, setMainImages] = useState<{ file: File, preview: string }[]>([]);
  const [optionImages, setOptionImages] = useState<{ file: File, preview: string }[]>([]);

  // ปรับปรุงฟังก์ชันการรับไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (activeTab === 'options') {
        // โหมดตัวเลือก: เลือกได้แค่ 1 รูป และจะไปทับรูปเก่าทันที (หรือแจ้งเตือน)
        const file = filesArray[0]; // เอาแค่ไฟล์แรก
        if (file) {
          setOptionImages([{
            file,
            preview: URL.createObjectURL(file)
          }]);
        }
      } else {
        // โหมดแนบทั้งหมด: เพิ่มรูปเข้าไปเรื่อยๆ ได้ปกติ
        const newItems = filesArray.map(file => ({
          file,
          preview: URL.createObjectURL(file)
        }));
        setMainImages(prev => [...prev, ...newItems]);
      }
    }
  };

  // ฟังก์ชันลบรูป
  const handleRemoveImage = (index: number) => {
    if (activeTab === 'all') {
      setMainImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setOptionImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  // กำหนดรูปที่จะแสดงใน List ปัจจุบัน
  const currentDisplayImages = activeTab === 'all' ? mainImages : optionImages;

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleUploadAndSave = async () => {
    try {
      // อัปโหลดรูปทีละรูปเพื่อเอาชื่อไฟล์จาก server
      const uploadPromises = imageFiles.map(file => sellerProductService.uploadImage(file));
      const savedPaths = await Promise.all(uploadPromises);

      // savedPaths จะได้ออกมาเป็น ["./uploads/images/file1.png", "./uploads/images/file2.png"]
      console.log(`Sending ${savedPaths} to /api/v1/manage-product`);

      // เรียกใช้ sellerProductService.manageProduct(payload) ต่อที่นี่
    } catch (error) {
      console.error("Upload failed", error);
    }
    handleSubmit()
  };

  const handleSubmit = async () => {
    try {
      if (imageFiles.length === 0) {
        alert("กรุณาแนบรูปสินค้าอย่างน้อย 1 รูป");
        return;
      }
      const uploadPromises = imageFiles.map(file => sellerProductService.uploadImage(file));
      const savedPaths = await Promise.all(uploadPromises);

      const payload = {
        name: productData.name,
        categoryId: "00b4c456-eddf-4829-bb7e-3693f5778ff1",
        type: productData.type,
        productDsc: productData.productDsc,
        imgs: savedPaths,
        options: [
          {
            code: "SKU-001",
            optionName: "สีขาว",
            quantity: 10,
            price: 100,
            img: savedPaths[0]
          }
        ]
      };

      const result = await sellerProductService.manageProduct(payload);

      if (result.code === "200") {
        alert("บันทึกสินค้าสำเร็จ!");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };
  return (
    <Box sx={{
      p: { xs: 2, md: 4 }, minHeight: '100vh', mx: {
        xs: 2,
        sm: 6,
        md: 10,
        lg: 20
      }
    }}>

      {/* Header Buttons - Responsive Layout */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        gap: 1.5,
        justifyContent: 'flex-end',
        mb: 3,
      }}>
        <Button variant="text" color="error" sx={{ textTransform: 'none' }}>ยกเลิก</Button>
        <Button variant="contained" sx={{ bgcolor: '#d8703f', borderRadius: 1.5, px: 3, textTransform: 'none' }} onClick={handleUploadAndSave}>บันทึก</Button>
        <Button variant="contained" sx={{ bgcolor: '#d8703f', borderRadius: 1.5, px: 3, textTransform: 'none' }}>บันทึกและเพิ่มอีก</Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 4, lg: 8 } }}>

        {/* ฝั่งซ้าย: ข้อมูลสินค้า */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ color: '#b55a2d', mb: 3, fontWeight: 'bold', textAlign: { xs: 'center', md: 'left' } }}>
            ข้อมูลทั่วไปของสินค้า
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: '500', color: '#b55a2d' }}>ชื่อสินค้า</Typography>
              <TextField fullWidth placeholder="username" size="small" />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: '500', color: '#b55a2d' }}>หมวดหมู่สินค้า</Typography>
                <TextField select fullWidth size="small" defaultValue="">
                  <MenuItem value="">กรุณาเลือกประเภทสินค้า</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: '500', color: '#b55a2d' }}>ประเภทสินค้า</Typography>
                <TextField select fullWidth size="small" defaultValue="">
                  <MenuItem value="">กรุณาเลือกประเภทสินค้า</MenuItem>
                  <MenuItem value="">สแตนดี้อะคริลิก</MenuItem>
                  <MenuItem value="">พวงกุญแจ</MenuItem>
                  <MenuItem value="">สติกเกอร์</MenuItem>
                  <MenuItem value="">โฟโต้การ์ด</MenuItem>
                  <MenuItem value="">เสื้อยืด</MenuItem>
                  <MenuItem value="">เสื้อแจ็คเก็ต</MenuItem>
                  <MenuItem value="">เครื่องประดับ</MenuItem>
                  <MenuItem value="">สินค้าลิมิเต็ด</MenuItem>
                  <MenuItem value="">ฟิกเกอร์</MenuItem>
                  <MenuItem value="">กล่องสุ่ม</MenuItem>
                  <MenuItem value="">รุ่นลิมิเต็ด</MenuItem>
                  <MenuItem value="">คอลเลกชันเซ็ต</MenuItem>
                  <MenuItem value="">แก้วและภาชนะ</MenuItem>
                  <MenuItem value="">เครื่องเขียน</MenuItem>
                  <MenuItem value="">ของตกแต่งบ้าน</MenuItem>
                  <MenuItem value="">สินค้าเพื่อความผ่อนคลาย</MenuItem>
                  <MenuItem value="">วอลเปเปอร์</MenuItem>
                  <MenuItem value="">วอยซ์แพ็ก</MenuItem>
                  <MenuItem value="">ดิจิทัลอาร์ต</MenuItem>
                  <MenuItem value="">แอสเซทวีทูเบอร์</MenuItem>
                  <MenuItem value="">คอสเพลย์</MenuItem>
                  <MenuItem value="">สินค้าอีเวนต์</MenuItem>
                  <MenuItem value="">สินค้าลิมิเต็ด</MenuItem>
                  <MenuItem value="">คอมมิชชัน</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* ตัวเลือกสินค้า (Responsive Table) */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: '500', color: '#b55a2d' }}>ตัวเลือกสินค้า</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: { xs: '600px', sm: '100%' } }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    {['รหัสสินค้า', 'ชื่อตัวเลือก', 'หน่วยสินค้า', 'ราคา'].map((h) => (
                      <Typography key={h} variant="caption" sx={{ flex: 1, color: '#b55a2d', fontWeight: 'bold' }}>{h}</Typography>
                    ))}
                  </Box>
                  {[1, 2].map((row) => (
                    <Box key={row} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField sx={{ flex: 1 }} size="small" placeholder="SKU-XXXX" />
                      <TextField sx={{ flex: 1 }} size="small" placeholder="สีขาว" />
                      <TextField sx={{ flex: 1 }} size="small" placeholder="ชิ้น" />
                      <TextField sx={{ flex: 1 }} size="small" placeholder="100.00" />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* แนบรูปสินค้า (สไลด์ได้บนมือถือ) */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1.5, fontWeight: '500', color: '#b55a2d' }}>
                แนบรูปสินค้า
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mb: 2 }}>
                {/* ปุ่มโหมดแนบรูปทั้งหมด */}
                <Button
                  variant={activeTab === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab('all')}
                  sx={{
                    bgcolor: activeTab === 'all' ? '#d8703f' : 'transparent',
                    color: activeTab === 'all' ? '#fff' : '#d8703f',
                    borderColor: '#d8703f',
                    textTransform: 'none',
                    '&:hover': { bgcolor: activeTab === 'all' ? '#bf5d2f' : 'rgba(216, 112, 63, 0.1)' }
                  }}
                >
                  แนบรูปทั้งหมด
                </Button>

                {/* ปุ่มโหมดแนบตามตัวเลือก */}
                <Button
                  variant={activeTab === 'options' ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab('options')}
                  sx={{
                    bgcolor: activeTab === 'options' ? '#d8703f' : 'transparent',
                    color: activeTab === 'options' ? '#fff' : '#d8703f',
                    borderColor: '#d8703f',
                    textTransform: 'none',
                    '&:hover': { bgcolor: activeTab === 'options' ? '#bf5d2f' : 'rgba(216, 112, 63, 0.1)' }
                  }}
                >
                  แนบตามตัวเลือก
                </Button>

                {activeTab === 'options' && (
                  <TextField select size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }} defaultValue="ตัวเลือก">
                    <MenuItem value="ตัวเลือก">ตัวเลือก 1</MenuItem>
                    <MenuItem value="ตัวเลือก">ตัวเลือก 2</MenuItem>
                  </TextField>
                )}
              </Box>

              {/* ส่วนแสดงรูปภาพที่เลือก (สไลด์ได้) */}
              {/* ส่วนแสดงรูปภาพที่เลือก */}
              <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, minHeight: 90 }}>

                {currentDisplayImages.map((item, index) => (
                  <Box key={index} sx={{ position: 'relative', minWidth: 80, width: 80, height: 80, borderRadius: 0.5, border: '1px solid #ddd', overflow: 'hidden' }}>
                    <Box component="img" src={item.preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,255,255,0.8)' }}
                    >
                      <DeleteIcon sx={{ fontSize: 16, color: 'red' }} />
                    </IconButton>
                  </Box>
                ))}

                {/* เงื่อนไขการแสดงปุ่มเพิ่มรูป: 
                  1. ถ้าเป็นโหมด 'all' แสดงตลอดเวลา
                  2. ถ้าเป็นโหมด 'options' แสดงเฉพาะตอนที่ยังไม่มีรูป (count < 1)
                */}
                {(activeTab === 'all' || (activeTab === 'options' && optionImages.length < 1)) && (
                  <Box
                    component="label"
                    sx={{
                      minWidth: 80, width: 80, height: 80,
                      bgcolor: '#f5f5f5', borderRadius: 0.5,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px dashed #d8703f', cursor: 'pointer'
                    }}
                  >
                    <AddPhotoAlternate sx={{ color: '#d8703f' }} />
                    <input
                      type="file"
                      hidden
                      multiple={activeTab === 'all'}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: '500', color: '#b55a2d' }}>รายละเอียดสินค้า</Typography>
              <TextField
                fullWidth multiline rows={5}
                placeholder="อธิบายเกี่ยวกับสินค้าของคุณ"
              />
            </Box>
          </Stack>
        </Box>

        {/* ฝั่งขวา: สถานะสินค้า */}
        <Box sx={{ width: { xs: '100%', lg: '350px' }, mt: { xs: 2, lg: 0 } }}>
          <Typography variant="h5" sx={{ color: '#b55a2d', mb: 3, fontWeight: 'bold' }}>
            สถานะสินค้า
          </Typography>
          <Stack spacing={3} sx={{ bgcolor: { xs: '#fffbf7', lg: 'transparent' }, p: { xs: 2, lg: 0 }, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#b55a2d' }}>รูปแบบความพร้อมจัดส่ง</Typography>
              <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#d8703f' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#d8703f' } }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#b55a2d' }}>แสดงสินค้าชิ้นนี้</Typography>
              <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#d8703f' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#d8703f' } }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#b55a2d' }}>ระยะเวลาการเตรียมสินค้า</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField size="small" sx={{ width: 60 }} />
                <Typography variant="body1" sx={{ color: '#b55a2d' }}>วัน</Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>

    </Box>
  );
};

export default ProductForm;