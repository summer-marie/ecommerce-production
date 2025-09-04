import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOperatingStatus } from "../redux/operatingSlice";

const OperatingBanner = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.operating);

  useEffect(() => {
    // initial fetch and periodic refresh every 5 minutes
    dispatch(fetchOperatingStatus());
    const id = setInterval(() => dispatch(fetchOperatingStatus()), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  if (!status) return null;
  const open = !!status.isOpen;
  const message = open ? status.bannerMessageOpen : status.bannerMessageClosed;

  return (
    <div
      role="status"
      className={`w-full text-center text-sm sm:text-base px-4 py-3 ${
        open
          ? "bg-emerald-600/90 text-white border-b border-emerald-400"
          : "bg-amber-600/90 text-white border-b border-amber-300"
      }`}
    >
      {message}
    </div>
  );
};

export default OperatingBanner;
