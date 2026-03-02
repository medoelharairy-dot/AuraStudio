import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    Layers, RefreshCw, Shirt, UserCircle, Download,
    ChevronLeft, ZoomIn, ZoomOut, UploadCloud, SlidersHorizontal, Loader2
} from 'lucide-react'
import './EditorWorkspace.css'

const EditorWorkspace = () => {
    const [activeTool, setActiveTool] = useState('try-on'); // Defaulting to try-on for testing
    const [isProcessing, setIsProcessing] = useState(false);

    // Real State for Virtual Try-On
    const [personImage, setPersonImage] = useState(null);
    const [personPreview, setPersonPreview] = useState(null);
    const [garmentImage, setGarmentImage] = useState(null);
    const [garmentPreview, setGarmentPreview] = useState(null);
    const [resultImage, setResultImage] = useState(null);

    const personInputRef = useRef(null);
    const garmentInputRef = useRef(null);

    const tools = [
        { id: 'product-to-model', icon: Layers, label: 'Product to Model' },
        { id: 'model-swap', icon: RefreshCw, label: 'Model Swap' },
        { id: 'try-on', icon: Shirt, label: 'Virtual Try-On' },
        { id: 'consistent', icon: UserCircle, label: 'Consistent Models' },
    ];

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        if (type === 'person') {
            setPersonImage(file);
            setPersonPreview(url);
        } else if (type === 'garment') {
            setGarmentImage(file);
            setGarmentPreview(url);
        }
    };

    const executeTryOn = async () => {
        if (!personImage || !garmentImage) {
            alert("Please upload both a model image and a garment image.");
            return;
        }

        setIsProcessing(true);

        // Create form data to send to our Python Backend
        const formData = new FormData();
        formData.append('background_image', personImage);
        formData.append('garment_image', garmentImage);
        formData.append('garment_description', 'High quality fashion');

        try {
            // Use Environment Variable for Production (Cloudflare) or Localhost
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

            const response = await fetch(`${API_BASE_URL}/api/try-on`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success && data.image) {
                setResultImage(data.image); // The base64 returned from python
            } else {
                alert("Error generating image: " + JSON.stringify(data));
            }
        } catch (error) {
            console.error("API Call Failed:", error);
            alert("Failed to connect to Python backend. Is it running on port 8000?");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="editor-layout">
            {/* Top Header */}
            <header className="editor-header">
                <div className="header-left">
                    <Link to="/app" className="btn-icon">
                        <ChevronLeft size={18} />
                    </Link>
                    <div className="project-title">
                        <h3>Untitled Project</h3>
                        <span className="status-badge">Draft</span>
                    </div>
                </div>

                <div className="header-center">
                    <div className="zoom-controls">
                        <button className="btn-icon-minimal"><ZoomOut size={16} /></button>
                        <span className="zoom-level">100%</span>
                        <button className="btn-icon-minimal"><ZoomIn size={16} /></button>
                    </div>
                </div>

                <div className="header-right">
                    <button className="btn btn-secondary text-sm">Save</button>
                    <button className="btn btn-primary text-sm">
                        <Download size={14} /> Export
                    </button>
                </div>
            </header>

            <div className="editor-main">
                {/* Left Sidebar (Tools) */}
                <aside className="editor-sidebar-left">
                    <div className="tools-list">
                        {tools.map(tool => (
                            <button
                                key={tool.id}
                                className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                                onClick={() => setActiveTool(tool.id)}
                                title={tool.label}
                            >
                                <div className="tool-icon-wrapper">
                                    <tool.icon size={20} strokeWidth={1.5} />
                                </div>
                                <span>{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Center Canvas */}
                <main className="editor-canvas-area">
                    <div className="canvas-wrapper">
                        {(personPreview || resultImage) ? (
                            <div className="studio-canvas">
                                <img src={resultImage || personPreview} alt="Canvas" className="canvas-image" />

                                {isProcessing && (
                                    <div className="ai-overlay-box processing-blur" style={{ top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}>
                                        <div className="ai-label flex-center-gap">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Generating AI Try-On (IDM-VTON)</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-canvas">
                                <div className="upload-circle">
                                    <UploadCloud size={32} />
                                </div>
                                <h3>Start by uploading a Person/Model Image</h3>
                                <p className="text-soft">Supports JPG, PNG, WEBP</p>
                                <button className="btn btn-primary mt-md" onClick={() => personInputRef.current?.click()}>Browse Files</button>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar (Properties) */}
                <aside className="editor-sidebar-right">
                    <div className="properties-header">
                        <h4><SlidersHorizontal size={14} /> Settings</h4>
                    </div>

                    <div className="properties-content">

                        {/* VIRTUAL TRY-ON (Fully Functional Demo) */}
                        {activeTool === 'try-on' && (
                            <div className="tool-panel">
                                <input type="file" ref={personInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'person')} />
                                <input type="file" ref={garmentInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'garment')} />

                                <div className="form-group">
                                    <label>1. Source Model (Person)</label>
                                    <div className="upload-box min-h" onClick={() => personInputRef.current?.click()}>
                                        {personPreview ? (
                                            <div className="preview-thumb"><img src={personPreview} alt="" /></div>
                                        ) : (
                                            <>
                                                <UploadCloud size={20} />
                                                <span>Upload person photo</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group pt-sm">
                                    <label>2. Garment to Try On</label>
                                    <div className="upload-box min-h" onClick={() => garmentInputRef.current?.click()}>
                                        {garmentPreview ? (
                                            <div className="preview-thumb"><img src={garmentPreview} alt="" /></div>
                                        ) : (
                                            <>
                                                <UploadCloud size={20} />
                                                <span>Upload clothing item</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary w-full mt-lg"
                                    onClick={executeTryOn}
                                    disabled={!personImage || !garmentImage || isProcessing}
                                >
                                    {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : 'Execute Try-On'}
                                </button>

                                <p className="text-xs text-soft mt-sm text-center">Connected to Hugging Face IDM-VTON Space. May take 30-60s on free tier.</p>
                            </div>
                        )}

                        {/* Placeholder for other tools to keep code concise */}
                        {activeTool !== 'try-on' && (
                            <div className="tool-panel">
                                <p className="text-soft text-sm">Select "Virtual Try-On" to test the live AI Backend connection.</p>
                            </div>
                        )}

                    </div>
                </aside>
            </div>
        </div>
    )
}

export default EditorWorkspace
