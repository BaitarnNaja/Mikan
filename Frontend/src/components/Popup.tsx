"use client";

import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Box
} from "@mui/material";
import { CheckCircleOutlined, ErrorOutlined } from '@mui/icons-material';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { COLORS } from "../styles";

interface PopupProps {
  open: boolean;
  type?: "info" | "success" | "error" | "confirm";
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void; 
}

export default function Popup({ 
  open, 
  type = "info", 
  title, 
  message, 
  onClose, 
  onConfirm 
}: PopupProps) {
  
  // กำหนดสีตามประเภท
  const getColor = () => {
    switch (type) {
      case "success": return "#4caf50";
      case "error": return "#f44336";
      default: return "#2196f3";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ p: 2, textAlign: "center" ,color:COLORS.brandPrimary}}>
        {/* แสดง Icon ตามประเภท */}
        {type === "success" && <CheckCircleOutlined sx={{ fontSize: 60, color: getColor() }} />}
        {type === "error" && <ErrorOutlined sx={{ fontSize: 60, color: getColor() }} />}
        
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          {title}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          {/* ปุ่มยกเลิก (แสดงเฉพาะตอนที่เป็นแบบ confirm) */}
          {onConfirm ? (
                    <>
                        {/* ถ้ามี onConfirm ให้โชว์ 2 ปุ่ม */}
                       <Button onClick={onConfirm} color="error" variant="contained">ยืนยัน</Button>
                        <Button onClick={onClose} color="inherit">ยกเลิก</Button>
                        
                    </>
                ) : (
                    <>
                        {/* ถ้าไม่มี ให้โชว์ปุ่มเดียว */}
                        <Button onClick={onClose} color="primary">ปิด</Button>
                    </>
                )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}