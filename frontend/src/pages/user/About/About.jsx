import NavBar from '../../../components/layout/NavBar/NavBar';
import Footer from '../../../components/layout/Footer/Footer';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.pageWrapper}>
      <NavBar />

      <main className={styles.contentContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <p className={styles.overline}>About MediCheck</p>
            <h1 className={styles.title}>Medicine shouldn't be a guessing game.</h1>
            <p className={styles.subtitle}>
              MediCheck is a web-based application platform built to solve a real problem in Kathmandu: knowing which
              pharmacy near you actually has the medicine you need, right now — without calling ten shops first.
            </p>
          </div>
        </section>

        <section className={styles.infoSection}>
          <article className={styles.infoCard}>
            <h2>Our mission</h2>
            <p>
              Finding medicine in Kathmandu often means driving from pharmacy to pharmacy with no guarantee of
              availability. MediCheck changes that. Community members report stock, so anyone can search before they
              leave home. Our goal is to save time, reduce stress, and make healthcare access more transparent for
              everyone.
            </p>
          </article>

          <article className={styles.infoCard}>
            <h2>How it works</h2>
            <p>
              <strong>Search</strong> — Type the name of any medicine. MediCheck shows you which registered pharmacies
              nearby have it in stock.
            </p>
            <p>
              <strong>Locate</strong> — See pharmacy locations, contact details, and stock confidence at a glance.
              Pick the nearest one and go.
            </p>
            <p>
              <strong>Confirm</strong> — Found it? Didn't? Either way, leave a quick update. Your report helps the next
              person searching the same medicine.
            </p>
          </article>

          <article className={styles.infoCard}>
            <h2>Our team</h2>
            <p>
              MediCheck was designed and developed by a three-person team from Malpi International College as an
              academic project under Pokhara University — with a genuine belief that it can make a real difference.
            </p>
            <p>
              <strong>Ugesh</strong> — Researched, documented and suggested features and changes needed to satisfy the
              consumers.
            </p>
            <p>
              <strong>Samiksha Shrestha</strong> — UI/UX & Research. Led user research and interface design, shaping
              how MediCheck looks and feels for patients and pharmacies alike.
            </p>
            <p>
              <strong>Satyam Thapa</strong> — Backend & Database. Built the Django REST API and MySQL database powering
              medicine availability data.
            </p>
          </article>
        </section>

        <section className={styles.statsSection}>
          <div className={styles.statsCard}>
            <p className={styles.statsNumber}>Academic Project</p>
            <p className={styles.statsLabel}>
              Developed as part of the BCSIT Semester IV curriculum at Malpi International College under Pokhara
              University.
            </p>
          </div>
          <div className={styles.statsCard}> 
            <p className={styles.statsNumber}>Full Lifecycle</p>
            <p className={styles.statsLabel}>
              Represents ideation, UI prototyping, backend API development, database design, and academic defense.
            </p>
          </div>
          <div className={styles.statsCard}> 
            <p className={styles.statsNumber}>Community Focus</p>
            <p className={styles.statsLabel}>
              Built to solve a real local problem with software that helps people find medicine faster.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
