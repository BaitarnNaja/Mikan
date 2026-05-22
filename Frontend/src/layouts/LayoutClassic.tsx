import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default function LayoutClassic({ children }: Props) {
  return (
    <>
      <Box sx={{ p: 2, backgroundColor: "primary.main", color: "#fff" }}>
        Classic Header
      </Box>

      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: 200, p: 2, borderRight: "1px solid #ddd" }}>
          Sidebar
        </Box>

        <Box sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </>
  );
}