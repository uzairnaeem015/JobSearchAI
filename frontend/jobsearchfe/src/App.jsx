import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JobsScoreDetailPage from './pages/JobsPage';
import About from './pages/About';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='/JobSearchAI' element={<HomePage />} />
        <Route path='/jobScoreDetail' element={<JobsScoreDetailPage />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};
export default App;
