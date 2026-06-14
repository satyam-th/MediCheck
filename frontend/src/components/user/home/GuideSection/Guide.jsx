import styles from './Guide.module.css'

import { Circle } from 'lucide-react';
export default function Guide(){
    const guides = [
        {icon: <Circle fill='green' color="green" size={30}/>, title: "Available", description: "In stock and ready to purchase"},
        {icon: <Circle fill='yellow' color="yellow" size={30}/>, title: "Low Stock", description: "Available but running out soon"},
        {icon: <Circle fill='red' color="red" size={30}/>, title: "Out of stock", description: "Not available at this pharmacy"},
        {icon: <Circle fill='blue' color="blue" size={30}/>, title: "Call to confirm", description: "Contact the pharmacy to verify"}
    ];
    return(
        <>
        <div className={styles.mainContainer}>
            <div className={styles.headingContents}>
                <p className={styles.firstHeading}>AVAILABILITY GUIDE</p>
                <p className={styles.secondHeading}>What the status labels mean</p>
                <p className={styles.thirdHeading}>Every medicine shows each of these statuses</p>
            </div>
            
            <div className={styles.guideCard}>
                {guides.map((guide)=>(
                
                    <div className={styles.guideContents} key={guide.title}>
                        <div className={styles.icon}>{guide.icon}</div>
                        <p className={styles.title}>{guide.title}</p>
                        <p className={styles.description}>{guide.description}</p>
                    </div>
                
                ))}
            </div>
        </div>
        </>
    );
}