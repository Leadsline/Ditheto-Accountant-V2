import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Filter } from "lucide-react";

export default function AdminClients() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search clients by name, email, or company..." className="pl-9" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2"><Plus className="h-4 w-4" /> Add Client</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Client Name</th>
                  <th className="px-6 py-4 font-semibold">Company / Entity</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Active Services</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-secondary">
                    Jane Smith
                    <span className="block text-xs text-gray-400 mt-0.5">ID: 850412...</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">Individual</td>
                  <td className="px-6 py-4 text-sm">
                    jane.smith@email.com<br/>
                    082 555 1234
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">ITR12</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Active</span></td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-primary transition-colors">Edit</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-secondary">
                    Kabelo Ndlovu
                    <span className="block text-xs text-gray-400 mt-0.5">Dir: K & K Trading</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">K & K Trading (Pty) Ltd</td>
                  <td className="px-6 py-4 text-sm">
                    kabelo@kktrading.co.za<br/>
                    073 444 9876
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Bookkeeping</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Payroll</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">VAT201</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Active</span></td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-primary transition-colors">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination mockup */}
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
            <div>Showing 1 to 10 of 1,248 entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-primary text-white border-primary">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
