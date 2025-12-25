import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ValidationErrors from '../components/ValidationErrors';

// component to create a new course
const CreateCourse = () => {
  // Access authenticated user from context
  const { authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [materialsNeeded, setMaterialsNeeded] = useState('');

  // Validation errors
  const [errors, setErrors] = useState([]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure user is authenticated - temporary check
    if (!authUser) {
        setErrors(['You must be signed in to create a course.']);
        return;
    }

    // Course object sent to API
    const course = {
      userId: authUser.id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
    };

    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(
            `${authUser.credentials.emailAddress}:${authUser.credentials.password}`
          )}`,
        },
        body: JSON.stringify(course),
      });

      if (response.status === 201) {
        // Redirect to courses list after successful creation
        navigate('/');
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        navigate('/error');
      }
    } catch {
      navigate('/error');
    }
  };

  // Handle cancel
  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <main>
      <div className="wrap">
        <h2>Create Course</h2>
        <ValidationErrors errors={errors} />
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
                By {authUser ? `${authUser.firstName} ${authUser.lastName}` : 'Unknown Author'}
            </p>

              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
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
              ></textarea>
            </div>
          </div>

          <button className="button" type="submit">
            Create Course
          </button>
          <button
            className="button button-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
};

export default CreateCourse;
