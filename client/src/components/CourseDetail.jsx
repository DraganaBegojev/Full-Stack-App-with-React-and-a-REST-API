import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import AuthContext from '../context/AuthContext';

// component to display detailed information about a specific course
const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useContext(AuthContext);

  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`
        );

        if (response.status === 404) {
          navigate('/notfound');
        } else if (response.status === 500) {
          navigate('/error');
        } else if (response.ok) {
          const data = await response.json();
          setCourse(data);
        } else {
          navigate('/error');
        }
      } catch {
        navigate('/error');
      }
    };

    fetchCourse();
  }, [id, navigate]);


  if (!course) return null;

  // Check if authenticated user owns the course
  const isCourseOwner =
    authUser && authUser.id === course.userId;

  // Delete course
  const handleDelete = async () => {
    if (!authUser) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this course?'
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${btoa(
              `${authUser.credentials.emailAddress}:${authUser.credentials.password}`
            )}`,
          },
        }
      );

      if (response.status === 204) {
        navigate('/');
      } else {
        throw new Error();
      }
    } catch {
      alert('Something went wrong while deleting the course.');
    }
  };

  return (
    <main>
      <div className="actions--bar">
        <div className="wrap">
          {isCourseOwner && (
            <>
              <Link
                className="button"
                to={`/courses/${id}/update`}
              >
                Update Course
              </Link>

              <button
                className="button"
                onClick={handleDelete}
              >
                Delete Course
              </button>
            </>
          )}

          <Link className="button button-secondary" to="/">
            Return to List
          </Link>
        </div>
      </div>

      <div className="wrap">
        <h2>Course Detail</h2>

        <div className="main--flex">
          <div>
            <h3 className="course--detail--title">Course</h3>
            <h4 className="course--name">{course.title}</h4>
            <p>
              By {course.User.firstName} {course.User.lastName}
            </p>

            <ReactMarkdown>{course.description}</ReactMarkdown>
          </div>

          <div>
            <h3 className="course--detail--title">
              Estimated Time
            </h3>
            <p>{course.estimatedTime}</p>

            <h3 className="course--detail--title">
              Materials Needed
            </h3>
            <ReactMarkdown>
              {course.materialsNeeded}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;

