import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";

type PersonalState = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    facebook: string;
    twitter: string;
    github: string;
    dribbble: string;
};

type AddressState = {
    location: string;
    state: string;
    pin: string;
    zip: string;
    taxNo: string;
};

type UserProfileModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    modalType: "personal" | "address" | null;
    tempPersonal: PersonalState;
    setTempPersonal: React.Dispatch<React.SetStateAction<PersonalState>>;
    tempAddress: AddressState;
    setTempAddress: React.Dispatch<React.SetStateAction<AddressState>>;
    onSave: () => void;
};

const UserProfileModal = ({
    open,
    onOpenChange,
    modalType,
    tempPersonal,
    setTempPersonal,
    tempAddress,
    setTempAddress,
    onSave,
}: UserProfileModalProps) => {
    if (modalType !== "personal") {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="mb-4">Edit Personal Information</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <Label htmlFor="firstName" className="w-32 text-sm text-gray-600">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            placeholder="Your first name"
                            value={tempPersonal.firstName}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, firstName: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="lastName" className="w-32 text-sm text-gray-600">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            placeholder="Your last name"
                            value={tempPersonal.lastName}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, lastName: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="email" className="w-32 text-sm text-gray-600">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="you@example.com"
                            value={tempPersonal.email}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, email: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="phone" className="w-32 text-sm text-gray-600">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            placeholder="+1 (555) 123-4567"
                            value={tempPersonal.phone}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, phone: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="position" className="w-32 text-sm text-gray-600">
                            Position
                        </Label>
                        <Input
                            id="position"
                            placeholder="Your position"
                            value={tempPersonal.position}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, position: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="facebook" className="w-32 text-sm text-gray-600">
                            Facebook
                        </Label>
                        <Input
                            id="facebook"
                            placeholder="facebook.com/username"
                            value={tempPersonal.facebook}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, facebook: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="twitter" className="w-32 text-sm text-gray-600">
                            Twitter
                        </Label>
                        <Input
                            id="twitter"
                            placeholder="x.com/username"
                            value={tempPersonal.twitter}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, twitter: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="github" className="w-32 text-sm text-gray-600">
                            GitHub
                        </Label>
                        <Input
                            id="github"
                            placeholder="github.com/username"
                            value={tempPersonal.github}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, github: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="dribbble" className="w-32 text-sm text-gray-600">
                            Dribbble
                        </Label>
                        <Input
                            id="dribbble"
                            placeholder="dribbble.com/username"
                            value={tempPersonal.dribbble}
                            onChange={(e) => setTempPersonal({ ...tempPersonal, dribbble: e.target.value })}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <h6 className="font-semibold text-sm mt-4 mb-2">Address Information</h6>
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="location" className="w-32 text-sm text-gray-600">
                            Location
                        </Label>
                        <Input
                            id="location"
                            placeholder="Country"
                            value={tempAddress.location}
                            onChange={(e) => setTempAddress({ ...tempAddress, location: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="state" className="w-32 text-sm text-gray-600">
                            Province/State
                        </Label>
                        <Input
                            id="state"
                            placeholder="Province or State"
                            value={tempAddress.state}
                            onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="pin" className="w-32 text-sm text-gray-600">
                            PIN Code
                        </Label>
                        <Input
                            id="pin"
                            placeholder="Area or PIN code"
                            value={tempAddress.pin}
                            onChange={(e) => setTempAddress({ ...tempAddress, pin: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="zip" className="w-40 text-sm text-gray-600 whitespace-nowrap">
                            Postal Code / ZIP
                        </Label>
                        <Input
                            id="zip"
                            placeholder="A1A 1A1 or 12345"
                            value={tempAddress.zip}
                            onChange={(e) => setTempAddress({ ...tempAddress, zip: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="taxNo" className="w-32 text-sm text-gray-600">
                            Tax No.
                        </Label>
                        <Input
                            id="taxNo"
                            placeholder="Tax ID number"
                            value={tempAddress.taxNo}
                            onChange={(e) => setTempAddress({ ...tempAddress, taxNo: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-2 mt-4">
                    <Button color={"primary"} className="rounded-md" onClick={onSave}>
                        Save Changes
                    </Button>
                    <Button
                        color={"lighterror"}
                        className="rounded-md bg-lighterror dark:bg-darkerror text-error hover:bg-error hover:text-white"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserProfileModal;
