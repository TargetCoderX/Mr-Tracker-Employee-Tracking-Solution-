import Guest from '@/Layouts/GuestLayout';
import { router } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Register() {
    const [registerForm, setregisterForm] = useState({ first_name: "", last_name: "", email: "", password: "", password_confirmation: "" });
    const [errors, seterrors] = useState({});
    const tryRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route("api.register"), registerForm);
            if (response.data.status == 1) {
                toast.success(response.data.message);
                setTimeout(() => router.visit('dashboard'), 3000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            /* Validation Error */
            if (error.response.status === 422) {
                seterrors({ ...error.response.data.errors });
            }
        }
    }
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setregisterForm({ ...registerForm, [name]: value });
    }
    return (
        <Guest>
            <h6 className="fw-light">Register New Account</h6>
            <form className="pt-3" onSubmit={(e) => { tryRegister(e) }}>
                <div className="form-group">
                    <input value={registerForm.first_name} onChange={(e) => { handleOnChange(e) }} type="text" className="form-control form-control-lg" id="firstName" name='first_name' placeholder="First Name" />
                    {errors.first_name && errors.first_name !== "" && (
                        <p className="text-danger"><strong>{errors.first_name[0] || ""}</strong></p>
                    )}
                </div>
                <div className="form-group">
                    <input value={registerForm.last_name} onChange={(e) => { handleOnChange(e) }} type="text" className="form-control form-control-lg" id="lastName" name='last_name' placeholder="Last Name" />
                    {errors.last_name && errors.last_name !== "" && (
                        <p className="text-danger"><strong>{errors.last_name[0] || ""}</strong></p>
                    )}
                </div>
                <div className="form-group">
                    <input value={registerForm.email} onChange={(e) => { handleOnChange(e) }} type="email" className="form-control form-control-lg" id="email" autoComplete='email' name='email' placeholder="Email" />
                    {errors.email && errors.email !== "" && (
                        <p className="text-danger"><strong>{errors.email[0] || ""}</strong></p>
                    )}
                </div>
                <div className="form-group">
                    <input value={registerForm.password} onChange={(e) => { handleOnChange(e) }} type="password" className="form-control form-control-lg" autoComplete='current-password' id="password" name='password' placeholder="Password" />
                    {errors.password && errors.password !== "" && (
                        <p className="text-danger"><strong>{errors.password[0] || ""}</strong></p>
                    )}
                </div>
                <div className="form-group">
                    <input value={registerForm.password_confirmation} onChange={(e) => { handleOnChange(e) }} type="text" className="form-control form-control-lg" id="password_confirmation" name='password_confirmation' placeholder="Confirm Password" />
                    {errors.password && errors.password !== "" && (
                        <p className="text-danger"><strong>{errors.password[1] || ""}</strong></p>
                    )}
                </div>
                <div className="mt-3 d-grid gap-2">
                    <button type='submit' className="btn btn-block btn-primary btn-lg fw-medium auth-form-btn">Next</button>
                </div>
            </form>
        </Guest>
    );
}

export default Register;
