import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, CircleDashed, KeyRound, MailCheck, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { RESET_PASSWORD_ROUTE, SEND_RESET_OTP_ROUTE } from "../../constants/route";
import userAuthStore from "../../store/authStore";

export default function PasswordReset() {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const setUser = userAuthStore((state) => state.setUser);

    const handleTriggerOtp = async () => {
        setLoading(true);
        try {
            const { data } = await api.post(SEND_RESET_OTP_ROUTE);
            toast.success(data?.message || "Reset code sent successfully!");
            setStep(2);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to send reset code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post(RESET_PASSWORD_ROUTE, { otp, newPassword:password });
            console.log(data);
            setUser(data.user);
            toast.success(data?.message || "Password reset successfully!");
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Invalid code or failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFCFA] flex flex-col items-center justify-center py-12 px-4 font-sans antialiased text-stone-900">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white py-8 px-6 border border-stone-200 rounded-2xl shadow-sm sm:px-10"
                >
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute left-0">
                            <button
                                type="button"
                                onClick={() => step === 2 ? setStep(1) : navigate("/")}
                                className="p-2 rounded-xl text-stone-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <span className="font-serif font-extrabold italic text-2xl text-[#0077CC] block">
                                The Daily Binge
                            </span>
                            <h2 className="mt-1 text-2xl font-serif text-stone-900">
                                {step === 1 ? "Reset Your Password" : "Create New Password"}
                            </h2>
                        </motion.div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="trigger-step"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6 text-center"
                            >
                                <div className="flex justify-center text-stone-400 py-2">
                                    <MailCheck size={48} className="text-[#0077CC] stroke-[1.5]" />
                                </div>
                                
                                <p className="text-sm text-stone-600 px-2 leading-relaxed">
                                    Click below to send a secure recovery code to your registered email address.
                                </p>

                                <motion.button
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleTriggerOtp}
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-[#0077CC] hover:bg-[#005FA3] transition-colors disabled:opacity-70"
                                >
                                    {loading ? (
                                        <CircleDashed size={14} className="animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">Send Reset Code <ArrowRight size={14} /></span>
                                    )}
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="verify-step"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                                onSubmit={handleVerifyOtp}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label htmlFor="otp" className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                                            Reset Code
                                        </label>
                                        <button 
                                            type="button" 
                                            onClick={handleTriggerOtp} 
                                            disabled={loading}
                                            className="text-xs font-medium text-[#005FA3] hover:text-stone-900 transition-colors disabled:opacity-50"
                                        >
                                            Resend Code?
                                        </button>
                                    </div>
                                    <div className="relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                            <KeyRound size={15} />
                                        </div>
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-2.5 sm:text-sm bg-[#FCFCFA] border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#0077CC] focus:ring-1 focus:ring-[#0077CC] tracking-widest font-mono text-center transition-all"
                                            placeholder="000000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                            <Lock size={15} />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-10 py-2.5 sm:text-sm bg-[#FCFCFA] border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#0077CC] focus:ring-1 focus:ring-[#0077CC] transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <motion.button
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-[#0077CC] hover:bg-[#005FA3] transition-colors disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <CircleDashed size={14} className="animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-2">Verify & Reset <ArrowRight size={14} /></span>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}