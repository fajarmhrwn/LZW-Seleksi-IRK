import React, { createContext, useContext, useEffect, useState } from "react";

interface StateContextProps {
  currentUser: any;
  token: string | null;
  notification: string | null;
  setUser: (user: any) => void;
  setToken: (token: string | null,user:any |null) => void;
  setNotification: (notification: string | null) => void;
}

const StateContext = createContext<StateContextProps>({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {}
});

type MyComponentProps = {
    children: React.ReactNode;
  };
export const ContextProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [user, setUser] = useState<any>({});
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("ACCESS_TOKEN")
  );
  const [notification, setNotificationState] = useState<string | null>("");

  const setToken = (token: string | null,user:any) => {
    setTokenState(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("currentUser");
    }
  };

  const setNotification = (message: string | null) => {
    setNotificationState(message);

    setTimeout(() => {
      setNotificationState("");
    }, 5000);
  };

  useEffect(() => {
    // Check if user data exists in localStorage on component mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  });

  return (
    <StateContext.Provider
      value={{
        currentUser: user,
        setUser,
        token,
        setToken,
        notification,
        setNotification
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
