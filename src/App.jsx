import { Routes, Route, useNavigate } from 'react-router-dom';
import Design from "./design";
import Programming from "./programming";
import Writing from "./writing";
import VideoEditing from "./videoediting";
import { useState } from "react";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  

  // Keep login/register state after refresh.
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser
      ? JSON.parse(savedUser)
      : { name: "", email: "", rollNo: "" };
  });

  const [loginMode, setLoginMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const handleMenu = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  // Get all registered demo users from localStorage.
  const getUsers = () => {
    const users = localStorage.getItem("aptosUsers");
    return users ? JSON.parse(users) : [];
  };

  // Save all registered demo users.
  const saveUsers = (users) => {
    localStorage.setItem("aptosUsers", JSON.stringify(users));
  };

  // Chitkara University email: anything before @ is allowed,
  // but the domain must be exactly @chitkara.edu.in.
  // Example: navreet0994.becse25@chitkara.edu.in
  const isUniversityEmail = (email) =>
    /^[^\s@]+@chitkara\.edu\.in$/i.test(email);

  // Roll number must contain exactly 10 digits.
  const isValidRollNo = (rollNo) => /^\d{10}$/.test(rollNo);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");

    const form = e.target;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    if (!isUniversityEmail(email)) {
      setAuthError(
        "Please use a valid Chitkara University email ending with @chitkara.edu.in."
      );
      return;
    }

    const users = getUsers();
    const foundUser = users.find(
      (item) => item.email.toLowerCase() === email
    );

    if (!foundUser) {
      setAuthError("No account found with this email. Please create an account first.");
      return;
    }

    if (foundUser.password !== password) {
      setAuthError("Incorrect password. Please try again.");
      return;
    }

    const loggedUser = {
      name: foundUser.name,
      email: foundUser.email,
      rollNo: foundUser.rollNo,
    };

    setUser(loggedUser);
    setLoggedIn(true);

    localStorage.setItem("currentUser", JSON.stringify(loggedUser));
    localStorage.setItem("loggedIn", "true");

    if (form.remember.checked) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const rollNo = form.rollNo.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (!isUniversityEmail(email)) {
      setAuthError(
        "Please use a valid Chitkara University email ending with @chitkara.edu.in."
      );
      return;
    }

    if (!isValidRollNo(rollNo)) {
      setAuthError("Roll number must contain exactly 10 digits.");
      return;
    }

    const users = getUsers();

    const alreadyRegistered = users.some(
      (item) =>
        item.email.toLowerCase() === email ||
        item.rollNo.toLowerCase() === rollNo.toLowerCase()
    );

    if (alreadyRegistered) {
      setAuthError(
        "This email or roll number is already registered. Please sign in instead."
      );
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    const newUser = {
      name,
      email,
      rollNo,
      password,
    };

    saveUsers([...users, newUser]);

    // Automatically log the newly registered user in.
    const loggedUser = { name, email, rollNo };
    setUser(loggedUser);
    setLoggedIn(true);

    localStorage.setItem("currentUser", JSON.stringify(loggedUser));
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("rollNo", rollNo);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");

    const form = e.target;
    const email = form.email.value.trim().toLowerCase();
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (!isUniversityEmail(email)) {
      setAuthError(
        "Please enter a valid Chitkara University email ending with @chitkara.edu.in."
      );
      return;
    }

    if (newPassword.length < 6) {
      setAuthError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    const users = getUsers();
    const userIndex = users.findIndex(
      (item) => item.email.toLowerCase() === email
    );

    if (userIndex === -1) {
      setAuthError("No account found with this email.");
      return;
    }

    users[userIndex].password = newPassword;
    saveUsers(users);

    setLoginMode("login");
    setAuthMessage("Password reset successful. You can now sign in with your new password.");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    setLoggedIn(false);
    setUser({ name: "", email: "", rollNo: "" });
    setLoginMode("login");
    setAuthError("");
    setAuthMessage("");
  };

  // Category pages.
  if (loggedIn && window.location.pathname === "/design") {
    return <Design />;
  }
  if (loggedIn && window.location.pathname === "/programming") {
    return <Programming />;
  }
  if (loggedIn && window.location.pathname === "/writing") {
    return <Writing />;
  }
  if (loggedIn && window.location.pathname === "/videoediting") {
    return <VideoEditing />;
  }

  /* =========================
     LOGIN / REGISTER PAGE
  ========================= */

  if (!loggedIn) {
    const rememberedEmail =
      localStorage.getItem("rememberedEmail") || "";

    return (
      <div className="login-page">

        <div className="login-left">
          <div className="login-left-overlay"></div>

          <div className="login-brand">
            <span className="brand-mark">△</span>
            <span>APTOS</span>
          </div>

          <div className="login-hero-text">
            <span className="login-kicker">
              A COMMUNITY. INFINITE POSSIBILITIES.
            </span>

            <h1>
              Exchange skills.
              <br />
              Earn credits.
              <br />
              <em>Grow together.</em>
            </h1>

            <p>
              Connect with university students, share your skills,
              and get things done together using a virtual credit system.
            </p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-box">

            <span className="login-small">WELCOME TO APTOS</span>

            <div className="auth-heading">
              <h2>
                {loginMode === "login"
                  ? "Sign in"
                  : loginMode === "register"
                  ? "Create account"
                  : "Reset password"}
              </h2>

              <p className="login-subtitle">
                {loginMode === "login"
                  ? "Sign in to continue to your Aptos account."
                  : loginMode === "register"
                  ? "Create your Aptos account and start exchanging skills."
                  : "Reset your password using your registered university email."}
              </p>
            </div>

            {authError && (
              <div className="auth-message auth-error">
                {authError}
              </div>
            )}

            {authMessage && (
              <div className="auth-message auth-success">
                {authMessage}
              </div>
            )}

            {loginMode === "login" && (
              <form onSubmit={handleLogin}>

                <label>Chitkara Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="namecoursename@chitkara.edu.in"
                  autoComplete="email"
                  defaultValue={rememberedEmail}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <div className="login-options">
                  <label className="remember">
                    <input
                      type="checkbox"
                      name="remember"
                      defaultChecked={Boolean(rememberedEmail)}
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setLoginMode("forgot");
                      setAuthError("");
                      setAuthMessage("");
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="login-button">
                  Sign In <span>→</span>
                </button>
              </form>
            )}

            {loginMode === "register" && (
              <form onSubmit={handleRegister}>

                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />

                <label>Chitkara Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="namecoursename@chitkara.edu.in"
                  autoComplete="email"
                  required
                />

                <label>Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  placeholder="Enter 10-digit roll number"
                  inputMode="numeric"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />

                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                <button type="submit" className="login-button">
                  Create Account <span>→</span>
                </button>
              </form>
            )}

            {loginMode === "forgot" && (
              <form onSubmit={handleForgotPassword}>

                <label>Chitkara Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="namecoursename@chitkara.edu.in"
                  autoComplete="email"
                  required
                />

                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  required
                />

                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  required
                />

                <button type="submit" className="login-button">
                  Reset Password <span>→</span>
                </button>
              </form>
            )}

            <p className="login-signup">
              {loginMode === "login" && (
                <>
                  Don't have an account?
                  <button
                    type="button"
                    className="text-button signup-link"
                    onClick={() => {
                      setLoginMode("register");
                      setAuthError("");
                      setAuthMessage("");
                    }}
                  >
                    Create an account
                  </button>
                </>
              )}

              {loginMode === "register" && (
                <>
                  Already have an account?
                  <button
                    type="button"
                    className="text-button signup-link"
                    onClick={() => {
                      setLoginMode("login");
                      setAuthError("");
                      setAuthMessage("");
                    }}
                  >
                    Sign in
                  </button>
                </>
              )}

              {loginMode === "forgot" && (
                <>
                  Remember your password?
                  <button
                    type="button"
                    className="text-button signup-link"
                    onClick={() => {
                      setLoginMode("login");
                      setAuthError("");
                      setAuthMessage("");
                    }}
                  >
                    Back to sign in
                  </button>
                </>
              )}
            </p>

          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN WEBSITE
  ========================= */

  return (
    <>

      {/* =========================
          HEADER
      ========================= */}

      <header
        className={`site-header ${open ? "menu-open" : ""}`}
        id="top"
      >

        <a
          className="brand"
          href="#top"
          aria-label="Aptos home"
        >
          <span className="brand-mark">
            △
          </span>

          <span>
            APTOS
          </span>
        </a>


        {/* MOBILE MENU */}

        <button
          className={`menu-toggle ${open ? "open" : ""}`}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={handleMenu}
        >

          <span></span>
          <span></span>
          <span></span>

        </button>


        {/* NAVIGATION */}

        <nav className="nav">

          <a
            href="#discover"
            onClick={closeMenu}
          >
            Explore Tasks
          </a>

          <a
            href="#how"
            onClick={closeMenu}
          >
            How It Works
          </a>

          <a
            href="#categories"
            onClick={closeMenu}
          >
            Categories
          </a>

          <a
            href="#about"
            onClick={closeMenu}
          >
            About Us
          </a>

        </nav>


        {/* NAV ACTIONS */}

        <div className="nav-actions">

          {loggedIn ? (

            <>

              <div className="profile">

                <div className="profile-icon">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="profile-info">

                  <span>
                    {user.name}
                  </span>

                  <small>
                    {user.rollNo}
                  </small>

                </div>

              </div>


              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Log out
              </button>

            </>

          ) : (

            <>

              <a
                className="login"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Log in
              </a>

              <a
                className="button button-small"
                href="#cta"
              >
                Sign Up <span>↗</span>
              </a>

            </>

          )}

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main>
        <Routes>
          <Route path="/" element={
            <>


        {/* =========================
            HERO
        ========================= */}

        <section className="hero">

          <div className="hero-image"></div>

          <div className="hero-overlay"></div>


          <div className="hero-content container">

            <div className="eyebrow">
              A COMMUNITY. INFINITE POSSIBILITIES.
            </div>


            <h1>

              Exchange skills.

              <br />

              Earn credits.

              <br />

              <em>
                Grow together.
              </em>

            </h1>


            <p className="hero-copy">

              Aptos connects university students to share skills,
              get things done, and grow together using a virtual
              credit system.

            </p>


            <div className="hero-buttons">

              <a
                className="button"
                href="#discover"
              >
                Explore Tasks <span>→</span>
              </a>


              <a
                className="button button-ghost"
                href="#cta"
              >
                Offer Your Skill <span>＋</span>
              </a>

            </div>


            <div className="hero-trust">

              <div className="avatars">

                <span>AK</span>
                <span>MS</span>
                <span>RJ</span>
                <span>+</span>

              </div>


              <p>

                <strong>
                  1,250+
                </strong>

                students already exchanging skills

              </p>

            </div>

          </div>

        </section>


        {/* =========================
            HOW IT WORKS
        ========================= */}

        <section
          className="section process-section"
          id="how"
        >

          <div className="container">

            <div className="section-heading center">

              <span className="section-kicker">
                SIMPLE BY DESIGN
              </span>

              <h2>
                How Aptos works
              </h2>

              <p>
                Give a little. Get a little.
                Keep the community moving.
              </p>

            </div>


            <div className="process">


              <div className="process-step">

                <span className="step-number">
                  01
                </span>

                <h3>
                  Create your profile
                </h3>

                <p>
                  Tell the community what you know
                  and what you can help with.
                </p>

              </div>


              <div className="process-line"></div>


              <div className="process-step">

                <span className="step-number">
                  02
                </span>

                <h3>
                  Find or post a task
                </h3>

                <p>
                  Browse requests or post something
                  you need help finishing.
                </p>

              </div>


              <div className="process-line"></div>


              <div className="process-step">

                <span className="step-number">
                  03
                </span>

                <h3>
                  Complete & earn
                </h3>

                <p>
                  Help another student and receive
                  credits for your time.
                </p>

              </div>


              <div className="process-line"></div>


              <div className="process-step">

                <span className="step-number">
                  04
                </span>

                <h3>
                  Spend or save
                </h3>

                <p>
                  Use your credits whenever you need
                  a skill from someone else.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            DISCOVER
        ========================= */}


        {/* =========================
            CATEGORIES
        ========================= */}

        <section
          className="section container"
          id="categories"
        >

          <div className="section-heading">

            <div>

              <span className="section-kicker">
                EXPLORE BY CATEGORY
              </span>

              <h2>
                Something for every skill.
              </h2>

            </div>

          </div>


          <div className="category-grid">


            {/* PROGRAMMING */}

            <button
              className="category-card category-image programming-category-button"
              onClick={() => navigate("/programming")}
            >

              <img
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=85"
                alt="Programming"
              />

              <div className="category-shade"></div>

              <span className="category-icon">
                ⌘
              </span>

              <div className="category-copy">

                <strong>
                  Programming
                </strong>

                <small>
                  1,240+ tasks
                </small>

              </div>

            </button>


            {/* DESIGN */}

            <button
              className="category-card category-image design-category-button"
              onClick={() => navigate("/design")}
            >
              <img
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=85"
                alt="Design"
              />

              <div className="category-shade"></div>

              <span className="category-icon">◇</span>

              <div className="category-copy">
                <strong>Design</strong>
                <small>980+ tasks</small>
              </div>
            </button>


            {/* WRITING */}


            {/* WRITING */}

            <button
              className="category-card category-image writing-category-button"
              onClick={() => navigate("/writing")}
            >

              <img
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=85"
                alt="Writing"
              />

              <div className="category-shade"></div>

              <span className="category-icon">
                ✎
              </span>

              <div className="category-copy">

                <strong>
                  Writing
                </strong>

                <small>
                  650+ tasks
                </small>

              </div>

            </button>

            {/* VIDEO EDITING */}


            {/* VIDEO EDITING */}

            <button
              className="category-card category-image videoediting-category-button"
              onClick={() => navigate("/videoediting")}
            >

              <img
                src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=800&q=85"
                alt="Video Editing"
              />

              <div className="category-shade"></div>

              <span className="category-icon">
                ▶
              </span>

              <div className="category-copy">

                <strong>
                  Video Editing
                </strong>

                <small>
                  420+ tasks
                </small>

              </div>

            </button>
            {/* VIDEO EDITING */}




          </div>

        </section>


        {/* =========================
            CTA
        ========================= */}
        </>
          } />
          <Route path="/design" element={<Design />} />
          <Route path="/programming" element={<Programming />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/videoediting" element={<VideoEditing />} />
        </Routes>
      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer
        className="footer"
        id="about"
      >

        <div className="container footer-grid">


          {/* BRAND */}

          <div>

            <a
              className="brand"
              href="#top"
            >

              <span className="brand-mark">
                △
              </span>

              <span>
                APTOS
              </span>

            </a>


            <p>
              Exchange skills.
              Earn credits.
              Grow together.
            </p>

          </div>


          {/* PLATFORM */}

          <div>

            <h4>
              Platform
            </h4>

            <a href="#discover">
              Explore tasks
            </a>

            <a href="#categories">
              Categories
            </a>

            <a href="#how">
              How it works
            </a>

          </div>


          {/* COMMUNITY */}

          <div>

            <h4>
              Community
            </h4>

            <a href="#">
              For students
            </a>

            <a href="#">
              Safety & trust
            </a>

            <a href="#">
              Help center
            </a>

          </div>


          {/* COMPANY */}

          <div>

            <h4>
              Company
            </h4>

            <a href="#">
              About Aptos
            </a>

            <a href="#">
              Contact
            </a>

            <a href="#">
              Privacy
            </a>

          </div>

        </div>


        <div className="container footer-bottom">

          <span>
            © 2026 Aptos
          </span>

          <span>
            Made for students, by students.
          </span>

        </div>

      </footer>

    </>
  );
}

export default App;