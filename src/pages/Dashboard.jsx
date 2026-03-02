import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Folder, Clock, Settings, UserCircle, Grid, Monitor, MoreHorizontal, Image as ImageIcon } from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
    const recentProjects = [
        { id: 1, name: 'Summer Campaign', type: 'Product to Model', date: '2 hours ago', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' },
        { id: 2, name: 'Fall Collection', type: 'Model Swap', date: 'Yesterday', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80' },
        { id: 3, name: 'Basic Tees', type: 'Virtual Try-On', date: 'Oct 15, 2026', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80' },
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <Link to="/" className="logo">
                        <span className="logo-text">Aura<span className="text-gradient">Studio</span></span>
                    </Link>
                </div>

                <div className="workspace-selector">
                    <div className="workspace-name text-gradient">My Workspace</div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <span className="nav-label">Studio</span>
                        <Link to="/editor" className="nav-item"><Grid size={16} /> Create New</Link>
                        <a href="#" className="nav-item active"><Folder size={16} /> Projects</a>
                        <a href="#" className="nav-item"><UserCircle size={16} /> Consistent Models</a>
                    </div>

                    <div className="nav-group mt-xl">
                        <span className="nav-label">Settings</span>
                        <a href="#" className="nav-item"><Monitor size={16} /> API Keys</a>
                        <a href="#" className="nav-item"><Settings size={16} /> Preferences</a>
                    </div>
                </nav>

                <div className="user-profile">
                    <div className="avatar">A</div>
                    <div className="user-info">
                        <span className="name">User Accounts</span>
                        <span className="plan text-gradient">Pro Plan</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-breadcrumbs">
                        <span>Workspace</span> / <span className="text-primary">Projects</span>
                    </div>

                    <div className="header-actions">
                        <Link to="/editor" className="btn btn-primary">
                            <Plus size={16} /> New Project
                        </Link>
                    </div>
                </header>

                <section className="projects-grid">
                    {recentProjects.map(project => (
                        <Link to="/editor" key={project.id} className="project-card">
                            <div className="project-thumbnail">
                                <img src={project.image} alt={project.name} />
                                <div className="card-badge">{project.type}</div>
                            </div>
                            <div className="project-meta">
                                <div className="meta-left">
                                    <h3>{project.name}</h3>
                                    <p>{project.date}</p>
                                </div>
                                <button className="btn-icon-minimal"><MoreHorizontal size={16} /></button>
                            </div>
                        </Link>
                    ))}

                    {/* Upload Placeholder Card */}
                    <Link to="/editor" className="project-card upload-card glass-panel">
                        <div className="upload-content">
                            <div className="create-icon">
                                <Plus size={28} />
                            </div>
                            <h3>Create New Project</h3>
                            <p className="text-soft">Start from a product or model image</p>
                        </div>
                    </Link>
                </section>
            </main>
        </div>
    )
}

export default Dashboard
