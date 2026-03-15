import React from "react";

export default function Header({ user }) {
  const handleLogout = () => {
    // 백엔드 로그아웃 경로로 이동 (세션 파기)
    window.location.href = "http://localhost:8080/logout";
  };

  return (
    <header style={styles.nav}>
      <h1 style={styles.logo}>ITDA</h1>
      <div style={styles.userBox}>
        {/* 프로필 이미지가 없을 경우 기본 이미지 처리 */}
        <img
          src={
            user.properties?.profile_image || "https://via.placeholder.com/40"
          }
          alt="profile"
          style={styles.avatar}
        />
        <span style={styles.username}>
          {user.properties?.nickname || user.email || user.username}님
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          로그아웃
        </button>
      </div>
    </header>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 40px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  logo: { fontSize: "22px", color: "#007bff", fontWeight: "bold" },
  userBox: { display: "flex", alignItems: "center", gap: "15px" },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  username: { fontSize: "15px", fontWeight: "600", color: "#333" },
  logoutBtn: {
    padding: "5px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
};
