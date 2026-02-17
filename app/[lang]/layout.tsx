import '../globals.css';

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
