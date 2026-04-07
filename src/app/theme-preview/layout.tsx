export default function ThemePreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-preview-wrapper">
      {children}
    </div>
  );
}
