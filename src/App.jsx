import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import UserLayout from './layouts/UserLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper">
        <CartDrawer />
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}