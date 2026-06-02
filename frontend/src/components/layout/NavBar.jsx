import { Link } from "react-router-dom";
export default function NavBar(){
    return(
       <>
        <nav className="mainNavContainer">
            <div className="logo">MediCheck</div>

            <div className="navlinks">
                <Link to='/'>Home</Link>
                <Link to='/about'>About</Link>
                <Link to='/pharmacies'>Pharmacies</Link>
                <input type="search" placeholder="Search medicine name, pharmacy name..." className="searchMed"/>
                <Link to='/login'>Login</Link>
                <Link to='/register'>Register</Link>
            </div>

        </nav>
       </>
    );
}