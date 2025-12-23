import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const UpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useContext(AuthContext);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [materialsNeeded, setMaterialsNeeded] = useState('');
  const [errors, setErrors] = useState([]);

  // Load existing course data
  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setEstimatedTime(data.estimatedTime);
        setMaterialsNeeded(data.materialsNeeded);
      })
      .catch(() => {
        setErrors(['Failed to load course data']);
      });
  }, [id]);

  // Submit updated course
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedCourse = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' +
              btoa(
                `${authUser.credentials.emailAddress}:${authUser.credentials.password}`
              ),
          },
          body: JSON.stringify(updatedCourse),
        }
      );

      if (response.status === 204) {
        navigate(`/courses/${id}`);
      } else {
        const data = await response.json();
        setErrors(Array.isArray(data.errors) ? data.errors : ['Something went wrong']);
      }
    } catch {
      setErrors(['Something went wrong']);
    }
  };

  return (
    <main>
      <div className="wrap">
        <h2>Update Course</h2>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="validation--errors">
            <h3>Validation Errors</h3>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                name="courseTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <p>
                By {authUser ? `${authUser.firstName} ${authUser.lastName}` : ''}
              </p>

              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                value={materialsNeeded}
                onChange={(e) => setMaterialsNeeded(e.target.value)}
              />
            </div>
          </div>

          <button className="button" type="submit">
            Update Course
          </button>

          <button
            className="button button-secondary"
            type="button"
            onClick={() => navigate(`/courses/${id}`)}
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
};

export default UpdateCourse;
