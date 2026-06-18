import React from 'react';
import styles from './Working.module.css'
import {ArrowRight} from 'lucide-react'
export default function Working(){
    const works = [
        {number: "1", title: "Search medicine", description: "Type the medicine name in search bar" },
        {number: "2", title: "See pharmacies", description: "View which nearby pharmacies have it in stock" },
        {number: "3", title: "Visit or Call", description: "Go to the pharmacy or call ahead to confirm" },
    ];
    return(
        <div className={styles.mainContainer}>
            <div className={styles.headingContents}>
                <p className={styles.firstHeading}>HOW IT WORKS</p>
                <p className={styles.secondHeading}>Find your medicine in 3 steps</p>
                <p className={styles.thirdHeading}>Search smart, save time</p>
            </div>

            <div className={styles.workingCard}>
                {works.map((work, index)=>(
                <React.Fragment key={work.title}>
                    <div className={styles.workingContents}>
                        <div className={styles.number}>{work.number}</div>
                        <p className={styles.title}>{work.title}</p>
                        <p className={styles.description}>{work.description}</p>
                    </div>

                    {index < works.length - 1 && (
                        <div className={styles.icon}>
                            <ArrowRight size={40} strokeWidth={1.5} className={styles.arrowIcon}/>
                        </div>
                    )

                    }
                </React.Fragment>
                ))}
            </div>
        </div>
    );
}