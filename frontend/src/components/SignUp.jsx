import React, { useState } from 'react';
import { signupStyles } from '../assets/dummyStyles';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, EyeOff, File, Lock, LogIn, LucideArrowBigUp, Mail, User } from 'lucide-react';
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const SignUp = ({ onSignupSuccess = null }) => {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState("");
    const [submitError, setSubmitError] = useState("");

    const API_URL = 'http://localhost:8000';
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('');
        const validation = validate();
        setErrors(validation);
        if (Object.keys(validation).length) return;

        setLoading(true);
        try {
            const payload = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            };
            const resp = await fetch(`${API_URL}/api/vi/auth/register`, {
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
                const msg = data?.message || 'Register Failed';
                setSubmitError(msg);
                return;
            }
            if (data?.token) {
                try {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem(
                        'currectUser',
                        JSON.stringify(data.user || {
                            name: name.trim(),
                            email: email.trim().toLowerCase(),
                        })
                    )
                } catch (errors) {
                    // ignore
                }
            }
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Register  error', err);
            setSubmitError('Network Error');
        }
        finally {
            setLoading(false);
        }

    }
    // email, password , name validation operation set
    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = "Name is reqiured";
        if (!email) e.email = "Email is required";
        else if (!isValidEmail(email)) e.email = "Please enter a valid email";
        if (!password) e.password = "Password is required";
        else if (password.length < 6)
            e.password = "Password must be  at latest 6 characters";
        return e;
    };
    return (
        <div className={signupStyles.pageContainer}>
            <Link to="/login" className={signupStyles.backButton}>
                <ArrowLeft className={signupStyles.backButtonIcon} />
                <span className={signupStyles.backButtonText}>Home</span>
            </Link>
            <div className={signupStyles.formContainer}>
                <form onSubmit={handleSubmit} className={signupStyles.form} noValidate>
                    <div className={signupStyles.formWrapper}>
                        <div className={signupStyles.animatedBorder}>
                            <div className={signupStyles.formContent}>
                                <h2 className={signupStyles.heading}>
                                    <span className={signupStyles.headingIcon}>
                                        <CheckCircle className={signupStyles.headingIconInner} />
                                    </span>
                                    <span className={signupStyles.headingText}>Create Account</span>
                                </h2>
                                <p className={signupStyles.subtitle}>
                                    Signup in to countinue to quiz light, Clear UI-smooth micro-animations and easy validations </p>
                                {/* name field */}
                                <label className={signupStyles.label}>
                                    <span className={signupStyles.labelText}>Name</span>
                                    <div className={signupStyles.inputContainer}>
                                        <span className={signupStyles.inputIcon}>
                                            <User className={signupStyles.inputIconInner} />
                                        </span>
                                        <input type="text" name="name" value={name} onChange={(e) => {
                                            setName(e.target.value);
                                            if (errors.name)
                                                setErrors((s) => ({
                                                    ...s, name: undefined
                                                }));

                                        }}
                                            className={`${signupStyles.input} ${errors.name ?
                                                signupStyles.inputError : signupStyles.inputNormal
                                                }`}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className={signupStyles.errorText}>{errors.name}</p>
                                    )}
                                </label>
                                {/* // Email Field */}
                                <label className={signupStyles.label}>
                                    <span className={signupStyles.labelText}>Email</span>
                                    <div className={signupStyles.inputContainer}>
                                        <span className={signupStyles.inputIcon}>
                                            <Mail className={signupStyles.inputIconInner} />
                                        </span>
                                        <input type="email" name="email" value={email} onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email)
                                                setErrors((s) => ({
                                                    ...s, email: undefined
                                                }));

                                        }}
                                            className={`${signupStyles.input} ${errors.email ?
                                                signupStyles.inputError : signupStyles.inputNormal
                                                }`}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className={signupStyles.errorText}>{errors.email}</p>
                                    )}
                                </label>
                                {/* passsword field */}
                                <label className={signupStyles.label}>
                                    <span className={signupStyles.labelText}>Password</span>
                                    <div className={signupStyles.inputContainer}>
                                        <span className={signupStyles.inputIcon}>
                                            <Lock className={signupStyles.inputIconInner} />
                                        </span>
                                        <input type="password" name="password" onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password)
                                                setErrors((s) => ({
                                                    ...s, password: undefined
                                                }));

                                        }}
                                            className={`${signupStyles.input} ${errors.passwordInput} ${errors.password
                                                ?
                                                signupStyles.inputError : signupStyles.inputNormal
                                                }`}
                                            placeholder="Create the password"
                                            required
                                        />
                                        {/* Toggle password visibility */}
                                        <button type="button" className={signupStyles.passwordToggle} onClick={() => setShowPassword((s) => !s)}>
                                            {showPassword ? (
                                                <EyeOff className={signupStyles.passwordToggleIcon} />
                                            ) : (
                                                <Eye className={signupStyles.passwordToggleIcon} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className={signupStyles.errorText}>{errors.password}</p>
                                    )}
                                </label>
                                {submitError && (
                                    <p className={signupStyles.submitError} role='alert'>{submitError}</p>
                                )}
                                <div className={signupStyles.buttonsContainer}>
                                    <button type='submit' className={signupStyles.submitButton} disabled={loading}>
                                        {loading ? 
                                            "Creating account....":"create Account" }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className={signupStyles.loginPromptContainer}>
                    <div className={signupStyles.loginPromptContent}>
                        <span className={signupStyles.loginPromptText}>
                            Already Have an account?
                        </span>
                        <Link to="/login" className={signupStyles.loginPromptLink}>
                        Login
                        </Link>
                    </div>

                </div>
            </div>
            <style className={signupStyles.animations}></style>

        </div>
    )
}

export default SignUp