export const saveWalletIdToLocalStorage = (walletId) => {
    localStorage.setItem('walletId', walletId);
  };
  
  export const getWalletIdFromLocalStorage = () => {
    return localStorage.getItem('walletId');
  };
  