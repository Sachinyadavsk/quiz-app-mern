import React, { useState } from 'react'
import { loginStyles } from '../assets/dummyStyles'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, LogIn, Mail, Lock, EyeOff, Eye } from 'lucide-react';
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


const Login = ({ onLoginSuccess = null }) => {
    const navigate = useNavigate();
    const [password, SetPassword] = useState("");
    const [email, SetEmail] = useState("");
    const [showPassword, SetShowPassword] = useState("");
    const [errors, SetErrors] = useState("");
    const [loading, SetLoading] = useState("");
    const [submitError, SetSubmitError] = useState("");

    const API_URL = 'http://localhost:8000';
    const handleSubmit = async (e) => {
        e.preventDefault()
        SetSubmitError('');
        const validation = validate();
        SetErrors(validation);
        if (Object.keys(validation).length) return;

        SetLoading(true);
        try {
            const payload = { email: email.trim().toLowerCase(), password };
            const resp = await fetch(`${API_URL}/api/vi/auth/login`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            let data = null;
            try {
                data = await resp.json();
            } catch (e) {
                // igore
            }

            if (!resp.ok) {
                const msg = data?.message || 'Login Failed';
                SetSubmitError(msg);
                return;
            }
            if (data?.token) {
                try {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem(
                        'currectUser',
                        JSON.stringify(data.user || { email: payload.email })
                    )
                } catch (errors) {
                    // ignore
                }
            }
            const user = data.user || { email: payload.email };
            window.dispatchEvent(
                new CustomEvent("authChanged", { detail: { user } })
            );
            if (typeof onLoginSuccess === 'function') onLoginSuccess(user);
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Login  error', err);
            SetSubmitError('Network Error');
        }
        finally {
            SetLoading(false);
        }

    }

    // Email and password validation
    const validate = () => {
        const e = {};
        if (!email) e.email = "Email is required";
        else if (!isValidEmail(email)) e.email = "Email is invalid";
        if (!password) e.password = "Password is required";
        return e;
    };






    return (
        <div className={loginStyles.pageContainer}>
            <div className={loginStyles.bubble1}></div>
            <div className={loginStyles.bubble2}></div>
            <Link to="/" className={loginStyles.backButton}>
                <ArrowLeft className={loginStyles.backButtonIcon} />
                <span className={loginStyles.backButtonText}>Home</span>
            </Link>
            <div className={loginStyles.formContainer}>
                <form onSubmit={handleSubmit} className={loginStyles.form} noValidate>
                    <div className={loginStyles.formWrapper}>
                        <div className={loginStyles.animatedBorder}>
                            <div className={loginStyles.formContent}>
                                <h2 className={loginStyles.heading}>
                                    <span className={loginStyles.headingIcon}>
                                        <LogIn className={loginStyles.headingIconInner} />
                                    </span>
                                    <span className={loginStyles.headingText}>Login</span>
                                </h2>
                                <p className={loginStyles.subtitle}>
                                    sign in to countinue to quiz light, Clear UI-smooth micro-animations and easy validations </p>
                                {/* // Email Field */}
                                <label className={loginStyles.label}>
                                    <span className={loginStyles.labelText}>Email</span>
                                    <div className={loginStyles.inputContainer}>
                                        <span className={loginStyles.inputIcon}>
                                            <Mail className={loginStyles.inputIconInner} />
                                        </span>
                                        <input type="email" name="email" value={email} onChange={(e) => {
                                            SetEmail(e.target.value);
                                            if (errors.email)
                                                SetErrors((s) => ({
                                                    ...s, email: undefined
                                                }));

                                        }}
                                            className={`${loginStyles.input} ${errors.email ?
                                                loginStyles.inputError : loginStyles.inputNormal
                                                }`}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className={loginStyles.errorText}>{errors.email}</p>
                                    )}
                                </label>
                                {/* passsword field */}
                                <label className={loginStyles.label}>
                                    <span className={loginStyles.labelText}>Password</span>
                                    <div className={loginStyles.inputContainer}>
                                        <span className={loginStyles.inputIcon}>
                                            <Lock className={loginStyles.inputIconInner} />
                                        </span>
                                        <input type="text" name="password" onChange={(e) => {
                                            SetPassword(e.target.value);
                                            if (errors.password)
                                                SetErrors((s) => ({
                                                    ...s, password: undefined
                                                }));

                                        }}
                                            className={`${loginStyles.input} ${errors.passwordInput} ${errors.password
                                                ?
                                                loginStyles.inputError : loginStyles.inputNormal
                                                }`}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        {/* Toggle password visibility */}
                                        <button type="button" className={loginStyles.passwordToggle} onClick={() => SetShowPassword((s) => !s)}>
                                            {showPassword ? (
                                                <EyeOff className={loginStyles.passwordToggleIcon} />
                                            ) : (
                                                <Eye className={loginStyles.passwordToggleIcon} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className={loginStyles.errorText}>{errors.password}</p>
                                    )}
                                </label>
                                {submitError && (
                                    <p className={loginStyles.submitError}>
                                        {submitError}
                                    </p>
                                )}
                                <div className={loginStyles.buttonsContainer}>
                                    <button type='submit' className={loginStyles.submitButton} disabled={loading}>
                                        {loading ? (
                                            "signing in .."
                                        ) : (
                                            <>
                                                <LogIn className={loginStyles.submitButtonIcon} />
                                                <span className={loginStyles.submitButtonText}>
                                                    Sign In
                                                </span>
                                            </>
                                        )}
                                    </button>
                                    <div className={loginStyles.signupContainer}>
                                        <div className={loginStyles.signupContent}>
                                            <span className={loginStyles.signupText}>
                                                Dot' have an  account?
                                            </span>
                                            <Link to="/register" className={loginStyles.signupLink}>
                                                Create Account
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <style className={loginStyles.animations}></style>
        </div>
    )
}

export default Login
