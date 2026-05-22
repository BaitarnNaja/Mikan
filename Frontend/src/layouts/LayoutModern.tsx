import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default function LayoutModern({ children }: Props) {
  return (
    <>
      <Box sx={{ p: 4, textAlign: "center", backgroundColor: "secondary.main", color: "#fff" }}>
        Modern Centered Header
      </Box>

      <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
        {children}
      </Box>
    </>
  );
}