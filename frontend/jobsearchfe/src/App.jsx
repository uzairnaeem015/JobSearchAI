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
      <Route path='/JobSearchAI/' element={<MainLayout />}>
        <Route index path='/JobSearchAI/home' element={<HomePage />} />
        <Route index path='/JobSearchAI/' element={<HomePage />} />
        <Route path='/JobSearchAI/jobScoreDetail' element={<JobsScoreDetailPage />} />
        <Route path='/JobSearchAI/about' element={<About />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};
export default App;
