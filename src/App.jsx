import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/MyNavbar';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import ContentUploadPage from './pages/ContentUploadPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/admin/content-upload" element={<ContentUploadPage />} />
      </Routes>
    </BrowserRouter>
  );
}