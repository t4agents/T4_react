import React from "react";

import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "src/lib/firebase";

const AuthRegister = () => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // optional: set display name
            await updateProfile(userCredential.user, {
                displayName: name,
            });

            const token = await userCredential.user.getIdToken();
            console.log("REGISTER TOKEN:", token);

            alert("User created. Token in console.");
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        }
    };


    return (
        <>
            <form className="mt-6" onSubmit={handleRegister}>
                <div className="mb-4">
                    <div className="mb-2 block">
                        <Label htmlFor="name" className="font-semibold">
                            Name
                        </Label>
                    </div>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <div className="mb-2 block">
                        <Label htmlFor="emadd" className="font-semibold">
                            Email Address
                        </Label>
                    </div>
                    <Input
                        id="emadd"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <div className="mb-2 block">
                        <Label htmlFor="userpwd" className="font-semibold">
                            Password
                        </Label>
                    </div>
                    <Input
                        id="userpwd"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full">
                    Sign Up
                </Button>
            </form>
        </>
    );
};

export default AuthRegister;