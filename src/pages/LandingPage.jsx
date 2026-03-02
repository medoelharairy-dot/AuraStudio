import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Wand2, Layers, RefreshCw, Shirt, UserCircle, Upload, ArrowRight, Zap } from 'lucide-react'
import './LandingPage.css'

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="navbar container">
                <div className="logo">
                    <Wand2 className="logo-icon" />
                    <span className="logo-text">Aura<span className="text-gradient">Studio</span></span>
                </div>
                <div className="nav-links d-none-mobile">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How it Works</a>
                    <a href="#pricing">Pricing</a>
                </div>
                <div className="nav-actions">
                    <Link to="/app" className="btn btn-ghost">Log In</Link>
                    <Link to="/app" className="btn btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero container">
                <div className="hero-content">
                    <div className="badge">
                        <Sparkles size={16} /> <span>Virtual Try-On Meets Generative AI</span>
                    </div>
                    <h1>Transform Your Photos with <br /> <span className="text-gradient">Next-Gen AI Magic</span></h1>
                    <p className="hero-subtitle">
                        Create realistic images of your clothes worn by anyone. Virtual try-on, AI model generation, and model swapping in one seamless workspace.
                    </p>
                    <div className="hero-cta">
                        <Link to="/editor" className="btn btn-primary btn-lg">
                            <Upload size={18} />
                            Try Editor for Free
                        </Link>
                        <a href="#demo" className="btn btn-secondary btn-lg">
                            Watch Demo
                        </a>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value text-gradient">99%</span>
                            <span className="stat-label">Try-On Accuracy</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value text-gradient">10x</span>
                            <span className="stat-label">Faster Photoshoots</span>
                        </div>
                    </div>
                </div>

                {/* Restored Dynamic Visual Mockup */}
                <div className="hero-visual">
                    <div className="glass-panel image-comparison-mockup">
                        <div className="mockup-header">
                            <div className="dots"><span></span><span></span><span></span></div>
                        </div>
                        <div className="mockup-body">
                            <div className="img-original">Product</div>
                            <div className="img-result">AI Model</div>
                            <div className="slider-line"></div>
                            <div className="slider-handle"><Zap size={14} /></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Kept Fashn.ai tools but in AuraStudio style */}
            <section id="features" className="features container">
                <div className="section-header">
                    <h2>Everything you need for <span className="text-gradient">Professional Fashion</span></h2>
                    <p>Powerful generative AI tools designed for creators and brands.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card glass-panel">
                        <div className="feature-icon"><Layers /></div>
                        <h3>Product to Model</h3>
                        <p>From flat-lay to model, give your products the presentation they deserve. Create realistic on-model photos in seconds.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <div className="feature-icon"><RefreshCw /></div>
                        <h3>Model Swap</h3>
                        <p>Change the model to fit your brand's audience. Swap the person, and your product remains perfectly preserved.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <div className="feature-icon"><Shirt /></div>
                        <h3>Virtual Try-On</h3>
                        <p>Produce scalable PDP content. Our AI clothes changer lets you swap clothes on model photos without re-shooting.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <div className="feature-icon"><UserCircle /></div>
                        <h3>Consistent Models</h3>
                        <p>Experience best-in-class model consistency features. Create a recognizable face and reuse it across all imagery.</p>
                    </div>
                </div>
            </section>

            {/* Footer minimal */}
            <footer className="footer container">
                <div className="footer-content">
                    <div className="logo">
                        <Wand2 className="logo-icon size-sm" />
                        <span className="logo-text">AuraStudio</span>
                    </div>
                    <p>© 2026 AuraStudio AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
