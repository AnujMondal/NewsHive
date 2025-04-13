import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function ToastNotification({ message, type, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Set the timeout duration based on the type of notification
    const duration = type === "success" ? 2000 : 10000; // Success: 2 seconds, Error: 10 seconds
    
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const textColor = isSuccess ? "text-green-700" : "text-red-700";
  const icon = isSuccess ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />;

  return (
    <div className="fixed top-4 right-4 z-100">
      <AnimatePresence>
        {show && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 rounded-xl shadow-lg px-4 py-3 ${bgColor} ${textColor} min-w-[250px]`}
          >
            {icon}
            <span className="font-medium">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
