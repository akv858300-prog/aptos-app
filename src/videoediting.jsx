import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./videoediting.css";
import { UserContext } from "./UserContext.jsx";

function VideoEditing() {
  const { userName, credits, spendCredits } = useContext(UserContext);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  const [joinedTasks, setJoinedTasks] = useState(
    JSON.parse(localStorage.getItem("videoJoinedTasks")) || []
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
          { title: "Edit YouTube Tech Vlog", desc: "I need someone with Premiere Pro experience to cut and color grade a 10-minute tech review vlog.", owner: "Dev Patel", init: "DP", type: "YouTube", img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80" },
          { title: "Short Form Reels for Club", desc: "Help us create engaging 30-second Instagram Reels for the upcoming university cultural fest.", owner: "Sneha Kapoor", init: "SK", type: "Social Media", img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&q=80" },
          { title: "Startup Pitch Video", desc: "Looking for an animator/editor to help compile a professional 3-minute pitch video for an investor meeting.", owner: "Rahul Sharma", init: "RS", type: "Promo", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" },
          { title: "Podcast Audio & Video Sync", desc: "Need someone to sync 3 camera angles and clean up the audio for our student podcast episode.", owner: "Amit Singh", init: "AS", type: "Podcast", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80" },
          { title: "Music Video Editing", desc: "Seeking a creative editor to add visual effects and transitions to a short music video shot on campus.", owner: "Neha Verma", init: "NV", type: "Creative", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80" }
        ];
        
        const formattedData = data.map((item, index) => ({
          id: item.id,
          type: customContent[index]?.type || "Editing",
          title: customContent[index]?.title || item.title,
          description: customContent[index]?.desc || item.body,
          owner: customContent[index]?.owner || "Student",
          initials: customContent[index]?.init || "S",
          image: customContent[index]?.img,
          role: "Media • 2nd Year",
          skills: ["Premiere Pro", "After Effects", "Color Grading"],
          level: "Intermediate",
          credits: 25,
          deadline: "6 days left",
          members: 1,
          maxMembers: 2,
          status: "Looking for editor"
        }));

        // Load saved tasks from localStorage and combine with API data
        const savedTasks = JSON.parse(localStorage.getItem("customVideoTasks")) || [];
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
    const title = window.prompt("Enter the title for your new video project:");
    if (!title) return; 
    
    const description = window.prompt("Enter a short description:");
    const skillsInput = window.prompt("Enter editing skills needed (comma separated):");
    const creditsInput = window.prompt("Enter the number of credits (e.g., 25):");
    const nameInput = window.prompt("Enter your full name:");
    const levelInput = window.prompt("Enter the level (Beginner, Intermediate, or Advanced):");

    const ownerName = nameInput || "Abhishek";
    const generatedInitials = ownerName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

    const newOpp = {
      id: Date.now(),
      type: "Editing",
      title: title,
      description: description || "No description provided.",
      owner: ownerName,
      initials: generatedInitials,
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80",
      role: "Media • Current Student",
      skills: skillsInput ? skillsInput.split(",").map(skill => skill.trim()) : ["Premiere Pro"],
      level: levelInput || "Beginner",
      credits: parseInt(creditsInput) || 20,
      deadline: "Just posted",
      members: 1,
      maxMembers: 2,
      status: "Looking for editor"
    };

    // Update state and save to localStorage
    setOpportunities([newOpp, ...opportunities]);
    const savedTasks = JSON.parse(localStorage.getItem("customVideoTasks")) || [];
    localStorage.setItem("customVideoTasks", JSON.stringify([newOpp, ...savedTasks]));
    
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
    localStorage.setItem("videoJoinedTasks", JSON.stringify(updated));
  };

  return (
    <div className="videoediting-page">
      {!selectedTask ? (
        <>
          <div className="videoediting-header">
            <div>
              <span className="section-kicker">VIDEO EDITING</span>
              <h1>Visual Storytelling</h1>
              <p>Find projects to practice your editing, motion graphics, and color grading skills.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <button className="back-button" style={{ margin: 0 }} onClick={() => navigate("/")}>
                ← Back to Aptos
              </button>
              <div style={{ background: "#e0f2fe", color: "#0369a1", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px" }}>
                {userName}'s Balance: {credits}
              </div>
            </div>
          </div>

          <div className="videoediting-banner">
            <div className="banner-content">
              <span>FEATURED COLLAB</span>
              <h2>Campus Fest Aftermovie</h2>
              <p>Join a team of 3 editors to cut the official highlight reel for the annual university festival.</p>
            </div>
            <div className="banner-image">
              <img src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80" alt="Video Editing" />
            </div>
          </div>

          <div className="opportunities-heading">
            <div>
              <h2>Current Projects</h2>
              <span className="opportunity-count">{filteredOpportunities.length} opportunities available</span>
            </div>
            <button 
              className="back-button" 
              onClick={handlePostOpportunity}
              style={{ background: "#183d29", color: "white", border: "none", fontWeight: "bold" }}
            >
              + Post an opportunity
            </button>
          </div>

          <div className="videoediting-controls">
            <input
              type="text"
              placeholder="Search projects, software, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="YouTube">YouTube</option>
              <option value="Social Media">Social Media</option>
              <option value="Promo">Promo</option>
              <option value="Podcast">Podcast</option>
              <option value="Creative">Creative</option>
            </select>
          </div>

          {loading && <div className="no-tasks"><h3>Loading video opportunities...</h3></div>}
          {error && <div className="no-tasks"><h3 style={{ color: "red" }}>Error: {error}</h3></div>}

          {!loading && !error && (
            <div className="videoediting-task-list">
              {filteredOpportunities.map((item) => (
                <div className="videoediting-task-card" key={item.id}>
                  <div className="task-image">
                    <span className="image-category">{item.type}</span>
                    <img src={item.image} alt="Task" />
                  </div>
                  
                  <div className="task-card-content">
                    <div className="task-card-top">
                      <span className="student-name">{item.owner}</span>
                      <span className="deadline">{item.deadline}</span>
                    </div>
                    
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    
                    <div className="skill-list">
                      {item.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <div className="videoediting-task-meta">
                      <span>Credits: <strong>{item.credits}</strong></span>
                      <span>Level: <strong>{item.level}</strong></span>
                    </div>

                    <button className="view-task-button" onClick={() => setSelectedTask(item)}>
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredOpportunities.length === 0 && (
            <div className="no-tasks">
              <h3>No projects found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          )}
        </>
      ) : (
        <div className="videoediting-task-details">
          <button className="back-button" onClick={() => setSelectedTask(null)} style={{ marginBottom: '20px' }}>
            ← Back to projects
          </button>
          
          <div className="detail-image">
            <span className="image-category videoediting-tag">{selectedTask.type}</span>
            <img src={selectedTask.image} alt="Detail" />
          </div>
          
          <div className="detail-layout">
            <div className="detail-main">
              <h1>{selectedTask.title}</h1>
              <p className="task-description">{selectedTask.description}</p>

              <div className="detail-section">
                <h3>Required Software & Skills</h3>
                <div className="skill-list">
                  {selectedTask.skills.map((skill) => (
                    <span key={skill} style={{ fontSize: '12px', padding: '8px 12px' }}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Project Benefits</h3>
                <div className="benefits">
                  <div><strong>✓</strong> Real-world portfolio material</div>
                  <div><strong>✓</strong> Network with content creators</div>
                  <div><strong>✓</strong> Earn {selectedTask.credits} Aptos credits</div>
                </div>
              </div>
            </div>

            <div className="detail-sidebar">
              <span className="sidebar-label">ORGANIZED BY</span>
              <div className="student-profile">
                <div className="student-avatar">{selectedTask.initials}</div>
                <div>
                  <strong>{selectedTask.owner}</strong>
                  <span>{selectedTask.role}</span>
                </div>
              </div>

              <div className="detail-meta">
                <div>
                  <span>Level</span>
                  <strong>{selectedTask.level}</strong>
                </div>
                <div>
                  <span>Credits</span>
                  <strong>{selectedTask.credits}</strong>
                </div>
                <div>
                  <span>Timeline</span>
                  <strong>{selectedTask.deadline}</strong>
                </div>
                <div>
                  <span>Team Size</span>
                  <strong>{selectedTask.members} / {selectedTask.maxMembers}</strong>
                </div>
              </div>

              <button
                className={`apply-task-button ${joinedTasks.includes(selectedTask.id) ? "applied" : ""}`}
                onClick={() => joinOpportunity(selectedTask.id)}
              >
                {joinedTasks.includes(selectedTask.id) ? "✓ Request Sent" : "Apply for Collaboration"}
              </button>
              
              <p className="join-note">
                Applying will send a notification to the organizer to connect with you.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoEditing;