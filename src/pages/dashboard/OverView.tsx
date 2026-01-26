
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaLandmark,
  FaMoneyBillWave,
  FaArrowRight,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";
import dayjs from "dayjs";
import { useAppSelector } from "../../store/hooks";
import { useDashboardOverview } from "../../hooks/useHooks";
import { useNavigate } from "react-router-dom";

const StatCard = ({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ duration: 0.2 }}
    className={`${bgColor} rounded-lg shadow-lg p-4 sm:p-6 border-l-4 ${color.replace('text-', 'border-')}`}
  >
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{value}</p>
      </div>
      <div className={`text-3xl sm:text-5xl ${color} opacity-20 flex-shrink-0`}>{icon}</div>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-700 border-l-4 border-green-600",
    PENDING: "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-600",
    REJECTED: "bg-red-100 text-red-700 border-l-4 border-red-600",
    PAID: "bg-green-100 text-green-700 border-l-4 border-green-600",
    SUCCESS: "bg-gray-100 text-gray-700 border-l-4 border-gray-600",
    FAILED: "bg-red-100 text-red-700 border-l-4 border-red-600",
    IN_REVIEW: "bg-blue-100 text-blue-700 border-l-4 border-blue-600",
    DRAFT: "bg-slate-100 text-slate-700 border-l-4 border-slate-600",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
        map[status] || "bg-gray-100 text-gray-700 border-l-4 border-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

const ActionCard = ({
  title,
  description,
  icon,
  color,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={`${color} text-white rounded-lg p-4 sm:p-6 text-left shadow-lg hover:shadow-xl transition-all h-full`}
  >
    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
      <div className="text-2xl sm:text-3xl flex-shrink-0">{icon}</div>
      <FaArrowRight className="text-base sm:text-lg flex-shrink-0" />
    </div>
    <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-1">{title}</h3>
    <p className="text-xs sm:text-sm opacity-90 line-clamp-2">{description}</p>
  </motion.button>
);

const Dashboard = () => {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const { data, error, isLoading } = useDashboardOverview()

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Welcome Skeleton */}
        <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-lg p-8 mb-8 shadow animate-pulse">
          <div className="h-8 bg-blue-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>

        {/* Action Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-blue-300 rounded-lg p-6 animate-pulse h-32"></div>
          ))}
        </div>

        {/* Recent Applications Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <FaTimesCircle className="text-red-600 text-2xl" />
            <div>
              <h3 className="font-bold text-red-900">Failed to load dashboard data</h3>
              <p className="text-red-700 text-sm">Please refresh the page and try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentApplications, recentPayments } = data;

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-lg"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 truncate">
              Welcome, {user?.name ?? "Citizen"}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-lg line-clamp-2">
              Certificate of Occupancy Management System
            </p>
          </div>
          <div className="hidden md:block text-6xl opacity-10 flex-shrink-0">
            <FaShieldAlt />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <StatCard
          label="Registered Lands"
          value={stats.totalLands}
          icon={<FaLandmark />}
          color="text-blue-600"
          bgColor="bg-white"
        />
        <StatCard
          label="Total Applications"
          value={stats.totalApplications}
          icon={<FaFileAlt />}
          color="text-indigo-600"
          bgColor="bg-white"
        />
        <StatCard
          label="Approved"
          value={stats.approvedCofO}
          icon={<FaCheckCircle />}
          color="text-green-600"
          bgColor="bg-white"
        />
        <StatCard
          label="Pending"
          value={stats.pendingCofO}
          icon={<FaClock />}
          color="text-yellow-600"
          bgColor="bg-white"
        />
        <StatCard
          label="Rejected"
          value={stats.rejectedCofO}
          icon={<FaTimesCircle />}
          color="text-red-600"
          bgColor="bg-white"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <ActionCard
          title="Register Land"
          description="Register a new property or land with the system"
          icon={<FaLandmark />}
          color="bg-gradient-to-br from-blue-600 to-blue-700"
          onClick={() => navigate("/dashboard/land-registration")}
        />
        <ActionCard
          title="New C of O Application"
          description="Apply for a new Certificate of Occupancy"
          icon={<FaFileAlt />}
          color="bg-gradient-to-br from-indigo-600 to-indigo-700"
          onClick={() => navigate("/dashboard/c-of-o-application")}
        />
        <ActionCard
          title="Search Land"
          description="Search for land information and details"
          icon={<FaChartLine />}
          color="bg-gradient-to-br from-emerald-600 to-emerald-700"
          onClick={() => navigate("/dashboard/land-search")}
        />
      </div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
            <FaFileAlt className="text-blue-600 flex-shrink-0" />
            <span className="truncate">Recent C of O Applications</span>
          </h2>
          <button
            onClick={() => navigate("/dashboard/list-c-of-o-application")}
            className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          >
            View All <FaArrowRight className="text-xs" />
          </button>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <FaFileAlt className="text-3xl sm:text-4xl text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 font-medium text-sm sm:text-base">No applications yet</p>
            <button
              onClick={() => navigate("/dashboard/c-of-o-application")}
              className="mt-4 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Create First Application
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:-mx-6 md:mx-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-gray-600 font-semibold text-xs">ID</th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-gray-600 font-semibold text-xs">Status</th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left text-gray-600 font-semibold text-xs">Payment</th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left text-gray-600 font-semibold text-xs">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 sm:px-6 py-2 sm:py-3 font-mono text-gray-900 text-xs sm:text-sm truncate">{app.applicationNumber}</td>
                    <td className="px-4 sm:px-6 py-2 sm:py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-2 sm:py-3">
                      <StatusBadge status={app.paymentStatus} />
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">
                      {dayjs(app.submittedAt).format("DD MMM")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Recent Payments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
            <FaMoneyBillWave className="text-green-600 flex-shrink-0" />
            <span className="truncate">Recent Payments</span>
          </h2>
          <button
            onClick={() => navigate("/dashboard/cofo-payment")}
            className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          >
            View All <FaArrowRight className="text-xs" />
          </button>
        </div>

        {recentPayments.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <FaMoneyBillWave className="text-3xl sm:text-4xl text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 font-medium text-sm sm:text-base">No payments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:-mx-6 md:mx-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-gray-600 font-semibold text-xs">Ref</th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-gray-600 font-semibold text-xs">Amount</th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left text-gray-600 font-semibold text-xs">Status</th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left text-gray-600 font-semibold text-xs">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.slice(0, 5).map((p) => (
                  <tr key={p.reference} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 sm:px-6 py-2 sm:py-3 font-mono text-gray-900 text-xs sm:text-sm truncate">{p.reference.substring(0, 8)}</td>
                    <td className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-gray-900 text-xs sm:text-sm">₦{(p.amount / 1000).toFixed(0)}K</td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-2 sm:py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">
                      {dayjs(p.date).format("DD MMM")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
