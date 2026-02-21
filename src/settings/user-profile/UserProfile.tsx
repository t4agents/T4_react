import { Icon } from "@iconify/react/dist/iconify.js"
import { useState, useEffect } from "react";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";
import CardBox from "src/components/shared/CardBox";
import profileImg from "src/assets/images/profile/user-1.jpg"
import { Button } from "src/components/ui/button";
import { userAPI } from "src/api/user/user-api";
import UserProfileModal from "./UserProfileModal";

const UserProfile = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<"personal" | "address" | null>(null);

    const defaultProfileImg = profileImg;
    const [currentProfileImg, setCurrentProfileImg] = useState(defaultProfileImg);

    const BCrumb = [
        {
            to: "/",
            title: "Home",
        },
        {
            title: "Userprofile",
        },
    ];

    const [personal, setPersonal] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        facebook: "",
        twitter: "",
        github: "",
        dribbble: ""
    });

    const [address, setAddress] = useState({
        location: "United States",
        state: "San Diego, California, United States",
        pin: "92101",
        zip: "30303",
        taxNo: "GA45273910"
    });

    const [tempPersonal, setTempPersonal] = useState(personal);
    const [tempAddress, setTempAddress] = useState(address);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await userAPI.getCurrentUser();
                console.log('----Fetched user:', user);
                setPersonal({
                    firstName: user.first_name || "",
                    lastName: user.last_name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    position: user.position || "",
                    facebook: user.facebook || "",
                    twitter: user.twitter || "",
                    github: user.github || "",
                    dribbble: user.dribbble || ""
                });
                if (user.profile_picture) {
                    setCurrentProfileImg(user.profile_picture);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (openModal && modalType === "personal") {
            setTempPersonal(personal);
        }
        if (openModal && modalType === "address") {
            setTempAddress(address);
        }
    }, [openModal, modalType, personal, address]);

    const handleSave = async () => {
        try {
            const updatedUser = await userAPI.updateUser({
                first_name: tempPersonal.firstName,
                last_name: tempPersonal.lastName,
                email: tempPersonal.email,
                phone: tempPersonal.phone,
                position: tempPersonal.position,
                facebook: tempPersonal.facebook,
                twitter: tempPersonal.twitter,
                github: tempPersonal.github,
                dribbble: tempPersonal.dribbble
            });
            setPersonal({
                firstName: updatedUser.first_name || "",
                lastName: updatedUser.last_name || "",
                email: updatedUser.email || "",
                phone: updatedUser.phone || "",
                position: updatedUser.position || "",
                facebook: updatedUser.facebook || "",
                twitter: updatedUser.twitter || "",
                github: updatedUser.github || "",
                dribbble: updatedUser.dribbble || ""
            });
            if (updatedUser.profile_picture) {
                setCurrentProfileImg(updatedUser.profile_picture);
            }
            setOpenModal(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const socialLinks = [
        { href: personal.facebook || "#", icon: "streamline-logos:facebook-logo-2-solid" },
        { href: personal.twitter || "#", icon: "streamline-logos:x-twitter-logo-solid" },
        { href: personal.github || "#", icon: "ion:logo-github" },
        { href: personal.dribbble || "#", icon: "streamline-flex:dribble-logo-remix" },
    ];

    return (
        <>
            <BreadcrumbComp title="User Profile" items={BCrumb} />
            <div className="flex flex-col gap-6">
                <CardBox className="p-6 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl relative w-full break-words">
                        <div>
                            <img src={currentProfileImg} alt="image" width={80} height={80} className="rounded-full" />
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center w-full">
                            <div className="flex flex-col sm:text-left text-center gap-1.5">
                                <h5 className="card-title">{personal.firstName || "Your"} {personal.lastName || "Name"}</h5>
                                <div className="flex flex-wrap items-center gap-1 md:gap-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{personal.position || "Your position"}</p>
                                    <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{address.location || "Your location"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {socialLinks.map((item, index) => (
                                    <a key={index} href={item.href} target="_blank" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full shadow-md border border-ld hover:bg-gray-50 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                        <Icon icon={item.icon} width="20" height="20" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardBox>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <CardBox className="p-6 overflow-hidden">
                        <h5 className="card-title mb-6">Personal Information</h5>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-7 2xl:gap-x-32 mb-6">
                            <div><p className="text-xs text-gray-500">First Name</p><p>{personal.firstName || "Your first name"}</p></div>
                            <div><p className="text-xs text-gray-500">Last Name</p><p>{personal.lastName || "Your last name"}</p></div>
                            <div><p className="text-xs text-gray-500">Email</p><p>{personal.email || "you@example.com"}</p></div>
                            <div><p className="text-xs text-gray-500">Phone</p><p>{personal.phone || "+1 (555) 123-4567"}</p></div>
                            <div><p className="text-xs text-gray-500">Position</p><p>{personal.position || "Your position"}</p></div>
                            <div><p className="text-xs text-gray-500">Location</p><p>{address.location || "Country"}</p></div>
                            <div><p className="text-xs text-gray-500">Province / State</p><p>{address.state || "Province or State"}</p></div>
                            <div><p className="text-xs text-gray-500">PIN Code</p><p>{address.pin || "Area or PIN code"}</p></div>
                            <div><p className="text-xs text-gray-500">Postal Code / ZIP</p><p>{address.zip || "A1A 1A1 or 12345"}</p></div>
                            <div><p className="text-xs text-gray-500">Tax No.</p><p>{address.taxNo || "Tax ID number"}</p></div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => { setModalType("personal"); setOpenModal(true); }} color={"primary"} className="flex items-center gap-1.5 rounded-md">
                                <Icon icon="ic:outline-edit" width="18" height="18" /> Edit
                            </Button>
                        </div>
                    </CardBox>

                    <CardBox className="p-6 overflow-hidden">
                        <h5 className="card-title mb-6">My Organization</h5>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-7 2xl:gap-x-32 mb-6">
                            <div><p className="text-xs text-gray-500">Organization Name</p><p>Tech Solutions Inc.</p></div>
                            <div><p className="text-xs text-gray-500">Department</p><p>Engineering</p></div>
                            <div><p className="text-xs text-gray-500">Phone</p><p>(555) 987-6543</p></div>
                            <div><p className="text-xs text-gray-500">Email</p><p>info@techsolutions.com</p></div>
                            <div><p className="text-xs text-gray-500">Address</p><p>123 Business Ave</p></div>
                            <div><p className="text-xs text-gray-500">City</p><p>San Francisco, CA</p></div>
                            <div><p className="text-xs text-gray-500">Province / State</p><p>California</p></div>
                            <div><p className="text-xs text-gray-500">PIN Code</p><p>94105</p></div>
                            <div><p className="text-xs text-gray-500">Postal Code</p><p>94105</p></div>
                        </div>
                        <div className="flex justify-end">
                            <Button disabled color={"primary"} className="flex items-center gap-1.5 rounded-md opacity-50 cursor-not-allowed">
                                <Icon icon="ic:outline-edit" width="18" height="18" /> Edit
                            </Button>
                        </div>
                    </CardBox>
                </div>
            </div>

            <UserProfileModal
                open={openModal}
                onOpenChange={setOpenModal}
                modalType={modalType}
                tempPersonal={tempPersonal}
                setTempPersonal={setTempPersonal}
                tempAddress={tempAddress}
                setTempAddress={setTempAddress}
                onSave={handleSave}
            />
        </>
    );
};

export default UserProfile;
