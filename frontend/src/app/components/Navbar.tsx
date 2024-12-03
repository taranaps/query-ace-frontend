import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold text-blue-500">
              MyApp
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-500">
              Dashboard
            </Link>
            <Link href="/manage-accounts" className="text-gray-700 hover:text-blue-500">
              Manage Accounts
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
