import { useState, useEffect, useMemo, useContext } from "react";
import "./writing.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

function Writing() {
  const { userName, credits, spendCredits } = useContext(UserContext);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  const [joinedTasks, setJoinedTasks] = useState(
    JSON.parse(localStorage.getItem("writingJoinedTasks")) || []
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
          { title: "Campus Newsletter Writer", desc: "Need a creative writer to draft engaging stories for our weekly tech and events newsletter.", owner: "Sneha Rao", init: "SR", type: "Article", img: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&q=80" },
          { title: "Proofread My Resume", desc: "Looking for someone with strong English skills to review and polish my internship resume.", owner: "Vikas Kumar", init: "VK", type: "Editing", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80" },
          { title: "Scriptwriter for Short Film", desc: "Our drama club needs a creative scriptwriter to help outline a 10-minute short film.", owner: "Anjali Desai", init: "AD", type: "Creative Writing", img: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=500&q=80" },
          { title: "Technical Documentation", desc: "Help me write clear API documentation and a README file for my final year CS project.", owner: "Rohan Das", init: "RD", type: "Technical", img: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&q=80" },
          { title: "Medium Blog Post on AI", desc: "Looking for a co-author to research and write a detailed article about generative AI.", owner: "Pooja Verma", init: "PV", type: "Article", img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&q=80" }
        ];
        
        const formattedData = data.map((item, index) => ({
          id: item.id,
          type: customContent[index]?.type || "Editing",
          title: customContent[index]?.title || item.title,
          description: customContent[index]?.desc || item.body,
          owner: customContent[index]?.owner || "Student",
          initials: customContent[index]?.init || "S",
          image: customContent[index]?.img,
          role: "English • 3rd Year",
          skills: ["Copywriting", "Editing", "Grammar"],
          level: "Intermediate",
          credits: 10,
          deadline: "3 days left",
          members: 1,
          maxMembers: 2,
          status: "Looking for writers"
        }));

        // Load saved tasks from localStorage and combine with API data
        const savedTasks = JSON.parse(localStorage.getItem("customWritingTasks")) || [];
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
    const title = window.prompt("Enter the title for your new writing opportunity:");
    if (!title) return; 
    
    const description = window.prompt("Enter a short description:");
    const skillsInput = window.prompt("Enter writing skills needed (comma separated):");
    const creditsInput = window.prompt("Enter the number of credits (e.g., 10):");
    const nameInput = window.prompt("Enter your full name:");
    const levelInput = window.prompt("Enter the level (Beginner, Intermediate, or Advanced):");

    const ownerName = nameInput || "Abhishek";
    const generatedInitials = ownerName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

    const newOpp = {
      id: Date.now(),
      type: "Creative Writing",
      title: title,
      description: description || "No description provided.",
      owner: ownerName,
      initials: generatedInitials,
      image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&q=80",
      role: "Writing • Current Student",
      skills: skillsInput ? skillsInput.split(",").map(skill => skill.trim()) : ["Editing"],
      level: levelInput || "Beginner",
      credits: parseInt(creditsInput) || 10,
      deadline: "Just posted",
      members: 1,
      maxMembers: 2,
      status: "Looking for writers"
    };

    // Update state and save to localStorage
    setOpportunities([newOpp, ...opportunities]);
    const savedTasks = JSON.parse(localStorage.getItem("customWritingTasks")) || [];
    localStorage.setItem("customWritingTasks", JSON.stringify([newOpp, ...savedTasks]));
    
    // Deduct credits globally
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
    localStorage.setItem("writingJoinedTasks", JSON.stringify(updated));
  };

  return (
    <div className="writing-page">
      
      <div className="writing-topbar">
        <button className="writing-brand" onClick={() => navigate("/")}>
          <span className="brand-mark">△</span> APTOS
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button className="writing-back" onClick={() => navigate("/")}>
            ← Back to Aptos
          </button>
          <div style={{ background: "#e0f2fe", color: "#0369a1", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px" }}>
            {userName}'s Balance: {credits}
          </div>
        </div>
      </div>

      <section className="writing-hero">
        <div className="hero-copy">
          <div className="hero-pill">CONTENT CREATION</div>
          <h1>Words that <span>connect.</span></h1>
          <p>Find co-writers, editors, and brainstorm partners. Help others craft compelling stories, articles, and copy.</p>
        </div>
        <div className="hero-visual">
          <div className="paper">
            <div className="paper-top"><span>DRAFT 01</span><span>12.04</span></div>
            <h3>The Art of <em>Clarity</em></h3>
            <div className="paper-lines">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="writing-discover">
        <div className="discover-heading">
          <div>
            <span>DISCOVER</span>
            <h2>Opportunities around you <i>.</i></h2>
          </div>
          <button 
            onClick={handlePostOpportunity} 
            style={{ background: "#214b31", color: "white", padding: "12px 18px", border: "none", borderRadius: "9px", cursor: "pointer", fontWeight: "bold" }}
          >
            + Post an opportunity
          </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <div className="writing-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search writing tasks, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="writing-categories">
            {["All", "Article", "Editing", "Creative Writing", "Technical"].map((option) => (
              <button
                key={option}
                className={filter === option ? "active" : ""}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="writing-empty"><h3>Loading writing opportunities...</h3></div>}
        {error && <div className="writing-empty"><h3 style={{ color: "red" }}>Error: {error}</h3></div>}

        {!loading && !error && (
          <div className="writing-cards">
            {filteredOpportunities.map((item) => (
              <div className="writing-card" key={item.id}>
                <div className="card-image">
                  <span className="image-category">{item.type}</span>
                  <span className="credit-badge">{item.credits} Credits</span>
                  <img src={item.image} alt="Task" />
                </div>
                
                <div className="card-body">
                  <span className="card-type">{item.status}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  
                  <div className="card-skills">
                    {item.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <div className="card-bottom">
                    <div className="card-person">
                      <div className="person-avatar">{item.initials}</div>
                      <div>
                        <strong>{item.owner}</strong>
                        <small>{item.role}</small>
                      </div>
                    </div>
                  </div>

                  <button className="card-button" onClick={() => setSelectedTask(item)}>
                    View details <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredOpportunities.length === 0 && (
          <div className="writing-empty">
            <div>⌕</div>
            <h3>No tasks found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      {/* POP-UP MODAL FOR DETAILS */}
      {selectedTask && (
        <div className="writing-overlay" onClick={() => setSelectedTask(null)}>
          <div className="writing-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTask(null)}>×</button>
            
            <div className="modal-image">
              <img src={selectedTask.image} alt="Detail" />
              <span>{selectedTask.type}</span>
            </div>
            
            <div className="modal-content">
              <span className="modal-label">PROJECT DETAILS</span>
              <h2>{selectedTask.title}</h2>
              <p>{selectedTask.description}</p>

              <div className="modal-person">
                <div className="modal-avatar">{selectedTask.initials}</div>
                <div>
                  <strong>{selectedTask.owner}</strong>
                  <span>{selectedTask.role}</span>
                </div>
              </div>

              <div className="modal-info">
                <div>
                  <small>LEVEL</small>
                  <strong>{selectedTask.level}</strong>
                </div>
                <div>
                  <small>CREDITS</small>
                  <strong>{selectedTask.credits}</strong>
                </div>
                <div>
                  <small>DEADLINE</small>
                  <strong>{selectedTask.deadline}</strong>
                </div>
              </div>

              <div className="modal-skills">
                {selectedTask.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <button
                className={`join-button ${joinedTasks.includes(selectedTask.id) ? "joined" : ""}`}
                onClick={() => joinOpportunity(selectedTask.id)}
              >
                {joinedTasks.includes(selectedTask.id) ? "✓ Request Sent" : "Apply for Collaboration"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Writing;