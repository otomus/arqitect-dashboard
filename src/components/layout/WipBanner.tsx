const WIP_BANNER_HEIGHT = 40;

const bannerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 9998,
  textAlign: "center",
  padding: "0.6rem 1rem",
  fontFamily: "Orbitron, sans-serif",
  fontSize: "0.85rem",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.25em",
  color: "#000",
  background:
    "repeating-linear-gradient(-45deg, #ff9500, #ff9500 10px, #ff6a00 10px, #ff6a00 20px)",
  boxShadow: "0 4px 20px rgba(255, 106, 0, 0.6)",
  animation: "ribbon-pulse 2s ease-in-out infinite",
};

/** Height of the WIP banner so other fixed elements can offset below it. */
export { WIP_BANNER_HEIGHT };

/** Orange construction-stripe banner matching the arqitect-community site. */
export function WipBanner(): React.ReactElement {
  return <div style={bannerStyle}>Work in progress — coming soon</div>;
}
