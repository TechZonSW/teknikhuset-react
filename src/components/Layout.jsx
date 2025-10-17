import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Här kommer sidans unika innehåll att renderas */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;