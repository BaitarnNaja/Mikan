async function getStore(id: string) {
  const res = await fetch(`http://localhost:3001/store/${id}`);
  return res.json();
}

export default async function StoreLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ storeId: string }>
}) {

  const { storeId } = await params;

  const store = await getStore(storeId);

  return (
    <div
      style={{
        background: store.test.bg
      }}
    >
      {children}
    </div>
  );
}