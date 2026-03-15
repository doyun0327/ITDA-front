import React, { useState, useEffect } from "react";
import axios from "axios";
import SignupWithSocial from "./components/SignupWithSocial";
import Header from "./components/Header"; // 만든 헤더 불러오기

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 백엔드에 로그인 세션 확인 요청!!!!!
    axios
      .get("http://localhost:8080/api/user/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>로딩 중...</div>
    );

  return (
  <div>
    {user ? (
      <>
        <Header user={user} />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>🎉 환영합니다!</h2>

          <p style={{ fontSize: "18px", color: "#555" }}>
            {/* 1. 카카오 로그인인 경우 (properties.nickname 존재) */}
            {user.properties?.nickname ? (
              <>
                <strong>{user.properties.nickname}</strong>님 (카카오 계정)
              </>
            ) : (
              /* 2. 일반 이메일 로그인인 경우 */
              <>
                <strong>{user.email || user.username}</strong>님 (이메일 계정)
              </>
            )}
            으로 로그인되었습니다.
          </p>

          <p>이제 ITDA 서비스를 마음껏 이용해 보세요. 🐱✨</p>
        </div>
      </>
    ) : (
      <SignupWithSocial />
    )}
  </div>
  );
}

export default App;
