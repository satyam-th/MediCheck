import NavBar from "../../../components/layout/NavBar/NavBar";
import Footer from '../../../components/layout/Footer/Footer';
import HeroSection from '../../../components/user/home/HeroSection/HeroSection';
import QuickFeatures from "../../../components/user/home/QuickFeaturesSection/QuickFeatures";

import styles from '../Home/Home.module.css'
export default function Home(){
    return(
        <>
        <div className={styles.appWrapper}>
            <NavBar/>
            <main className={styles.pageContent}>
                <HeroSection/>
                <QuickFeatures/>
            </main>
            <Footer/>
        </div>
        
        </>
    );
}