import React, { useState } from "react";
import axios from "axios";

export default function SignupWithSocial() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    authCode: "",
  });

  const [isEmailSent, setIsEmailSent] = useState(false); // 인증번호 발송 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 인증 완료 여부

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. 이메일 인증번호 발송
  const sendCode = async () => {
    if (!formData.email) return alert("이메일을 입력해주세요.");
    try {
      await axios.post("http://localhost:8080/api/auth/email/send", {
        email: formData.email,
      });
      alert("인증번호가 발송되었습니다. 메일함을 확인해주세요!");
      setIsEmailSent(true);
    } catch (err) {
      alert("메일 발송 실패: " + err.response?.data?.message || "서버 에러");
    }
  };

  // 2. 인증번호 확인
  const verifyCode = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/email/verify",
        {
          email: formData.email,
          code: formData.authCode,
        },
      );
      if (res.data.success) {
        alert("인증에 성공했습니다!");
        setIsEmailVerified(true);
      }
    } catch (err) {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  // 3. 최종 회원가입
  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. 유효성 검사
    if (!isEmailVerified) return alert("이메일 인증을 먼저 완료해주세요.");
    if (formData.password !== formData.confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    try {
      // 버튼 비활성화나 로딩 표시를 추가하면 더 좋습니다.
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          email: formData.email,
          password: formData.password,
          // confirmPassword나 authCode는 백엔드 저장 시 필요 없으므로 빼고 보내도 됩니다.
        },
      );

      if (response.status === 200 || response.status === 201) {
        // 가입 직후 로그인 API 호출로 세션 생성 (카카오 로그인처럼 바로 로그인된 상태로)
        try {
          await axios.post(
            "http://localhost:8080/api/auth/login",
            {
              email: formData.email,
              password: formData.password,
            },
            { withCredentials: true }
          );
          alert("🎉 회원가입이 완료되었습니다!");
          window.location.href = "/";
        } catch (loginErr) {
          // 로그인 API가 없거나 실패하면 그냥 메인으로 (백엔드가 가입 시 세션을 넣어줬을 수 있음)
          alert("🎉 회원가입이 완료되었습니다! 로그인해 주세요.");
          window.location.href = "/";
        }
      }
    } catch (err) {
      // 백엔드에서 보낸 에러 메시지가 있다면 출력, 없으면 기본 메시지
      const errMsg =
        err.response?.data?.message || "서버 오류로 가입에 실패했습니다.";
      alert("가입 실패: " + errMsg);
    }
  };

  return (
    <div style={styles.card}>
      <h2>ITDA 회원가입</h2>

      <form onSubmit={handleSignup} style={styles.form}>
        {/* 이메일 입력 및 인증번호 발송 */}
        <div style={styles.row}>
          <input
            name="email"
            placeholder="이메일 주소"
            onChange={handleChange}
            style={styles.input}
            disabled={isEmailVerified}
          />
          <button type="button" onClick={sendCode} style={styles.subBtn}>
            {isEmailSent ? "재발송" : "번호 발송"}
          </button>
        </div>

        {/* 인증번호 입력 칸 (발송 후에만 보임) */}
        {isEmailSent && !isEmailVerified && (
          <div style={styles.row}>
            <input
              name="authCode"
              placeholder="인증번호 6자리"
              onChange={handleChange}
              style={styles.input}
            />
            <button type="button" onClick={verifyCode} style={styles.subBtn}>
              확인
            </button>
          </div>
        )}
        {isEmailVerified && (
          <p style={{ color: "green", fontSize: "12px" }}>
            ✅ 인증이 완료되었습니다.
          </p>
        )}

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          onChange={handleChange}
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.mainBtn}
          disabled={!isEmailVerified}
        >
          가입하기
        </button>
      </form>

      <div style={styles.divider}>또는</div>
      <button
        onClick={() =>
          (window.location.href =
            "http://localhost:8080/oauth2/authorization/kakao")
        }
        style={styles.kakaoBtn}
      >
        카카오로 시작하기
      </button>
    </div>
  );
}

const styles = {
  card: {
    width: "380px",
    margin: "100px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  row: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  subBtn: {
    padding: "10px",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "5px",
  },
  mainBtn: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  kakaoBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#FEE500",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  divider: { margin: "20px 0", color: "#999", fontSize: "14px" },
};
