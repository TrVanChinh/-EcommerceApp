import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null)
  const updateUser = (newUser) => {
    setUser(newUser);
  };
  const updateProduct = (newProduct) => {
    setProduct(newProduct);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, product ,updateProduct}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};