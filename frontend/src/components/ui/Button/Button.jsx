import styles from './Button.module.css'

export default function Button({type='button', label, variant='primary', onClick,}){
    return(
    <button type={type} className={styles[variant]} onClick={onClick}>
      {label}
    </button>
    );
}