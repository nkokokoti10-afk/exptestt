import { useState } from 'react';
import { CheckCircle, Send, Shield, AlertCircle, FileText, MapPin } from 'lucide-react';
import { User } from '../lib/types';

interface KYCManagementTabProps {
  allUsers: User[];
  approveKYC: (userId: string) => void;
  rejectKYC: (userId: string) => void;
}

export function KYCManagementTab({ allUsers, approveKYC, rejectKYC }: KYCManagementTabProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const selectedUser = selectedUserId ? allUsers.find(u => u.id === selectedUserId) : null;

  const filteredUsers = allUsers.filter(u => {
    if (filterStatus === 'ALL') return true;
    return u.kycStatus === filterStatus;
  });

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-[#26a69a]/20 text-[#26a69a]';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'REJECTED':
        return 'bg-[#ef5350]/20 text-[#ef5350]';
      default:
        return 'bg-[#8b949e]/20 text-[#8b949e]';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return '✓';
      case 'PENDING':
        return '⏳';
      case 'REJECTED':
        return '✕';
      default:
        return '○';
    }
  };

  return (
    <div className="space-y-6">
      {/* KYC Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Total KYC Submissions</span>
            <Shield className="h-4 w-4 text-[#2962ff]" />
          </div>
          <p className="text-3xl font-bold text-white">{allUsers.filter(u => u.kycStatus).length}</p>
          <p className="text-xs text-[#8b949e]">Submitted: <span className="text-white">{allUsers.filter(u => u.kycStatus).length}</span></p>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Pending Reviews</span>
            <Send className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-white">{allUsers.filter(u => u.kycStatus === 'PENDING').length}</p>
          <p className="text-xs text-yellow-500">Awaiting approval</p>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Approved</span>
            <CheckCircle className="h-4 w-4 text-[#26a69a]" />
          </div>
          <p className="text-3xl font-bold text-white">{allUsers.filter(u => u.kycStatus === 'APPROVED').length}</p>
          <p className="text-xs text-[#26a69a]">Verified users</p>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] uppercase">Rejected</span>
            <AlertCircle className="h-4 w-4 text-[#ef5350]" />
          </div>
          <p className="text-3xl font-bold text-white">{allUsers.filter(u => u.kycStatus === 'REJECTED').length}</p>
          <p className="text-xs text-[#ef5350]">Failed review</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#0d1117] text-[#8b949e] border border-[#21262d] hover:border-[#2962ff]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* KYC Submissions Table */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">KYC Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">User Email</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Full Name</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Status</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Submitted Date</th>
                <th className="text-left py-3 px-4 text-[#8b949e] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#21262d] hover:bg-[#0d1117]/50">
                  <td className="py-3 px-4 text-white">{user.email}</td>
                  <td className="py-3 px-4 text-white">{user.name}</td>
                  <td className="py-3 px-4">
                    {user.kycStatus ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${getStatusBadgeColor(user.kycStatus)}`}>
                        {getStatusIcon(user.kycStatus)} {user.kycStatus}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium text-[#8b949e]">Not Submitted</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#8b949e]">
                    {user.kycStatus ? 'Submitted' : 'N/A'}
                  </td>
                  <td className="py-3 px-4 space-x-2 flex">
                    {user.kycStatus && (
                      <button
                        onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                        className="px-3 py-1 bg-[#2962ff] hover:bg-[#1e47a0] text-white rounded text-xs transition-colors"
                      >
                        {selectedUserId === user.id ? 'Close' : 'View'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-[#8b949e]">
            No KYC submissions found for this filter
          </div>
        )}
      </div>

      {/* KYC Details Panel */}
      {selectedUser && selectedUser.kycStatus && (
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">KYC Details: {selectedUser.name}</h3>
            <button
              onClick={() => setSelectedUserId(null)}
              className="text-[#8b949e] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#2962ff]" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#0d1117] rounded-lg border border-[#21262d]">
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">First Name</p>
                <p className="text-white">{selectedUser.kycData?.firstName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">Last Name</p>
                <p className="text-white">{selectedUser.kycData?.lastName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">Date of Birth</p>
                <p className="text-white">{selectedUser.kycData?.dateOfBirth || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">Country</p>
                <p className="text-white">{selectedUser.kycData?.country || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#2962ff]" />
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#0d1117] rounded-lg border border-[#21262d]">
              <div className="md:col-span-2">
                <p className="text-xs text-[#8b949e] uppercase mb-1">Street Address</p>
                <p className="text-white">{selectedUser.kycData?.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">City</p>
                <p className="text-white">{selectedUser.kycData?.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">State</p>
                <p className="text-white">{selectedUser.kycData?.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">Zip Code</p>
                <p className="text-white">{selectedUser.kycData?.zipCode || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Document Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#2962ff]" />
              Document Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#0d1117] rounded-lg border border-[#21262d]">
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">Document Type</p>
                <p className="text-white">{selectedUser.kycData?.documentType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b949e] uppercase mb-1">Status</p>
                <p className="text-white">{selectedUser.kycStatus}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-[#8b949e] uppercase mb-2">Documents Status</p>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${selectedUser.kycData?.documentFrontName ? 'bg-[#26a69a]/20 text-[#26a69a]' : 'bg-[#8b949e]/20 text-[#8b949e]'}`}>
                    {selectedUser.kycData?.documentFrontName ? '✓ Front' : '○ Front'}
                  </span>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${selectedUser.kycData?.documentBackName ? 'bg-[#26a69a]/20 text-[#26a69a]' : 'bg-[#8b949e]/20 text-[#8b949e]'}`}>
                    {selectedUser.kycData?.documentBackName ? '✓ Back' : '○ Back'}
                  </span>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${selectedUser.kycData?.selfieName ? 'bg-[#26a69a]/20 text-[#26a69a]' : 'bg-[#8b949e]/20 text-[#8b949e]'}`}>
                    {selectedUser.kycData?.selfieName ? '✓ Selfie' : '○ Selfie'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Actions */}
          {selectedUser.kycStatus === 'PENDING' && (
            <div className="space-y-4 pt-6 border-t border-[#21262d]">
              <h4 className="text-sm font-bold text-white uppercase">KYC Decision</h4>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    approveKYC(selectedUser.id);
                    setSelectedUserId(null);
                  }}
                  className="flex-1 px-6 py-3 bg-[#26a69a] hover:bg-[#1f8b7d] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Approve KYC
                </button>
                <button
                  onClick={() => {
                    rejectKYC(selectedUser.id);
                    setSelectedUserId(null);
                  }}
                  className="flex-1 px-6 py-3 bg-[#ef5350] hover:bg-[#d32f2f] text-white font-bold rounded-lg transition-colors"
                >
                  Reject KYC
                </button>
              </div>
              <p className="text-xs text-[#8b949e] p-3 bg-[#0d1117] rounded-lg border border-[#21262d]">
                Approving will unlock this user's full platform access. Rejecting will require them to resubmit.
              </p>
            </div>
          )}

          {selectedUser.kycStatus === 'APPROVED' && (
            <div className="p-4 bg-[#26a69a]/10 border border-[#26a69a]/30 rounded-lg">
              <p className="text-sm text-[#26a69a] flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                This user's KYC has been approved and they have full platform access.
              </p>
            </div>
          )}

          {selectedUser.kycStatus === 'REJECTED' && (
            <div className="p-4 bg-[#ef5350]/10 border border-[#ef5350]/30 rounded-lg">
              <p className="text-sm text-[#ef5350] flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                This user's KYC was rejected. They need to resubmit.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
