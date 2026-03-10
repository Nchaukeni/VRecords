import { useAuth } from "../../context/AuthContext";


export default function Login() {
  const { login, members } = useAuth(); // useAuth is a custom hook; it returns useContext(AuthContext)
  const user1 = members.find(member => member.role === "chairperson");
  const user2 = members.find(member => member.role === "treasurer");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>VRecords Login (Mock)</h2>

      <button onClick={() => login(user1)}>
        Login as Chairperson
      </button>

      <button
        style={{ marginLeft: "1rem" }}
        onClick={() => login(user2)}
      >
        Login as Treasurer
      </button>
    </div>
  );
}
