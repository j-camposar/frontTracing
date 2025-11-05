import React, { useState,useEffect  } from 'react';

export default function App() {
   const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // 🔄 Cargar usuarios al iniciar
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("http://node-app:3001/users");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://node-app:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(`✅ ${data.message}`);
        setFormData({ username: "", email: "", password: "" });

        // 🔄 Actualizar lista inmediatamente
        obtenerUsuarios();
      } else {
        setMensaje(`❌ ${data.error}: ${data.details}`);
      }
    } catch (error) {
      setMensaje(`⚠️ Error de conexión: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Registro de Usuario</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Registrar
        </button>
      </form>

      {mensaje && <p style={{ marginTop: 15 }}>{mensaje}</p>}

      <h3 style={{ marginTop: 30 }}>👥 Usuarios registrados</h3>
      <table border="1" width="100%" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Sin usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}