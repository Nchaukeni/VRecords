import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";

export default function Login() {
  const { login } = useAuth(); // useAuth is a custom hook; it returns useContext(AuthContext)

  return (
    <div style={{ padding: "2rem" }}>
      <h2>VRecords Login (Mock)</h2>

      <button onClick={() => login(ROLES.CHAIRPERSON)}>
        Login as Chairperson
      </button>

      <button
        style={{ marginLeft: "1rem" }}
        onClick={() => login(ROLES.TREASURER)}
      >
        Login as Treasurer
      </button>
    </div>
  );
}
