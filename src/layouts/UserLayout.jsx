import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {/* Header */}
      <Header />
      {/* Main content */}
      <main className="pt-[100px]">
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserLayout;
