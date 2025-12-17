const Header = () => {
  return (
    <header>
      <div className="wrap header--flex">
        <h1 className="header--logo">
          <a href="/">Courses</a>
        </h1>
        <nav>
          <ul className="header--signedout">
            <li>
              <a href="/sign-up">Sign Up</a>
            </li>
            <li>
              <a href="/sign-in">Sign In</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

