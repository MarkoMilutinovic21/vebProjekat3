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
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "white",
                padding: "30px",
                borderRadius: "8px",
                width: "400px",
                maxWidth: "90%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}>
                <h3>Share Travel Plan</h3>
                <div style={{ marginBottom: "15px" }}>
                    <label>Access Type: </label>
                    <select value={accessType} onChange={e => setAccessType(e.target.value)} style={{ marginLeft: "10px" }}>
                        <option value="VIEW">VIEW</option>
                        <option value="EDIT">EDIT</option>
                    </select>
                </div>
                <button onClick={handleCreate} style={{ marginBottom: "15px" }}>Generate QR Code</button>
                {token && (
                    <div style={{ textAlign: "center", marginTop: "15px" }}>
                        <QRCodeSVG value={shareUrl} size={200} />
                        <p style={{ wordBreak: "break-all", fontSize: "12px", marginTop: "10px" }}>{shareUrl}</p>
                        <button onClick={handleCopy} style={{ marginTop: "10px", width: "100%" }}>
                            {copied ? "Copied!" : "Copy URL"}
                        </button>
                    </div>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button onClick={onClose} style={{ marginTop: "15px", width: "100%" }}>Close</button>
            </div>
        </div>
    );
}

export default ShareModal;