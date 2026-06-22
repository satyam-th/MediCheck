import styles from './Login.module.css'
import { useState } from 'react';

import AuthLayout from "../../../components/layout/AuthLayout/AuthLayout";
import Button from '../../../components/ui/Button/Button';
import FormInput from '../../../components/ui/inputs/FormInput/FormInput';
import FormDivider from '../../../components/ui/FormDivider/FormDivider';

import { Link } from 'react-router-dom';

import { ShieldCheck, ShoppingCart, MapPin } from 'lucide-react';

export default function Login(){
    const [formData, setFormData] = useState({email: '', password: '', rememberMe: false});
    const [errors, setErrors] = useState({email: '', password: ''});

    const features = [
                        { icon: <ShieldCheck size={18} style={{color:"#F97316"}} />, text: "Secure role-based access" },
                        { icon: <ShoppingCart size={18} style={{color:"#F97316"}} />, text: "Inventory Management" },
                        { icon: <MapPin size={18} style={{color:"#F97316"}} />, text: "Right medicine, right nearby" },
                    ];
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

        // clears the error for that field as user starts typing
        setErrors((prev) => ({...prev, [name]: ''}));
    };
    
    const validate = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!formData.email) {
          newErrors.email = 'Email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
          isValid = false;
        }

        if (!formData.password) {
          newErrors.password = 'Password is required';
          isValid = false;
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
          isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validate()) return; // stops here if validation fails

      console.log(formData);
    };
    return (
        <AuthLayout tagline="Behind every prescription, there's a team making it happen." subtext="Your medicheck platform for efficient pharmacy operation and administrative control." features={features}>
            {/*login form*/}

            <div className={styles.welcomeContent}>
                    <p className={styles.welcomeText}>Welcome back</p>
                    <p className={styles.welcomeSubtext}>Log in to your MediCheck account</p>
            </div>

            <form className={styles.loginForm} onSubmit={handleSubmit}>
                
                <FormInput label="Email" type="email" id="email" name="email" placeholder="example@gmail.com" error={errors.email}
                value={formData.email} 
                onChange={handleChange}
                />
                <FormInput label="Password" type="password" id="password" name="password" placeholder="Enter your password" error={errors.password}
                value={formData.password} onChange={handleChange}
                />

                <div className={styles.remembermeBox}>
                    <input type="checkbox" id='rememberme' name='rememberMe' 
                    checked={formData.rememberMe} 
                    onChange={handleChange} 
                    />
                    <label htmlFor="rememberme">Remember me</label>
                </div>

                <Button label="Log In" type="submit" variant="primary" />

                <FormDivider text="or" />

                <p className={styles.switchAuth}>Don't have an account? <Link to='/register/customer'>Create a customer account</Link></p>
            </form>
        </AuthLayout>
);
}
