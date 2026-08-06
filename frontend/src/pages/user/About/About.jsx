import NavBar from '../../../components/layout/NavBar/NavBar';
import Footer from '../../../components/layout/Footer/Footer';
import styles from './About.module.css';

import { Sparkles, Target, Search, MapPin, PhoneCall, Users, HeartPulse, Store, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: <Search size={24} />,
    title: 'Search medicine',
    text: 'Type the name of any medicine and get instant matches with its generic name, manufacturer, and prescription status.',
  },
  {
    icon: <MapPin size={24} />,
    title: 'See availability',
    text: 'View which registered pharmacies nearby have it in stock — along with their address, contact number, and current price.',
  },
  {
    icon: <PhoneCall size={24} />,
    title: 'Visit or call',
    text: 'Check the stock level at each pharmacy, then head to the nearest one or call ahead to confirm before you go.',
  },
];

const audiences = [
  {
    icon: <HeartPulse size={24} />,
    title: 'For patients',
    text: 'Search any medicine, compare pharmacies, and check stock status before leaving home.',
  },
  {
    icon: <Store size={24} />,
    title: 'For pharmacies',
    text: 'Keep inventory up to date, manage batches and prices, track low stock, and record sales.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'For admins',
    text: 'Approve pharmacies and new medicines, moderate the global catalogue, and monitor the platform.',
  },
];

const team = [
  {
    initials: 'U',
    name: 'Ugesh KC',
    role: 'Research & Documentation',
    bio: 'Researched consumer needs and documented the features and changes required to satisfy them.',
  },
  {
    initials: 'SS',
    name: 'Samiksha Shrestha',
    role: 'UI/UX & Research',
    bio: 'Led user research and interface design, shaping how MediCheck looks and feels for patients and pharmacies alike.',
  },
  {
    initials: 'ST',
    name: 'Satyam Thapa',
    role: 'Backend & Database',
    bio: 'Built the Django REST API and database powering real-time medicine availability data.',
  },
];

export default function About() {
  return (
    <div className={styles.pageWrapper}>
      <NavBar />

      <main className={styles.contentContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <Sparkles size={14} /> About MediCheck
            </span>
            <h1 className={styles.heroTitle}>Medicine shouldn't be a guessing game.</h1>
            <p className={styles.heroSubtitle}>
              MediCheck is a web-based platform built to solve a real problem in Kathmandu: knowing which pharmacy near
              you actually has the medicine you need, right now — without calling ten shops first.
            </p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardRow}>
              <HeartPulse size={22} className={styles.heroCardIcon} />
              <div>
                <strong>Real-time availability</strong>
                <span>Live stock information from registered pharmacies</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionIntro}>
              <span className={styles.sectionLabel}>
                <Target size={14} /> Our mission
              </span>
              <h2 className={styles.sectionTitle}>Finding medicine should be easy.</h2>
            </div>
            <div className={styles.sectionText}>
              <p>
                Finding medicine in Kathmandu often means driving from pharmacy to pharmacy with no guarantee of
                availability. MediCheck changes that. Registered pharmacies keep their inventory updated on the
                platform, so anyone can search before they leave home.
              </p>
              <p>
                Our goal is to save time, reduce stress, and make healthcare access more transparent for everyone.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              <Search size={14} /> How it works
            </span>
            <h2 className={styles.sectionTitle}>Find your medicine in 3 simple steps</h2>
            <p className={styles.sectionSubtitle}>Search smart, save time.</p>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div key={step.title} className={styles.stepCard}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              <Users size={14} /> Who it's for
            </span>
            <h2 className={styles.sectionTitle}>One platform for everyone involved</h2>
            <p className={styles.sectionSubtitle}>MediCheck connects patients, pharmacies, and admins in a single system.</p>
          </div>

          <div className={styles.audienceGrid}>
            {audiences.map((audience) => (
              <div key={audience.title} className={styles.audienceCard}>
                <div className={styles.stepIcon}>{audience.icon}</div>
                <h3>{audience.title}</h3>
                <p>{audience.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              <Users size={14} /> Our team
            </span>
            <h2 className={styles.sectionTitle}>Built by a student team</h2>
            <p className={styles.sectionSubtitle}>
              Designed and developed as an academic project by a three-person team from Malpi International College
              under Pokhara University.
            </p>
          </div>

          <div className={styles.teamGrid}>
            {team.map((member) => (
              <div key={member.name} className={styles.teamCard}>
                <div className={styles.avatar}>{member.initials}</div>
                <h3>{member.name}</h3>
                <span className={styles.teamRole}>{member.role}</span>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className={styles.statItem}>
            <p className={styles.statValue}>One platform</p>
            <p className={styles.statLabel}>Search every registered pharmacy from a single place.</p>
          </div>
          <div className={styles.statItem}>
            <p className={styles.statValue}>Live stock</p>
            <p className={styles.statLabel}>Pharmacies keep their inventory up to date, so availability stays accurate.</p>
          </div>
          <div className={styles.statItem}>
            <p className={styles.statValue}>Made for Nepal</p>
            <p className={styles.statLabel}>Designed around how pharmacies and patients work here.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
