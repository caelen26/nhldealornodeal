import './globals.css';

export const metadata = {
  title: 'NHL Deal or No Deal',
  description: 'Pick a case. Beat the banker. Walk away with the best NHL star you can.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-navy text-white antialiased">{children}</body>
    </html>
  );
}
