import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ChatBot from "./components/layout/ChatBot";
import Welcome from "./components/Welcome";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wardrobe from "./pages/Wardrobe";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import NotFound from "@/pages/not-found";
import NewArrivals from "./pages/NewArrivals";
import Trending from "./pages/Trending";
import Sale from "./pages/Sale";
import Fits from '@/pages/Fits';
import Kicks from '@/pages/Kicks';
import Drips from '@/pages/Drips';
import All from '@/pages/All';
import ExploreCategories from "@/pages/ExploreCategories";
import MenSection from '@/pages/MenSection';
import WomenSection from '@/pages/WomenSection';
import Aboutus from '@/pages/About';
import Careers from '@/pages/Careers';
import Contact from '@/pages/Contact';
import CustomerService from '@/pages/CustomerService';
import FindaStore from '@/pages/FindaStore';
import Press from '@/pages/Press';
import SizeGuide from '@/pages/SizeGuide';
import Sustaninibility from '@/pages/Sustainibility';
import CustomerServicePage from '@/pages/CustomerService';
import ShippingPage from '@/pages/Shipping';
import PrivacyPolicyPage from '@/pages/PrivacyPolicy';
import TermsOfServicePage from '@/pages/TermsOfService';
import FAQsPage from '@/pages/FAQs';
import OrdersPage from "./pages/OrdersPage";
import AddressesPage from "./pages/AddressesPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPayment from "./pages/CheckoutPayment";
import CheckoutAddress from './pages/CheckoutAddress';
import OrderSuccess from '@/components/OrderSuccess';
import DripAssistant from './pages/DripAssistant';


// Import our new Auth components
import { AuthProvider } from './context/AuthContext';
import LoginPopup from './components/auth/LoginPopup';
import { useAuth } from './context/AuthContext';

// Firebase initialization (if not done elsewhere)
// import { initializeApp } from 'firebase/app';

import React from 'react';
import { BrowserRouter, Routes,} from 'react-router-dom';


// AppContent component that uses auth hooks
function AppContent() {
  const { isLoginPopupOpen, hideLoginPopup, loginPopupTrigger } = useAuth();

  return (
    <div className="min-h-screen dark">
      <Welcome />
      <Navbar />
      <main className="pt-[130px] md:pt-[120px]">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/category/fits" component={Fits} />
          <Route path="/category/kicks" component={Kicks} />
          <Route path="/category/drips" component={Drips} />
          <Route path="/category/all" component={All} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/wardrobe" component={Wardrobe} />
          <Route path="/admin" component={Admin} />
          <Route path="/search" component={Search} />
          <Route path="/new-arrivals" component={NewArrivals} />
          <Route path="/trending" component={Trending} />
          <Route path="/sale" component={Sale} />
          <Route path="/explore-categories" component={ExploreCategories} />
          <Route path="/category/mensection" component={MenSection} />
          <Route path="/category/womensection" component={WomenSection} />
          <Route path="/customer-service" component={CustomerService} />
          <Route path="/about-us" component={Aboutus} />
          <Route path="/careers" component={Careers} />
          <Route path="/contact" component={Contact} />
          <Route path="/customer-service/:category" component={CustomerServicePage} />
          <Route path="/find-a-store" component={FindaStore} />
          <Route path="/press" component={Press} />
          <Route path="/size-guide" component={SizeGuide} />
          <Route path="/sustainability" component={Sustaninibility} />
          <Route path="/shipping" component={ShippingPage} />
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/terms-of-service" component={TermsOfServicePage} />
          <Route path="/faqs" component={FAQsPage} />
          <Route path="/orders" component={OrdersPage} />
          <Route path="/addresses" component={AddressesPage} />
          <Route path="/payment-methods" component={PaymentMethodsPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/checkout-payment" component={CheckoutPayment} />
          <Route path="/checkout/address" component={CheckoutAddress} />
          <Route path="/order-success" component={OrderSuccess} />
          <Route path="/drip-assistant" component={DripAssistant} />
         

          {/* 👇 404 Page should be LAST */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ChatBot />
      <Toaster />

      {/* Add our new Login Popup component */}
      <LoginPopup 
        isOpen={isLoginPopupOpen} 
        onClose={hideLoginPopup}
        trigger={loginPopupTrigger}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter> 
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;