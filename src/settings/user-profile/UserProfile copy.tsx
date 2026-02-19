import { Icon } from "@iconify/react/dist/iconify.js"
import { useState, useEffect } from "react";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";
import CardBox from "src/components/shared/CardBox";
import { Button } from "src/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { userAPI } from "src/api/user";
import { tenantAPI } from "src/api/user";

const UserProfile = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<"personal" | "organization" | null>(null);

    // user profile state
    const [personal, setPersonal] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        position: "",
        profile_picture: "",
        facebook: "",
        twitter: "",
        github: "",
        dribbble: ""
    });

    // tenant/organization state
    const [organization, setOrganization] = useState({
        name: "",
        organization_name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        province: "",
        postal_code: ""
    });

    const [tempPersonal, setTempPersonal] = useState(personal);
    const [tempOrganization, setTempOrganization] = useState(organization);
    const [loading, setLoading] = useState(true);
    const [profilePictureLoading, setProfilePictureLoading] = useState(false);

    const BCrumb = [
        {
            to: "/",
            title: "Home",
        },
        {
            title: "Userprofile",
        },
    ];

    // Generate random profile picture URL
    const getRandomProfilePicture = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    };

    // Load data on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userData = await userAPI.getCurrentUser();
                const tenantData = await tenantAPI.getCurrentTenant();

                setPersonal({
                    first_name: userData.first_name || "",
                    last_name: userData.last_name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    position: userData.position || "",
                    profile_picture: userData.profile_picture || getRandomProfilePicture(),
                    facebook: userData.facebook || "",
                    twitter: userData.twitter || "",
                    github: userData.github || "",
                    dribbble: userData.dribbble || ""
                });

                setOrganization({
                    name: tenantData.name || "",
                    organization_name: tenantData.organization_name || "",
                    phone: tenantData.phone || "",
                    email: tenantData.email || "",
                    address: tenantData.address || "",
                    city: tenantData.city || "",
                    province: tenantData.province || "",
                    postal_code: tenantData.postal_code || ""
                });
            } catch (err) {
                console.error("Failed to load data:", err);
                // Set default random profile picture if load fails
                setPersonal(prev => ({
                    ...prev,
                    profile_picture: getRandomProfilePicture()
                }));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (openModal && modalType === "personal") {
            setTempPersonal(personal);
        }
        if (openModal && modalType === "organization") {
            setTempOrganization(organization);
        }
    }, [openModal, modalType, personal, organization]);

    const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setProfilePictureLoading(true);
        try {
            const result = await userAPI.uploadProfilePicture(file);
            setPersonal(prev => ({
                ...prev,
                profile_picture: result.profile_picture
            }));
        } catch (err) {
            console.error("Failed to upload profile picture:", err);
            alert("Failed to upload profile picture");
        } finally {
            setProfilePictureLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (modalType === "personal") {
                await userAPI.updateUser(tempPersonal);
                setPersonal(tempPersonal);
            } else if (modalType === "organization") {
                await tenantAPI.updateTenant(tempOrganization);
                setOrganization(tempOrganization);
            }
            setOpenModal(false);
        } catch (err) {
            console.error("Failed to save:", err);
            alert("Failed to save changes");
        }
    };

    const socialLinks = [
        { href: "https://www.facebook.com/wrappixel", icon: "streamline-logos:facebook-logo-2-solid" },
        { href: "https://twitter.com/wrappixel", icon: "streamline-logos:x-twitter-logo-solid" },
        { href: "https://github.com/wrappixel", icon: "ion:logo-github" },
        { href: "https://dribbble.com/wrappixel", icon: "streamline-flex:dribble-logo-remix" },
    ];

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    return (
        <>
            <BreadcrumbComp title="User Profile" items={BCrumb} />
            <div className="flex flex-col gap-6">
                <CardBox className="p-6 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl relative w-full break-words">
                        <div className="relative group">
                            <img 
                                src={personal.profile_picture} 
                                alt="profile" 
                                width={80} 
                                height={80} 
                                className="rounded-full" 
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                                <Icon icon="solar:camera-outline" width="24" height="24" className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureUpload}
                                    disabled={profilePictureLoading}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center w-full">
                            <div className="flex flex-col sm:text-left text-center gap-1.5">
                                <h5 className="card-title">{personal.first_name} {personal.last_name}</h5>
                                <div className="flex flex-wrap items-center gap-1 md:gap-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{personal.position}</p>
                                    <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{organization.city}, {organization.province}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {socialLinks.map((item, index) => (
                                    <a key={index} href={item.href} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full shadow-md border border-ld hover:bg-gray-50 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
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
                            <div><p className="text-xs text-gray-500">First Name</p><p>{personal.first_name}</p></div>
                            <div><p className="text-xs text-gray-500">Last Name</p><p>{personal.last_name}</p></div>
                            <div><p className="text-xs text-gray-500">Email</p><p>{personal.email}</p></div>
                            <div><p className="text-xs text-gray-500">Phone</p><p>{personal.phone}</p></div>
                            <div><p className="text-xs text-gray-500">Position</p><p>{personal.position}</p></div>
                            <div><p className="text-xs text-gray-500">Facebook</p><p className="text-xs truncate">{personal.facebook || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">Twitter</p><p className="text-xs truncate">{personal.twitter || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">GitHub</p><p className="text-xs truncate">{personal.github || "-"}</p></div>
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
                            <div><p className="text-xs text-gray-500">Organization Name</p><p>{organization.organization_name || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">Name</p><p>{organization.name || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">Phone</p><p>{organization.phone || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">Email</p><p>{organization.email || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">Address</p><p>{organization.address || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">City</p><p>{organization.city || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">Province</p><p>{organization.province || "-"}</p></div>
                            <div><p className="text-xs text-gray-500">Postal Code</p><p>{organization.postal_code || "-"}</p></div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => { setModalType("organization"); setOpenModal(true); }} color={"primary"} className="flex items-center gap-1.5 rounded-md">
                                <Icon icon="ic:outline-edit" width="18" height="18" /> Edit
                            </Button>
                        </div>
                    </CardBox>
                </div>
            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="mb-4">
                            {modalType === "personal" ? "Edit Personal Information" : "Edit Organization"}
                        </DialogTitle>
                    </DialogHeader>

                    {modalType === "personal" ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="First Name"
                                    value={tempPersonal.first_name}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, first_name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Last Name"
                                    value={tempPersonal.last_name}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, last_name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="Email"
                                    value={tempPersonal.email}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, email: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    placeholder="Phone"
                                    value={tempPersonal.phone}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    placeholder="Position"
                                    value={tempPersonal.position}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, position: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="facebook">Facebook URL</Label>
                                <Input
                                    id="facebook"
                                    placeholder="Facebook URL"
                                    value={tempPersonal.facebook}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, facebook: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="twitter">Twitter URL</Label>
                                <Input
                                    id="twitter"
                                    placeholder="Twitter URL"
                                    value={tempPersonal.twitter}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, twitter: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="github">GitHub URL</Label>
                                <Input
                                    id="github"
                                    placeholder="GitHub URL"
                                    value={tempPersonal.github}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, github: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="dribbble">Dribbble URL</Label>
                                <Input
                                    id="dribbble"
                                    placeholder="Dribbble URL"
                                    value={tempPersonal.dribbble}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, dribbble: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="orgName">Organization Name</Label>
                                <Input
                                    id="orgName"
                                    placeholder="Organization Name"
                                    value={tempOrganization.organization_name}
                                    onChange={(e) => setTempOrganization({ ...tempOrganization, organization_name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Name"
                                    value={tempOrganization.name}
                                    onChange={(e) => setTempOrganization({ ...tempOrganization, name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="orgPhone">Phone</Label>
                                <Input
                                    id="orgPhone"
                                    placeholder="Phone"
                                    value={tempOrganization.phone}
                                    onChange={(e) => setTempOrganization({ ...tempOrganization, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="orgEmail">Email</Label>
                                <Input
                                    id="orgEmail"
                                    placeholder="Email"
                                    value={tempOrganization.email}
                                    onChange={(e) => setTempOrganization({ ...tempOrganization, email: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2 lg:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Address"
                                    value={tempOrganization.address}
                                    onChange={(e) => setTempOrganization({ ...tempOrganization, address: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    placeholder="City"
                                    value={tempOrganization.city}
                                    onChange={(e) => setTempOrganization({ ...tempOrganization, city: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="province">Province</Label>
                                <Input
                                    id="province"
                                    placeholder="Province"
                                    value={tempOrganization.province}
                                    onChange={(e) => setTempOrganization({ ...tempOrganization, province: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    placeholder="Postal Code"
                                    value={tempOrganization.postal_code}
                                    onChange={(e) => setTempOrganization({ ...tempOrganization, postal_code: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2 mt-4">
                        <Button color={"primary"} className="rounded-md" onClick={handleSave}>
                            Save Changes
                        </Button>
                        <Button color={"lighterror"} className="rounded-md bg-lighterror dark:bg-darkerror text-error hover:bg-error hover:text-white" onClick={() => setOpenModal(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserProfile;
