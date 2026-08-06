import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Layout.css";

function MainLayout({children}){

    return(

        <div className="layout">

            <Sidebar/>

            <div className="main">

                <Navbar/>

                <div className="content">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default MainLayout;