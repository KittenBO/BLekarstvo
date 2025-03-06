import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Context } from "./main";

const App = observer(() => {
  const { user } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
        user.check()
    }
}, [])

  if (user.IsLoading) {
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
