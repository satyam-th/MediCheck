import styles from './Greeting.module.css'

function getGreeting(hours){
    if(hours < 12) return "Good morning"
    if(hours < 17) return "Good afternoon"
    return "Good evening"
}
export default function Greeting({username='pharmacist'}){
    const now = new Date();
    const hours = now.getHours();

    const greetingText = getGreeting(hours);
    const formattedDate = now.toLocaleDateString('en-US',{
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });


    return(
        <div className={styles.container}>
            <h1 className={styles.greeting}>{greetingText}, {username}</h1>
            <p className={styles.date}>{formattedDate}</p>
        </div>
    );
}