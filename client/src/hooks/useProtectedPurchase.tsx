import { useAuth } from '../context/AuthContext';

export const useProtectedPurchase = () => {
  const { currentUser, showLoginPopup } = useAuth();

  /**
   * Call this function when a user attempts to make a purchase
   * Returns true if the user is authenticated and can proceed
   * Returns false if authentication is needed (and shows login popup)
   */
  const attemptPurchase = () => {
    if (!currentUser) {
      showLoginPopup('purchase');
      return false;
    }
    return true;
  };

  /**
   * Call this function when a user attempts to add to wishlist
   * Returns true if the user is authenticated and can proceed
   * Returns false if authentication is needed (and shows login popup)
   */
  const attemptWishlist = () => {
    if (!currentUser) {
      showLoginPopup('visit');
      return false;
    }
    return true;
  };

  /**
   * Call this function when a user attempts to access wardrobe
   * Returns true if the user is authenticated and can proceed
   * Returns false if authentication is needed (and shows login popup)
   */
  const attemptWardrobeAccess = () => {
    if (!currentUser) {
      showLoginPopup('visit');
      return false;
    }
    return true;
  };

  return {
    isAuthenticated: !!currentUser,
    attemptPurchase,
    attemptWishlist,
    attemptWardrobeAccess
  };
};

export default useProtectedPurchase;