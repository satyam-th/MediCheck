import styles from './Modal.module.css'

import { X } from 'lucide-react'

export default function Modal({isOpen, onClose, title, children}){
    if(!isOpen) return null
    return(
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.box} onClick={(e)=> e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={18}/></button>
                </div>

                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );

}