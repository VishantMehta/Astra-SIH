import { Outlet } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;