export default function ToastList({ notifications }) {
    return (
        <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            pointerEvents: "none"
        }}>
            {notifications.map((n) => (
                <div key={n.id} style={{
                    background: "#333",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    borderLeft: "4px solid #4CAF50",
                    fontWeight: "bold",
                    fontSize: "14px",
                    fontFamily: "sans-serif",
                    minWidth: "250px",
                    pointerEvents: "auto"
                }}>
                    {n.message}
                </div>
            ))}
        </div>
    );
}
