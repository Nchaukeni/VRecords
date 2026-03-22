import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/VRecords Images/Print.svg";
import "../../styles/LoginStyles.css"

const Login = () => {
  const { login, members } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = members.find(
      m => m.email === form.email && m.password === form.password
    );

    if (user) {
      login(user);
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">

        {/* LEFT SIDE (LOGO FULL DISPLAY) */}
        <div className="col-md-6 d-flex justify-content-center align-items-center vrecords-left">
          <img
            src={img1}
            alt="VRecords logo"
            className="img-fluid"
            style={{ maxWidth: "80%" }}
          />
        </div>

        {/* RIGHT SIDE (LOGIN FORM) */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">

          <form className="login-card" onSubmit={handleSubmit}>
            <h3 className="mb-4 text-center">Welcome Back</h3>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-vrecords w-100">
              Login
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default Login;