import React from "react";
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import Navbar from "../../components/Navbar/Navbar";
import RecentBooks from "../Books/RecentBooks";


const Home = () => {
  return (
    <div className="flex h-screen">
      <Header />
      <Navbar />
      {/* <RecentBooks /> */}
      <Footer/>
    </div>
  );
};

export default Home;
