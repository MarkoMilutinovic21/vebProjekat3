import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createShareToken } from "../services/shareService";

function ShareModal({ planId, onClose }) {
    const [accessType, setAccessType] = useState("VIEW");
    const [token, setToken] = useState(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCreate = async () => {
        try {
            const expiresAt = new Date();
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            const result = await createShareToken({
                accessType,
                travelPlanId: planId,
                expiresAt: expiresAt.toISOString()
            });
            setToken(result.token);
        } catch (err) {
            setError("Failed to create share token.");
        }
    };

    const shareUrl = `${window.location.origin}/shared/${token}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                padding: "30px",
                borderRadius: "8px",
                width: "400px",
                maxWidth: "90%",
                boxShadow: "var(--shadow)"
            }}>
                <h3 style={{ marginBottom: "16px" }}>Share Travel Plan</h3>
                <div style={{ marginBottom: "15px" }}>
                    <label>Access Type</label>
                    <select value={accessType} onChange={e => setAccessType(e.target.value)} style={{ marginTop: "4px" }}>
                        <option value="VIEW">VIEW — Read only</option>
                        <option value="EDIT">EDIT — Can edit</option>
                    </select>
                </div>
                <button onClick={handleCreate} style={{ width: "100%", marginBottom: "15px" }}>
                    Generate QR Code
                </button>
                {token && (
                    <div style={{ textAlign: "center", marginTop: "15px" }}>
                        <div style={{ background: "white", padding: "16px", borderRadius: "8px", display: "inline-block" }}>
                            <QRCodeSVG value={shareUrl} size={180} />
                        </div>
                        <p style={{ wordBreak: "break-all", fontSize: "12px", marginTop: "10px", color: "var(--text)" }}>{shareUrl}</p>
                        <button onClick={handleCopy} style={{ marginTop: "10px", width: "100%", background: copied ? "#22c55e" : "var(--accent)" }}>
                            {copied ? "Copied!" : "Copy URL"}
                        </button>
                    </div>
                )}
                {error && <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>}
                <button onClick={onClose} className="secondary" style={{ marginTop: "12px", width: "100%" }}>Close</button>
            </div>
        </div>
    );
}

export default ShareModal;