import styles from './WhyMedicheck.module.css'

import {Clock, Zap, MapPin, Layers} from 'lucide-react';
export default function WhyMedicheck(){
    const whyMedichecks = [
        {icon: <Clock size={30}/>, title: "No more wasted trips", description: "Know before you go, check availability from home"},
        {icon: <Layers size={30}/>, title: "One platform many pharmacies", description: "No need to call each pharmacies separately"},
        {icon: <Zap size={30}/>, title: "Fast during emergencies", description: "Critical when you need medicine urgently"},
        {icon: <MapPin size={30}/>, title: "Made for Nepal", description: "Designed around how pharmacies work here"}
    ];
    return(
        <>
            <div className={styles.mainContainer}>
                <div className={styles.headingContents}>
                    <p className={styles.firstHeading}>WHY MEDICHECK</p>
                    <p className={styles.secondHeading}>Save time, find medicine faster</p>
                    <p className={styles.thirdHeading}>Built for people who need medicine quickly</p>
                </div>

                <div className={styles.whyMedicheckCard}>
                    {whyMedichecks.map((whyMedicheck) => (

                        <div className={styles.whyMedicheckContents} key={whyMedicheck.title}>
                            <div className={styles.icon}>{whyMedicheck.icon}</div>
                            <div className={styles.contents}>
                                <p className={styles.title}>{whyMedicheck.title}</p>
                                <p className={styles.description}>{whyMedicheck.description}</p>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </>
    );
}