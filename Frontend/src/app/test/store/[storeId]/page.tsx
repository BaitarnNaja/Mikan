import { Box } from "@mui/material";

async function getProducts(storeId: string) {
  const res = await fetch(`http://localhost:3001/products/${storeId}`);
  return res.json();
}

export default async function ShopPage({
  params
}: {
  params: Promise<{ storeId: string }>
}) {

  const { storeId } = await params;

  const data = await getProducts(storeId);
  const products = data.products;
  return (
    <div>
      {products.map((p: any) => (
        <Box
          sx={{
            background: data.theme?.bg,
            margin:10
          }}
        >key={p.id} {p.name}</Box>
      ))}
    </div>
  );
}