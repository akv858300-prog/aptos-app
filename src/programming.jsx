import { useState, useEffect, useMemo, useContext } from "react";
import "./programming.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

function Programming() {
  const { userName, credits, spendCredits } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);

  const [joinedTasks, setJoinedTasks] = useState(
    JSON.parse(localStorage.getItem("programmingJoinedTasks")) || []
  );

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities.");
        }
        
        const data = await response.json();
        
        // Your original English overrides
        const customContent = [
          { title: "Building a MERN Campus Marketplace", desc: "Looking for 1–2 students interested in React and Node.js to build a real-world student marketplace project.", owner: "Arjun Mehta", init: "AM" },
          { title: "Need help understanding Java HashMap", desc: "I understand the basics but struggling with frequency counting and interview-style HashMap problems.", owner: "Simran Kaur", init: "SK" },
          { title: "DSA Interview Preparation Group", desc: "Starting a small group to solve 2–3 LeetCode problems every evening and discuss different approaches.", owner: "Rahul Sharma", init: "RS" },
          { title: "React Portfolio for Placement Season", desc: "Looking for a frontend student to collaborate on a polished portfolio and learn React together.", owner: "Priya Verma", init: "PV" },
          { title: "Python automation project discussion", desc: "I have an idea for a Python automation project and want someone interested in Python to brainstorm and build it together.", owner: "Karan Singh", init: "KS" }
        ];
        
        // Map the API structure to your custom English text
        const formattedData = data.map((item, index) => ({
          id: item.id,
          type: index % 2 === 0 ? "Project" : "Help",
          title: customContent[index]?.title || item.title,
          description: customContent[index]?.desc || item.body,
          owner: customContent[index]?.owner || "Student",
          initials: customContent[index]?.init || "S",
          role: "CSE • 3rd Year",
          skills: ["React", "JavaScript", "API"],
          level: "Intermediate",
          credits: 15,
          deadline: "5 days left",
          members: 1,
          maxMembers: 4,
          status: "Looking for teammates"
        }));

        // Load any custom tasks saved previously
        const savedTasks = JSON.parse(localStorage.getItem("customProgrammingTasks")) || [];
        
        // Combine saved tasks (at the top) with the API data
        setOpportunities([...savedTasks, ...formattedData]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      const query = search.toLowerCase();
      
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        );
        
      const matchesFilter =
        filter === "All" || item.type === filter;
        
      return matchesSearch && matchesFilter;
    });
  }, [opportunities, search, filter]);


  const joinOpportunity = (id) => {

    if (joinedTasks.includes(id)) {
      return;
    }

    const updated = [...joinedTasks, id];

    setJoinedTasks(updated);

    localStorage.setItem(
      "programmingJoinedTasks",
      JSON.stringify(updated)
    );
  };
  const handlePostOpportunity = () => {
    const title = window.prompt("Enter the title for your new opportunity:");
    if (!title) return; 
    
    const description = window.prompt("Enter a short description:");
    const skillsInput = window.prompt("Enter skills needed (comma separated):");
    const creditsInput = window.prompt("Enter the number of credits (e.g., 15):");
    
    // New prompts for Name and Level
    const nameInput = window.prompt("Enter your full name:");
    const levelInput = window.prompt("Enter the level (Beginner, Intermediate, or Advanced):");

    // Automatically generate initials (e.g., "Arjun Mehta" becomes "AM")
    const ownerName = nameInput || "Abhishek";
    const generatedInitials = ownerName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

    const newOpp = {
      id: Date.now(),
      type: "Project",
      title: title,
      description: description || "No description provided.",
      owner: ownerName,
      initials: generatedInitials,
      role: "CSE • Current Student",
      skills: skillsInput ? skillsInput.split(",").map(skill => skill.trim()) : ["General"],
      level: levelInput || "Beginner",
      credits: parseInt(creditsInput) || 10,
      deadline: "Just posted",
      members: 1,
      maxMembers: 4,
      status: "Looking for teammates"
    };

    // 1. Update the screen immediately
    setOpportunities([newOpp, ...opportunities]);
    
    // 2. Save it permanently to localStorage so it survives refresh
    const savedTasks = JSON.parse(localStorage.getItem("customProgrammingTasks")) || [];
    localStorage.setItem("customProgrammingTasks", JSON.stringify([newOpp, ...savedTasks]));
    spendCredits(newOpp.credits);
  };

  return (

    <div className="programming-page">

      {/* TOP NAV */}

      <div className="programming-topbar">

        <button
          className="aptos-brand"
          onClick={() => navigate("/")}
        >
          <span className="brand-mark">△</span>
          APTOS
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button
            className="back-button"
            style={{ margin: 0 }}
            onClick={() => navigate("/")}
          >
            ← Back to Aptos
          </button>
          <div style={{ background: "#e0f2fe", color: "#0369a1", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px" }}>
            {userName}'s Balance: {credits}
          </div>
        </div>

      </div>


      {!selectedTask && (

        <>

          {/* HERO */}

          <section className="programming-hero">

            <div className="hero-copy">

              <span className="section-kicker">
                PROGRAMMING COMMUNITY
              </span>

              <h1>
                Find people to
                <span> build with.</span>
              </h1>

              <p>
                Discover students who share your programming interests,
                join projects, solve problems together and exchange skills.
              </p>

            </div>


            <div className="community-card">

              <div className="community-icon">
                &lt;/&gt;
              </div>

              <div>
                <strong>Programming Community</strong>

                <span>
                  Students learning, building and helping each other
                </span>
              </div>

            </div>

          </section>


          {/* QUICK STATS */}

          <div className="programming-stats">

            <div>
              <strong>48</strong>
              <span>Active students</span>
            </div>

            <div>
              <strong>17</strong>
              <span>Open collaborations</span>
            </div>

            <div>
              <strong>9</strong>
              <span>Projects this week</span>
            </div>

            <div>
              <strong>126</strong>
              <span>Credits exchanged</span>
            </div>

          </div>


          {/* DISCOVER HEADER */}

          <section className="discover-section">

            <div className="discover-heading">

              <div>

                <span className="section-kicker">
                  DISCOVER
                </span>

                <h2>
                  Opportunities around you
                </h2>

                <p>
                  Find a project, ask for help or meet students
                  working towards similar goals.
                </p>

              </div>

              <button className="post-opportunity" onClick={handlePostOpportunity}>
                      + Post an opportunity
              </button>

            </div>


            {/* SEARCH */}

            <div className="programming-controls">

              <div className="search-wrapper">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search skills, projects, students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>


              <div className="filter-buttons">

                {["All", "Project", "Help", "Study Group"].map(
                  (option) => (

                    <button
                      key={option}
                      className={
                        filter === option
                          ? "filter-active"
                          : ""
                      }
                      onClick={() => setFilter(option)}
                    >
                      {option}
                    </button>

                  )
                )}

              </div>

            </div>


            {/* OPPORTUNITY GRID */}

            {loading && <div className="empty-state"><h3>Loading opportunities...</h3></div>}
            {error && <div className="empty-state"><h3 style={{color: "red"}}>Error: {error}</h3></div>}

            {!loading && !error && <div className="opportunity-grid">

              {filteredOpportunities.map((item) => (

                <article
                  className="opportunity-card"
                  key={item.id}
                >

                  <div className="card-top">

                    <span className="opportunity-type">
                      {item.type}
                    </span>

                    <span className="availability">
                      {item.status}
                    </span>

                  </div>


                  <h3>
                    {item.title}
                  </h3>


                  <p className="opportunity-description">
                    {item.description}
                  </p>


                  {/* SKILLS */}

                  <div className="skill-list">

                    {item.skills.map((skill) => (

                      <span key={skill}>
                        {skill}
                      </span>

                    ))}

                  </div>


                  {/* STUDENT */}

                  <div className="student-row">

                    <div className="student-avatar">
                      {item.initials}
                    </div>

                    <div className="student-info">

                      <strong>
                        {item.owner}
                      </strong>

                      <span>
                        {item.role}
                      </span>

                    </div>

                  </div>


                  {/* META */}

                  <div className="opportunity-meta">

                    <div>
                      <span>Level</span>
                      <strong>{item.level}</strong>
                    </div>

                    <div>
                      <span>Members</span>
                      <strong>
                        {item.members}/{item.maxMembers}
                      </strong>
                    </div>

                    <div>
                      <span>Credits</span>
                      <strong>{item.credits}</strong>
                    </div>

                  </div>


                  {/* FOOTER */}

                  <div className="card-footer">

                    <span className="deadline">
                      {item.deadline}
                    </span>

                    <button
                      className="view-task-button"
                      onClick={() => setSelectedTask(item)}
                    >
                      View details →
                    </button>

                  </div>

                </article>

              ))}

            </div>}

            {!loading && !error && filteredOpportunities.length === 0 && (

              <div className="empty-state">

                <div>⌕</div>

                <h3>
                  No opportunities found
                </h3>

                <p>
                  Try searching for another skill, project or student.
                </p>

              </div>

            )}

          </section>

        </>

      )}


      {/* DETAILS */}

      {selectedTask && (

        <section className="programming-details">

          <button
            className="detail-back"
            onClick={() => setSelectedTask(null)}
          >
            ← Back to opportunities
          </button>


          <div className="details-layout">

            <main className="details-main">

              <div className="details-type-row">

                <span className="opportunity-type">
                  {selectedTask.type}
                </span>

                <span className="availability">
                  {selectedTask.status}
                </span>

              </div>


              <h1>
                {selectedTask.title}
              </h1>


              <p className="details-description">
                {selectedTask.description}
              </p>


              <div className="details-section">

                <h3>
                  What you'll work on
                </h3>

                <p>
                  Collaborate with other students, share your
                  knowledge and contribute to the project. The goal
                  is not just to complete a task, but to learn from
                  people with similar interests.
                </p>

              </div>


              <div className="details-section">

                <h3>
                  Skills involved
                </h3>

                <div className="skill-list large">

                  {selectedTask.skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}

                </div>

              </div>


              <div className="details-section">

                <h3>
                  Why join?
                </h3>

                <div className="benefit-list">

                  <div>
                    <span>✓</span>
                    Learn from another student
                  </div>

                  <div>
                    <span>✓</span>
                    Build something for your portfolio
                  </div>

                  <div>
                    <span>✓</span>
                    Meet people with similar interests
                  </div>

                  <div>
                    <span>✓</span>
                    Earn and exchange Aptos credits
                  </div>

                </div>

              </div>

            </main>


            <aside className="details-sidebar">

              <div className="requester-card">

                <span className="sidebar-label">
                  ORGANIZED BY
                </span>

                <div className="requester">

                  <div className="large-avatar">
                    {selectedTask.initials}
                  </div>

                  <div>
                    <strong>
                      {selectedTask.owner}
                    </strong>

                    <span>
                      {selectedTask.role}
                    </span>
                  </div>

                </div>

              </div>


              <div className="detail-info-card">

                <div>
                  <span>Collaboration level</span>
                  <strong>
                    {selectedTask.level}
                  </strong>
                </div>

                <div>
                  <span>Members</span>
                  <strong>
                    {selectedTask.members}/{selectedTask.maxMembers}
                  </strong>
                </div>

                <div>
                  <span>Credits</span>
                  <strong>
                    {selectedTask.credits}
                  </strong>
                </div>

                <div>
                  <span>Timeline</span>
                  <strong>
                    {selectedTask.deadline}
                  </strong>
                </div>

              </div>


              <button
                className={`join-button ${
                  joinedTasks.includes(selectedTask.id)
                    ? "joined"
                    : ""
                }`}
                onClick={() => joinOpportunity(selectedTask.id)}
              >
                {joinedTasks.includes(selectedTask.id)
                  ? "✓ Request Sent"
                  : "Join Collaboration"}
              </button>


              <p className="join-note">
                You'll be able to connect with the organizer
                after joining this opportunity.
              </p>

            </aside>

          </div>

        </section>

      )}

    </div>

  );
}

export default Programming;