export default function ProfileTab({ profile, setProfile, profileImage, setProfileImage }) {
  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>👤 Mi Perfil</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: profileImage ? 'none' : '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 700, overflow: 'hidden', position: 'relative' }}>
          {profileImage ? <img src={profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profile.name?.charAt(0)?.toUpperCase() || 'U')}
        </div>
        <div>
          <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { setProfileImage(ev.target.result); localStorage.setItem('buyer_avatar', ev.target.result); }; reader.readAsDataURL(file); } }} style={{ display: 'none' }} id="avatarUpload" />
          <button onClick={() => document.getElementById('avatarUpload').click()} style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>📷 Cambiar foto</button>
          {profileImage && <button onClick={() => { setProfileImage(''); localStorage.removeItem('buyer_avatar'); }} style={{ marginLeft: 8, padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🗑️ Quitar</button>}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 16, maxWidth: 500 }}>
        <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Nombre</label><input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></div>
        <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Email</label><input value={profile.email} disabled style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#f9fafb', boxSizing: 'border-box' }} /></div>
        <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Teléfono</label><input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="+34 600 000 000" /></div>
        <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Dirección</label><input value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="Calle, Ciudad" /></div>
        <button style={{ padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>💾 Guardar cambios</button>
      </div>
    </div>
  );
}
