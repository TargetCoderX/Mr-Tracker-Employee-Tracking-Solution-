import React, { useState } from 'react';
import Guest from '@/Layouts/GuestLayout';
import axios from 'axios';
import { router } from '@inertiajs/react';
function Login() {
    const [loginForm, setloginForm] = useState({ email: "", password: "" });
    const handleOnChange = async (e) => {
        const { name, value } = e.target;
        setloginForm({ ...loginForm, [name]: value });
    }
    const tryLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("api/login", loginForm);
            if (response.data.status === 1)
                router.visit('dashboard');
            else
                return;
        } catch (error) {

        }
    }

    return (
        <Guest>
            <h6 className="fw-light">Sign in to continue.</h6>
            <form className="pt-3" onSubmit={(e) => { tryLogin(e) }}>
                <div className="form-group">
                    <input value={loginForm.email} onChange={(e) => { handleOnChange(e) }} type="email" className="form-control form-control-lg" id="email" autoComplete='email' name='email' placeholder="Email" />
                </div>
                <div className="form-group">
                    <input value={loginForm.password} onChange={(e) => { handleOnChange(e) }} type="password" className="form-control form-control-lg" autoComplete='current-password' id="password" name='password' placeholder="Password" />
                </div>
                <div className="mt-3 d-grid gap-2">
                    <button type='submit' className="btn btn-block btn-primary btn-lg fw-medium auth-form-btn">SIGN IN</button>
                </div>
            </form>
        </Guest>
    );
}

export default Login;
