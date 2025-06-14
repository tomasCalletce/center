export default function TestUploadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 