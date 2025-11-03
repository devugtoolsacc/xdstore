export default async function StorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">
          xd<span className="text-primary">store</span>
        </h1>
      </div>
    </div>
  );
}
