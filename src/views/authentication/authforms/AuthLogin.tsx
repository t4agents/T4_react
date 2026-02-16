import React from "react";

import { Link, useNavigate } from "react-router-dom";
import { Button } from 'src/components/ui/button';
import { Checkbox } from 'src/components/ui/checkbox';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "src/lib/firebase";

const AuthLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const token = await userCredential.user.getIdToken();
            // console.log("FIREBASE ID TOKEN:", token);

            localStorage.setItem("access_token", token);  // ✅ store
            navigate("/");
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        }
    };


    return (
        <>
            <form className="mt-6" onSubmit={handleLogin}>
                <div className="mb-4">
                    <div className="mb-2 block">
                        <Label htmlFor="Username">Username</Label>
                    </div>
                    <Input
                        id="username"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <div className="mb-2 block">
                        <Label htmlFor="userpwd">Password</Label>
                    </div>
                    <Input
                        id="userpwd"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex justify-between my-5">
                    <div className="flex items-center gap-2">
                        <Checkbox id="accept" className="checkbox" />
                        <Label
                            htmlFor="accept"
                            className="opacity-90 font-normal cursor-pointer"
                        >
                            Remeber this Device
                        </Label>
                    </div>
                    <Link to={"/"} className="text-primary text-sm font-medium">
                        Forgot Password ?
                    </Link>
                </div>

                <Button type="submit" className="w-full">
                    Sign in
                </Button>
            </form>
        </>
    );
};

export default AuthLogin;
