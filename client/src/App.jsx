import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';

const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/sign-in" element={<UserSignIn />} />
      </Routes>
    </>
  );
};

export default App;


