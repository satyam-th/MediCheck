import styles from './Register.module.css'
import { useState } from 'react';
import toast from 'react-hot-toast';

import AuthLayout from "../../../components/layout/AuthLayout/AuthLayout";
import Button from '../../../components/ui/Button/Button';
import FormInput from '../../../components/ui/inputs/FormInput/FormInput';
import FormDivider from '../../../components/ui/FormDivider/FormDivider';

import { Link, useNavigate } from 'react-router-dom';
import { Rocket, CircleCheck, Users2 } from 'lucide-react';
import api from '../../../services/api';

export default function RegisterPharmacy() {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    address: '',
    city: '',
    state: '',
    licenseNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    primaryContact: '',
    alternateContact: '',
    openTime: '',
    closeTime: ''
  });

  const [errors, setErrors] = useState({
    pharmacyName: '',
    address: '',
    city: '',
    state: '',
    licenseNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    primaryContact: '',
    alternateContact: '',
    openTime: '',
    closeTime: ''
  });

  const navigate  = useNavigate();

  const features = [
    { icon: <Rocket size={18} style={{ color: "#F97316" }} />, text: "Quick and Easy onboarding" },
    { icon: <CircleCheck size={18} style={{ color: "#F97316" }} />, text: "Secure pharmacy verification" },
    { icon: <Users2 size={18} style={{ color: "#F97316" }} />, text: "Connect with patients instantly" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      pharmacyName: '',
      address: '',
      city: '',
      state: '',
      licenseNo: '',
      email: '',
      password: '',
      confirmPassword: '',
      primaryContact: '',
      alternateContact: '',
      openTime: '',
      closeTime: ''
    };

    // pharmacy name
    if (!formData.pharmacyName) {
      newErrors.pharmacyName = 'Pharmacy name is required';
      isValid = false;
    }

    // address
    if (!formData.address) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    // city
    if (!formData.city) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    // state
    if (!formData.state) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    // license number
    if (!formData.licenseNo) {
      newErrors.licenseNo = 'License number is required';
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

    // primary contact
    if (!formData.primaryContact) {
      newErrors.primaryContact = 'Primary contact is required';
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.primaryContact)) {
      newErrors.primaryContact = 'Please enter a valid contact number';
      isValid = false;
    }

    // alternate contact
    if (formData.alternateContact && !/^\+?[0-9]{10,15}$/.test(formData.alternateContact)) {
      newErrors.alternateContact = 'Please enter a valid contact number';
      isValid = false;
    }

    // opening time
    if (!formData.openTime) {
      newErrors.openTime = 'Opening time is required';
      isValid = false;
    }

    // closing time
    if (!formData.closeTime) {
      newErrors.closeTime = 'Closing time is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post('/auth/register/pharmacy/', {
        email: formData.email,
        password: formData.password,
        pharmacyName: formData.pharmacyName,
        address: formData.address,
        licenseNo: formData.licenseNo,
        primaryContact: formData.primaryContact,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
      });
      toast.success('Application submitted. Please wait for admin verification.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const msg = err.response?.data?.email?.[0]
        || err.response?.data?.message
        || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      tagline={<>Join MediCheck. <br />Be the pharmacy your community counts on.</>}
      subtext="Set up your pharmacy profile and start connecting patients to the right medicine, right nearby."
      features={features}
    >
      <div className={styles.welcomeContent}>
        <p className={styles.welcomeText}>Create your account</p>
        <p className={styles.welcomeSubtext}>Register your pharmacy and get started today</p>
      </div>

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <div className={styles.twoCol}>
          <FormInput
            label="Pharmacy name"
            type="text"
            id="pharmacyName"
            name="pharmacyName"
            placeholder="Chain Pharmacy"
            value={formData.pharmacyName}
            onChange={handleChange}
            error={errors.pharmacyName}
          />
          <FormInput
            label="Address"
            type="text"
            id="address"
            name="address"
            placeholder="Basundhara"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />
        </div>

        <div className={styles.twoCol}>
          <FormInput
            label="City"
            type="text"
            id="city"
            name="city"
            placeholder="Kathmandu"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
          />
          <FormInput
            label="State"
            type="text"
            id="state"
            name="state"
            placeholder="Bagmati"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
          />
        </div>

        <FormInput
          label="License number"
          type="text"
          id="licenseNo"
          name="licenseNo"
          placeholder="1234567"
          value={formData.licenseNo}
          onChange={handleChange}
          error={errors.licenseNo}
        />
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="pharmacy@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
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

        <div className={styles.twoCol}>
          <FormInput
            label="Primary Contact"
            type="text"
            id="primaryContact"
            name="primaryContact"
            placeholder="+9779876543210"
            value={formData.primaryContact}
            onChange={handleChange}
            error={errors.primaryContact}
          />
          <FormInput
            label="Alternate Contact"
            type="text"
            id="alternateContact"
            name="alternateContact"
            placeholder="+9779812345678"
            value={formData.alternateContact}
            onChange={handleChange}
            error={errors.alternateContact}
          />
        </div>

        <div className={styles.twoCol}>
          <FormInput
            label="Opening time"
            type="time"
            id="openTime"
            name="openTime"
            value={formData.openTime}
            onChange={handleChange}
            error={errors.openTime}
          />
          <FormInput
            label="Closing time"
            type="time"
            id="closeTime"
            name="closeTime"
            value={formData.closeTime}
            onChange={handleChange}
            error={errors.closeTime}
          />
        </div>

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