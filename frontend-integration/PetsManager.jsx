// Salin ke: src/components/PetsManager.jsx (frontend)
// Memakai PetForm, PetCard, dan Summary yang sudah ada tanpa mengubahnya.
import { useEffect, useState } from "react";
import PetForm from "./PetForm";
import PetCard from "./PetCard";
import Summary from "./Summary";
import { createPet, deletePet, getPets, updatePet } from "../services/api";

const inputStyle = { padding: "0.4rem", width: "100%", boxSizing: "border-box", marginBottom: "0.4rem" };
const btnStyle = (bg) => ({ padding: "0.35rem 0.8rem", backgroundColor: bg, color: "white", border: "none", borderRadius: "4px", cursor: "pointer" });

export default function PetsManager() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ nama: "", jenis: "", umur: "" });

  // READ: ambil daftar hewan saat komponen pertama kali tampil
  useEffect(() => {
    let active = true;
    getPets()
      .then((data) => {
        if (active) setPets(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // CREATE
  const handleAddPet = async (newPet) => {
    try {
      const created = await createPet(newPet);
      setPets((current) => [...current, created]);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // UPDATE
  const startEdit = (pet) => {
    setEditingId(pet.id);
    setDraft({ nama: pet.nama, jenis: pet.jenis, umur: String(pet.umur) });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await updatePet(id, {
        nama: draft.nama,
        jenis: draft.jenis,
        umur: Number(draft.umur),
      });
      setPets((current) => current.map((pet) => (pet.id === id ? updated : pet)));
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // DELETE
  const handleDelete = async (pet) => {
    if (!window.confirm(`Hapus ${pet.nama} dari daftar?`)) return;
    try {
      await deletePet(pet.id);
      setPets((current) => current.filter((item) => item.id !== pet.id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="container section-block">
      <h2 className="text-headline-md">Kelola Data Hewan</h2>
      <PetForm onAddPet={handleAddPet} />

      {error && (
        <p role="alert" style={{ color: "#b3261e", margin: "0.5rem 0" }}>
          {error}
        </p>
      )}

      <Summary totalItems={pets.length} />

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {pets.map((pet) =>
            editingId === pet.id ? (
              <div key={pet.id} style={{ width: "220px", padding: "1rem", borderRadius: "8px", backgroundColor: "#fff" }}>
                <input style={inputStyle} value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} placeholder="Nama" />
                <input style={inputStyle} value={draft.jenis} onChange={(e) => setDraft({ ...draft, jenis: e.target.value })} placeholder="Jenis" />
                <input style={inputStyle} type="number" value={draft.umur} onChange={(e) => setDraft({ ...draft, umur: e.target.value })} placeholder="Umur (bulan)" />
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button type="button" style={btnStyle("#4A7C59")} onClick={() => saveEdit(pet.id)}>Simpan</button>
                  <button type="button" style={btnStyle("#777")} onClick={() => setEditingId(null)}>Batal</button>
                </div>
              </div>
            ) : (
              <div key={pet.id}>
                <PetCard item={pet} />
                <div style={{ display: "flex", gap: "0.4rem", padding: "0 1rem 1rem" }}>
                  <button type="button" style={btnStyle("#3b6ea5")} onClick={() => startEdit(pet)}>Ubah</button>
                  <button type="button" style={btnStyle("#b3261e")} onClick={() => handleDelete(pet)}>Hapus</button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
