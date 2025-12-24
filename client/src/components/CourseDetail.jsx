import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!course) return null;

  // delete course function

  const handleDelete = async () => {
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
            Authorization:
              'Basic ' +
              btoa(
                `${authUser.credentials.emailAddress}:${authUser.credentials.password}`
              ),
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
          <Link className="button" to={`/courses/${id}/update`}>
            Update Course
          </Link>
          {authUser && authUser.id === course.userId && (
            <button className="button" onClick={handleDelete}>
              Delete Course
            </button>
          )}

          <Link className="button button-secondary" to="/">
            Return to List
          </Link>
        </div>
      </div>

      <div className="wrap">
        <h2>Course Detail</h2>

        <form>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4>
              <p>
                By {course.User.firstName} {course.User.lastName}
              </p>

              <ReactMarkdown>
                {course.description}
              </ReactMarkdown>
            </div>

            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{course.estimatedTime}</p>

              <h3 className="course--detail--title">Materials Needed</h3>
              <ReactMarkdown>
                {course.materialsNeeded}
              </ReactMarkdown>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CourseDetail;
