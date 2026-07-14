import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, CircleDashed, KeyRound, MailCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { SEND_VERIFY_OTP_ROUTE, VERIFY_EMAIL_ROUTE } from "../../constants/route";

export default function VerifyEmail() {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleTriggerOtp = async () => {
        setLoading(true);
        try {
            const {data} = await api.post(SEND_VERIFY_OTP_ROUTE);
            toast.success(data.message);
            setStep(2);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post(VERIFY_EMAIL_ROUTE, { otp });
            toast.success(data.message);
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Invalid or expired verification code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFCFA] flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-stone-900">
            <div className="mt-8 sm:mx-auto w-full max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white py-8 px-4 border border-stone-200 rounded-2xl shadow-sm sm:px-10"
                >
                    <div className="sm:mx-auto w-full mb-6 max-w-md px-4">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute left-0">
                                <button
                                    type="button"
                                    onClick={() => step === 2 ? setStep(1) : navigate("/")}
                                    className="inline-flex items-center justify-center p-2 rounded-xl text-stone-400 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-200"
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
                                <span className="font-serif font-extrabold italic text-2xl tracking-tight text-[#0077CC] block">
                                    The Daily Binge
                                </span>
                                <h2 className="mt-1 text-2xl font-serif font-normal tracking-tight text-stone-900">
                                    {step === 1 ? "Verify Your Account" : "Enter Security Code"}
                                </h2>
                            </motion.div>
                        </div>
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
                                    To access your reader account, we need to verify your email. Click the button below to send a secure verification code.
                                </p>

                                <motion.button
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleTriggerOtp}
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#0077CC] hover:bg-[#005FA3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077CC] transition-colors duration-200 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <CircleDashed size={14} className="animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">Send Verification Code <ArrowRight size={14} /></span>
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
                                            Verification Code
                                        </label>
                                        <div className="text-xs">
                                            <button 
                                                type="button" 
                                                onClick={handleTriggerOtp} 
                                                disabled={loading}
                                                className="font-medium text-[#005FA3] hover:text-stone-900 transition-colors disabled:opacity-50"
                                            >
                                                Resend Code?
                                            </button>
                                        </div>
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
                                    <p className="mt-2.5 text-xs text-stone-500 text-center">
                                        Please enter the 6-digit security code sent to your email.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <motion.button
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#0077CC] hover:bg-[#005FA3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077CC] transition-colors duration-200 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <CircleDashed size={14} className="animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-2">Verify & Continue <ArrowRight size={14} /></span>
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