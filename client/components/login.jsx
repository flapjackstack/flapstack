import React from "react";

/**
 * COMPONENT
 */
const Login = _ => {
  return (
    <div style={{ margin: "auto", marginTop: "150px", width: "50%", textAlign: "center" }}>
      <img src="/Pancake.png" width="auto" height="200px" />
      <br />
      <br />
      <div style={{ margin: "auto", width: "50%", textAlign: "center", display: "inline" }}>
        <button className="ui github button" style={{ backgroundColor: "#0E8DEC" }}>
          <i className="github icon" />
          <a style={{ color: "#ffffff" }} href="/auth/github">
            Login As Regular User
          </a>
        </button>
        <button className="ui github button" style={{ backgroundColor: "#00cc00" }}>
          <i className="github icon" />
          <a style={{ color: "#ffffff" }} href="/auth/github/demo">
            Login As Demo User
          </a>
        </button>
      </div>
    </div>
  );
};

export default Login;
