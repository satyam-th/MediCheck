import {Search, Menu, X} from 'lucide-react';

import styles from './SearchBar.module.css'

export default function SearchBar({size = "small", className=''}){

    function handleSearch(e){
        e.preventDefault();
    }
    return(
        <form className={`${styles.searchWrapper} ${styles[size]} ${className}`} onSubmit={handleSearch}>
            <Search className={styles.searchIcon} />
            <input type="search" placeholder="Search medicine name, pharmacy name..." className={styles.searchMed}/>
        </form>
    );    
}