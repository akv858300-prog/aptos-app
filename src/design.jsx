import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./design.css";
import { UserContext } from "./UserContext.jsx";

function Design() {
  const { userName, credits, spendCredits } = useContext(UserContext);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  const [joinedTasks, setJoinedTasks] = useState(
    JSON.parse(localStorage.getItem("designJoinedTasks")) || []
  );

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities.");
        }
        
        const data = await response.json();
        
        const customContent = [
          { title: "UI/UX for Campus App", desc: "Need a product designer to wireframe and prototype a new student marketplace app in Figma.", owner: "Riya Sharma", init: "RS", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80" },
          { title: "Tech Fest Logo Design", desc: "Looking for a graphic designer to create a modern, minimalist logo for the upcoming annual tech festival.", owner: "Aman Gupta", init: "AG", img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&q=80" },
          { title: "Social Media Post Templates", desc: "Help us design reusable Canva/Figma templates for our coding club's Instagram page.", owner: "Neha Singh", init: "NS", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
          { title: "App Icon Redesign", desc: "Our current app icon looks outdated. We need a fresh, flat-design icon that stands out on mobile home screens.", owner: "Kabir Das", init: "KD", img: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=500&q=80" },
          { title: "Portfolio Website Mockup", desc: "I am a developer looking for a designer to create a sleek UI mockup for my personal portfolio website.", owner: "Ananya Patel", init: "AP", img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80" }
        ];
        
        const formattedData = data.map((item, index) => ({
          id: item.id,
          type: index % 2 === 0 ? "UI/UX" : "Graphic Design",
          title: customContent[index]?.title || item.title,
          description: customContent[index]?.desc || item.body,
          owner: customContent[index]?.owner || "Student",
          initials: customContent[index]?.init || "S",
          image: customContent[index]?.img,
          role: "Design • 2nd Year",
          skills: ["Figma", "Illustrator", "Creative"],
          level: "Intermediate",
          credits: 20,
          deadline: "4 days left",
          members: 1,
          maxMembers: 3,
          status: "Looking for designers"
        }));

        // Load saved tasks from localStorage and combine with API data
        const savedTasks = JSON.parse(localStorage.getItem("customDesignTasks")) || [];
        setOpportunities([...savedTasks, ...formattedData]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handlePostOpportunity = () => {
    const title = window.prompt("Enter the title for your new design opportunity:");
    if (!title) return; 
    
    const description = window.prompt("Enter a short description:");
    const skillsInput = window.prompt("Enter design skills needed (comma separated):");
    const creditsInput = window.prompt("Enter the number of credits (e.g., 20):");
    const nameInput = window.prompt("Enter your full name:");
    const levelInput = window.prompt("Enter the level (Beginner, Intermediate, or Advanced):");

    const ownerName = nameInput || "Abhishek";
    const generatedInitials = ownerName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

    const newOpp = {
      id: Date.now(),
      type: "UI/UX",
      title: title,
      description: description || "No description provided.",
      owner: ownerName,
      initials: generatedInitials,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80",
      role: "Design • Current Student",
      skills: skillsInput ? skillsInput.split(",").map(skill => skill.trim()) : ["Figma"],
      level: levelInput || "Beginner",
      credits: parseInt(creditsInput) || 15,
      deadline: "Just posted",
      members: 1,
      maxMembers: 3,
      status: "Looking for designers"
    };

    // Update state and save to localStorage
    setOpportunities([newOpp, ...opportunities]);
    // 2. Save it permanently to localStorage so it survives refresh
    const savedTasks = JSON.parse(localStorage.getItem("customDesignTasks")) || [];
    localStorage.setItem("customDesignTasks", JSON.stringify([newOpp, ...savedTasks]));
    spendCredits(newOpp.credits);
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.skills.some((skill) => skill.toLowerCase().includes(query));
      const matchesFilter = filter === "All" || item.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [opportunities, search, filter]);

  const joinOpportunity = (id) => {
    if (joinedTasks.includes(id)) return;
    const updated = [...joinedTasks, id];
    setJoinedTasks(updated);
    localStorage.setItem("designJoinedTasks", JSON.stringify(updated));
  };

  return (
    <div className="design-page">
      {!selectedTask ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
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

          <div className="design-page-top">
            <div className="design-title">
              <div className="design-page-icon">✎</div>
              <div>
                <span className="section-kicker">DESIGN COMMUNITY</span>
                <h1>Creative Collaborations</h1>
                <p>Find UI/UX projects, graphic design tasks, and creative students.</p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
              <div className="task-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Search design tasks, skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button 
                onClick={handlePostOpportunity} 
                style={{ background: "#2f5d50", color: "white", padding: "12px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
              >
                + Post an opportunity
              </button>
            </div>

            <div className="task-filters">
              {["All", "UI/UX", "Graphic Design"].map((option) => (
                <button
                  key={option}
                  className={filter === option ? "active-filter" : ""}
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {loading && <div className="no-tasks"><h3>Loading design opportunities...</h3></div>}
          {error && <div className="no-tasks"><h3 style={{ color: "red" }}>Error: {error}</h3></div>}

          {!loading && !error && (
            <div className="design-task-list">
              {filteredOpportunities.map((item) => (
                <div className="design-task-card" key={item.id}>
                  <img src={item.image} alt="Design Task" />
                  <div className="design-task-info">
                    <span className="task-category">{item.type}</span>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    
                    <div className="task-meta">
                      <span><strong>Credits:</strong> {item.credits}</span>
                      <span><strong>Level:</strong> {item.level}</span>
                      <span><strong>Deadline:</strong> {item.deadline}</span>
                    </div>

                    <button className="view-task-button" onClick={() => setSelectedTask(item)}>
                      View details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredOpportunities.length === 0 && (
            <div className="no-tasks">
              <h2>No tasks found</h2>
              <p>Try searching for a different skill or category.</p>
            </div>
          )}
        </>
      ) : (
        <div className="task-details-card">
          <img className="task-details-image" src={selectedTask.image} alt="Design Details" />
          
          <div className="task-details-content">
            <button className="back-button" onClick={() => setSelectedTask(null)}>
              ← Back to tasks
            </button>
            
            <span className="task-category">{selectedTask.type}</span>
            <h1>{selectedTask.title}</h1>
            
            <div className="details-meta">
              <span>Organized by: <strong>{selectedTask.owner}</strong></span>
              <span>Level: <strong>{selectedTask.level}</strong></span>
              <span>Credits: <strong>{selectedTask.credits}</strong></span>
            </div>

            <h3>Project Overview</h3>
            <p>{selectedTask.description}</p>

            <h3>Required Skills</h3>
            <div className="skills-list">
              {selectedTask.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <div className="requirements-box">
              <div>
                <h3>Why collaborate?</h3>
                <ul>
                  <li>Build a strong portfolio piece</li>
                  <li>Work closely with fellow students</li>
                  <li>Exchange Aptos credits</li>
                </ul>
              </div>
              
              <div className="deadline-box">
                <strong>Timeline</strong>
                <span>{selectedTask.deadline}</span>
              </div>
            </div>

            <button
              className={`apply-task-button ${joinedTasks.includes(selectedTask.id) ? "applied" : ""}`}
              onClick={() => joinOpportunity(selectedTask.id)}
            >
              {joinedTasks.includes(selectedTask.id) ? "✓ Request Sent" : "Apply for Collaboration"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Design;