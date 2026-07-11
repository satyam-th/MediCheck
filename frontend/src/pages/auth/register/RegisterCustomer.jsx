import styles from './Register.module.css'
import { useState } from 'react';
import toast from 'react-hot-toast';

import AuthLayout from "../../../components/layout/AuthLayout/AuthLayout";
import Button from '../../../components/ui/Button/Button';
import FormInput from '../../../components/ui/inputs/FormInput/FormInput';
import FormDivider from '../../../components/ui/FormDivider/FormDivider';

import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock} from 'lucide-react';
import api from '../../../services/api';

export default function RegisterCustomer() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  });

  const navigate  = useNavigate();

  const features = [
    { icon: <Search size={18} style={{ color: "#F97316" }} />, text: "Search medicine across pharmacies" },
    { icon: <MapPin size={18} style={{ color: "#F97316" }} />, text: "Find pharmacies near you" },
    { icon: <Clock size={18} style={{ color: "#F97316" }} />, text: "Check real-time stock availability" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phone: ''
    };

    // first name
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    // last name
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    // username
    if (!formData.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    // email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // phone
    if (!formData.phone) {
      newErrors.phone = 'Phone Number is required';
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post('/auth/register/', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      });
      toast.success('Registration successful.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err.response?.data?.email?.[0]
        || err.response?.data?.username?.[0]
        || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      tagline={<>Medicine search,<br /> made simple.</>}
      subtext="Create your account and start finding medicines at pharmacies near you in seconds."
      features={features}
    >
      <div className={styles.welcomeContent}>
        <p className={styles.welcomeText}>Create your account</p>
        <p className={styles.welcomeSubtext}>Create an account and start finding medicines near you</p>
      </div>

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <div className={styles.twoCol}>
          <FormInput
            label="First name"
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Sita"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <FormInput
            label="Last name"
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Shrestha"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <FormInput
          label="Username"
          type="text"
          id="username"
          name="username"
          placeholder="Sita123"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />

        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="sita@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        
        <div className={styles.twoCol}>
        <FormInput
          label="Password"
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        </div>

        <FormInput
            label="Phone Number"
            type="text"
            id="phone"
            name="phone"
            placeholder="+9779876543210"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
        />

        <Button label="Create Account" type="submit" variant="primary" />
        <FormDivider text="or" />
        <p className={styles.switchAuth}>
          Already have an account?{' '}
          <Link to='/login'>Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}