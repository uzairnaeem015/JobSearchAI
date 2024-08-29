import {
  Routes,
  Route,
  HashRouter,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JobsScoreDetailPage from './pages/JobsPage';
import About from './pages/About';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='home' element={<HomePage />} />
          <Route path='jobScoreDetail' element={<JobsScoreDetailPage />} />
          <Route path='about' element={<About />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
