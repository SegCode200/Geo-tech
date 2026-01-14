import toast from "react-hot-toast";
export const successToast = (message: string) =>
  toast.success(message, {
    icon: "✓" ,
    style: {
      background: "#065f46", // emerald-800
      color: "#ecfdf5",
    },
  });

export const errorToast = (message: string) =>
  toast.error(message, {
    icon: "✗",
    style: {
      background: "#7f1d1d", // red-800
      color: "#fef2f2",
    },
  });
