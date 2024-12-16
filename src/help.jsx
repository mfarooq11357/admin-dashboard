import { Cog, Users, Shield, UserPlus, Wrench } from "lucide-react";

export default function FAQs() {
  return (
    <div className="container mx-auto px-4 py-12 bg-black">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-white mb-4 text-yellow-400">FAQs</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* FAQ 1 */}
        <div className="bg-zinc-800 relative text-white">
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2">
              What is a Society Management System?
            </h2>
            <p className="text-gray-300 pr-12">
              A Society Management System is a platform designed to streamline
              the operations of residential or commercial societies.
            </p>
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <Cog className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 2 */}
        <div className="bg-zinc-800 relative text-white">
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2">
              How can members use this system?
            </h2>
            <p className="text-gray-300 pr-12">
              Members can log in to their accounts to pay bills, submit
              maintenance requests, view notices, and communicate with the
              management committee.
            </p>
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 3 */}
        <div className="bg-zinc-800 relative text-white">
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2">
              Is my personal data secure in this system?
            </h2>
            <p className="text-gray-300 pr-12">
              Yes, your data is encrypted and stored securely. Only authorized
              personnel have access to sensitive information.
            </p>
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 4 */}
        <div className="bg-zinc-800 relative text-white">
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2">
              Who can access the admin dashboard?
            </h2>
            <p className="text-gray-300 pr-12">
              Only authorized individuals, such as society committee members or
              property managers, can access the admin dashboard to manage
              society operations.
            </p>
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 5 */}
        <div className="bg-zinc-800 relative text-white md:col-span-2 lg:col-span-2">
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2">
              What should I do if I face a technical issue?
            </h2>
            <p className="text-gray-300 pr-12">
              If you encounter any issues, contact the support team via the
              'Help' section in the system or reach out to the management
              committee.
            </p>
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <Wrench className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
