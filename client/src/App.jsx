import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "./main";

const App = observer(() => {
  const { user } = useContext(Context);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        await user.check();
      }
      setIsAppLoading(false);
    };

    checkAuth();
  }, [user]);

  if (isAppLoading || user.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;