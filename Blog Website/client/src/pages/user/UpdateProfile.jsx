import { useState } from "react";
import { motion } from "motion/react";
import api from "../../api/axios";
import { UPDATE_PROFILE_ROUTE } from "../../constants/route"
import { useLocation, useNavigate } from "react-router-dom";
import { User, Globe, CheckCircle2, Shield } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import AvatarUpload from "../../components/user/settings/AvatarUpload";
import SettingsSection from "../../components/user/settings/SettingsSection";
import userAuthStore from "../../store/authStore";
import Field from "../../components/common/Field";
import InputBar from "../../components/common/InputBar";
import { toast } from "react-toastify";

export default function UpdateProfile() {
    const [activeNav, setActiveNav] = useState("profile");
    const BIO_LIMIT = 500;

    const location = useLocation();
    const editable = location.pathname.includes("/profile/update");
    const navigate = useNavigate();

    const user = userAuthStore((state) => state.user);

    const [userName, setUserName] = useState(user?.name || "");
    const [userEmail, setUserEmail] = useState(user?.email || "");
    const [userBio, setUserBio] = useState(user?.bio || "");
    const [userInstagram, setUserInstagram] = useState(user?.instagram || "");
    const [userTwitter, setUserTwitter] = useState(user?.twitter || "");
    const [userLinkedIn, setUserLinkedIn] = useState(user?.linkedin || "");
    const [userGithub, setUserGithub] = useState(user?.github || "");
    const [profileImg, setprofileImg] = useState(user?.profileImg || "");
    const [userLocation, setUserLocation] = useState(user?.location || "");
    const [userBackgroundImg, setUserBackgroundImg] = useState(user?.backgroundImg || "");

    const [lastLoadedUserId, setLastLoadedUserId] = useState(user?.id || null);

    if (user && user.id !== lastLoadedUserId) {
        setUserName(user.name || "");
        setUserEmail(user.email || "");
        setUserBio(user.bio || "");
        setUserInstagram(user.instagram || "");
        setUserTwitter(user.twitter || "");
        setUserLinkedIn(user.linkedin || "");
        setUserGithub(user.github || "");
        setprofileImg(user.profileImg || "");
        setUserBackgroundImg(user.backgroundImg || "");
        setLastLoadedUserId(user.id);
        setUserLocation(user.location || "");
    }

    const charCount = userBio.length;

    const updateUserProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("name", userName);
            formData.append("email", userEmail);
            formData.append("bio", userBio);
            formData.append("instagram", userInstagram);
            formData.append("twitter", userTwitter);
            formData.append("linkedin", userLinkedIn);
            formData.append("github", userGithub);
            formData.append("profileImg", profileImg);
            formData.append("backgroundImg", userBackgroundImg);
            formData.append("location", userLocation);

            const { data } = await api.put(UPDATE_PROFILE_ROUTE, formData);
            toast.success(data.message || "Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while updating the profile.");
        }
    };

    const SOCIAL_LINKS = [
        { label: "GitHub", icon: FaGithub, value: userGithub, onChange: setUserGithub, placeholder: `https://github.com/${userName || "username"}` },
        { label: "Twitter", icon: FaTwitter, value: userTwitter, onChange: setUserTwitter, placeholder: `https://twitter.com/${userName || "username"}` },
        { label: "LinkedIn", icon: FaLinkedin, value: userLinkedIn, onChange: setUserLinkedIn, placeholder: `https://linkedin.com/in/${userName || "username"}` },
        { label: "Instagram", icon: Globe, value: userInstagram, onChange: setUserInstagram, placeholder: `https://instagram.com/${userName || "username"}` },
    ];

    const navItems = [
        { key: "profile", label: "Profile" },
        { key: "security", label: "Security" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50 mt-20"
        >

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex justify-center">


                <div className="flex w-full gap-8 xl:gap-12 justify-center items-start">


                    <div className="flex-1 w-full max-w-2xl space-y-5">


                        <SettingsSection
                            title="Profile information"
                            description="This is how your public profile will appear to other readers and writers."
                            delay={0.05}
                        >
                            <div className="space-y-6">

                                <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center items-center py-2">
                                    <div className="flex flex-col items-center text-center gap-1.5">
                                        <AvatarUpload profile={profileImg} setProfile={setprofileImg} editable={editable} />
                                        <span className="text-xs text-stone-400 font-medium">Profile Image</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1.5">
                                        <AvatarUpload profile={userBackgroundImg} setProfile={setUserBackgroundImg} editable={editable} />
                                        <span className="text-xs text-stone-400 font-medium">Header Banner</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Field label="Full name">
                                        <InputBar
                                            icon={User}
                                            type="text"
                                            value={userName}
                                            disabled={!editable}
                                            placeholder="Your full name"
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Email address">
                                        <InputBar
                                            type="email"
                                            value={userEmail}
                                            disabled={!editable}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            placeholder="you@example.com"
                                        />
                                    </Field>
                                </div>

                                <Field label="Bio" hint={`${charCount} / ${BIO_LIMIT}`}>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all resize-none leading-relaxed"
                                        rows={4}
                                        value={userBio}
                                        disabled={!editable}
                                        onChange={(e) => setUserBio(e.target.value)}
                                        placeholder="Tell readers a little about yourself…"
                                        maxLength={BIO_LIMIT}
                                    />
                                </Field>
                                <Field label="Location">
                                    <InputBar
                                        type="text"
                                        value={userLocation}
                                        disabled={!editable}
                                        onChange={(e) => setUserLocation(e.target.value)}
                                        placeholder="Your location"
                                    />
                                </Field>
                            </div>
                        </SettingsSection>

                        <SettingsSection
                            title="Social links"
                            description="Add links to your personal website and social profiles."
                            delay={0.1}
                        >
                            <div className="space-y-4">
                                {SOCIAL_LINKS.map((link, index) => (
                                    <Field key={index} label={link.label}>
                                        <InputBar
                                            icon={link.icon}
                                            type="text"
                                            value={link.value}
                                            disabled={!editable}
                                            onChange={(e) => link.onChange(e.target.value)}
                                            placeholder={link.placeholder}
                                        />
                                    </Field>
                                ))}
                            </div>
                        </SettingsSection>

                        <div className="flex items-center justify-between pt-2 pb-8">
                            <p className="text-xs text-stone-400">
                                Changes are saved to your public profile immediately.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={editable ? updateUserProfile : () => navigate("/profile/update")}
                                className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0077CC] hover:bg-[#005FA3] px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                            >
                                <CheckCircle2 size={14} />
                                {editable ? "Save changes" : "Edit Profile"}
                            </motion.button>
                        </div>

                    </div>

                </div>
            </div>
        </motion.div>
    );
}