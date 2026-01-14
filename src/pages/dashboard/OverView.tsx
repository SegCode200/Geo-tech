
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaLandmark,
  FaMoneyBillWave,
} from "react-icons/fa";
import dayjs from "dayjs";
import { useAppSelector } from "../../store/hooks";
import { useDashboardOverview } from "../../hooks/useHooks";

const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4"
  >
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
    PAID: "bg-green-100 text-green-700",
    UNPAID: "bg-gray-100 text-gray-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

const Dashboard = () => {
  const { user } = useAppSelector((s) => s.auth);

  const { data, error, isLoading } = useDashboardOverview()

  if (isLoading) {
    return <div className="p-6">Loading dashboard…</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-600">
        Failed to load dashboard data
      </div>
    );
  }

  const { stats, recentApplications, recentPayments } = data;

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Welcome */}
      <div className="bg-blue-700 text-white rounded-xl p-6 mb-6 shadow">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name ?? "Citizen"}
        </h1>
        <p className="text-blue-100">
          Certificate of Occupancy Dashboard Overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Registered Lands"
          value={stats.totalLands}
          icon={<FaLandmark />}
          color="text-blue-600"
        />
        <StatCard
          label="Total Applications"
          value={stats.totalApplications}
          icon={<FaFileAlt />}
          color="text-indigo-600"
        />
        <StatCard
          label="Approved"
          value={stats.approvedCofO}
          icon={<FaCheckCircle />}
          color="text-green-600"
        />
        <StatCard
          label="Pending"
          value={stats.pendingCofO}
          icon={<FaClock />}
          color="text-yellow-600"
        />
        <StatCard
          label="Rejected"
          value={stats.rejectedCofO}
          icon={<FaTimesCircle />}
          color="text-red-600"
        />
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-bold mb-4">
          Recent C of O Applications
        </h2>

        {recentApplications.length === 0 ? (
          <p className="text-gray-500">No applications yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Status</th>
                  <th>Payment</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id} className="border-b last:border-none">
                    <td className="py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      <StatusBadge status={app.paymentStatus} />
                    </td>
                    <td className="text-gray-600">
                      {dayjs(app.submittedAt).format("DD MMM YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaMoneyBillWave className="text-green-600" />
          Recent Payments
        </h2>

        {recentPayments.length === 0 ? (
          <p className="text-gray-500">No payments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Reference</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.reference} className="border-b last:border-none">
                    <td className="py-3 font-mono">{p.reference}</td>
                    <td>₦{p.amount.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="text-gray-600">
                      {dayjs(p.date).format("DD MMM YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
