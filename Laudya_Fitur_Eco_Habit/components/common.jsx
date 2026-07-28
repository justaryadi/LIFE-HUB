import React, { useEffect, useState } from 'react';
import { navigate } from '../utils/hooks.js';
import { getCharacter, getGamification, getProfile, getNotifications, clearNotifications, resetLifehubData, saveCharacterAndProfile, labelFromId, LIFEHUB_KEYS } from '../utils/core.js';

const svgPaths = {
  'layout-dashboard': 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
  'check-square': 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  repeat: 'M17 1l4 4-4 4 M3 11V9a4 4 0 0 1 4-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 0 1-4 4H3',
  timer: 'M10 2h4 M12 14l4-4 M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  leaf: 'M11 20A7 7 0 0 1 4 13c0-6 8-10 16-9-1 8-5 16-11 16Z M4 13c4 0 7 2 8 7',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M9 14l-1 8 4-2 4 2-1-8',
  search: 'M21 21l-4.3-4.3 M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
  x: 'M18 6 6 18 M6 6l12 12',
  sparkles: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z M5 3v4 M3 5h4 M19 17v4 M17 19h4',
  zap: 'M13 2 3 14h8l-1 8 10-12h-8l1-8Z',
  flame: 'M12 22c4 0 7-3 7-7 0-4-3-7-4-10 0 4-3 5-3 8-2-1-3-3-2-6-3 2-5 5-5 9 0 4 3 6 7 6Z',
  coins: 'M12 6c4 0 7-1 7-3s-3-3-7-3-7 1-7 3 3 3 7 3Z M5 3v12c0 2 3 3 7 3s7-1 7-3V3 M5 9c0 2 3 3 7 3s7-1 7-3 M5 15c0 2 3 3 7 3s7-1 7-3'
};
export function Icon({name}){
  const d = svgPaths[name];
  if(!d) return <i className="lh-icon" aria-hidden="true">{name || '•'}</i>;
  return <svg className="lh-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d}/></svg>;
}

export function Link({to, children, className='', ...props}){
  if(!to) return <a className={className} {...props}>{children}</a>;
  if(to.startsWith('#')) return <a href={to} className={className} {...props}>{children}</a>;
  const clean = to.replace('index.html','/').replace('pages/','/').replace('.html','').replace(/^\.\//,'/');
  return <a href={clean} className={className} onClick={(e)=>{e.preventDefault(); navigate(clean);}} {...props}>{children}</a>;
}

export function FeatureNavbar({active}){
  const items = [
    ['dashboard','layout-dashboard','Dashboard','/dashboard'],
    ['quest','check-square','Quest','/quest'],
    ['habit','repeat','Habit','/habit'],
    ['pomodoro','timer','Pomodoro','/pomodoro'],
    ['eco','leaf','Eco','/eco'],
    ['achievement','award','Achievement','/achievement']
  ];
  return <nav className="feature-navbar"><div className="nav-pill">{items.map(([key,icon,label,to])=><Link key={key} to={to} className={active===key?'active':''}><Icon name={icon}/><span>{label}</span></Link>)}</div></nav>;
}

export function LandingNavbar(){
  return <nav className="navbar"><div className="logo">LIFEHUB</div><div className="nav-links"><Link to="/">Home</Link><Link to="/about">About</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></nav>;
}

export function Avatar({size='large', character}){
  const c = character || getCharacter();
  return <div className={`lifehub-avatar lifehub-avatar-${size}`} data-skin={c.skin} data-hair={c.hair} data-outfit={c.outfit} data-equipment={c.equipment} data-accessory={c.accessory}>
    <span className="avatar-glow"></span>
    <span className="avatar-symbol avatar-symbol-left">✨</span>
    <span className="avatar-symbol avatar-symbol-right">🌱</span>
    <div className="avatar-person"><div className="avatar-hair"></div><div className="avatar-head"><span></span></div><div className="avatar-neck"></div><div className="avatar-body"></div><div className="avatar-arm left"></div><div className="avatar-arm right"></div><div className="avatar-leg left"></div><div className="avatar-leg right"></div><div className="avatar-equipment"></div><div className="avatar-accessory"></div></div>
  </div>;
}

export function RewardToast(){
  const [reward,setReward] = useState(null);
  useEffect(()=>{
    const handler = (e) => { setReward(e.detail); clearTimeout(window.__lifehubRewardTimeout); window.__lifehubRewardTimeout=setTimeout(()=>setReward(null),2600); };
    window.addEventListener('lifehub:reward', handler);
    return () => window.removeEventListener('lifehub:reward', handler);
  },[]);
  const text = reward ? [`+${reward.xp||0} XP`, `+${reward.coins||0} Coins`, reward.ecoPoints?`+${reward.ecoPoints} Eco`:null].filter(Boolean).join(' • ') : '';
  return <div className={`reward-toast ${reward?'show':''}`}><div className="reward-burst">✨</div><div><h4>Reward Earned</h4><p>{text}</p></div></div>;
}

export function NotificationModal({open,onClose}){
  const [items,setItems] = useState(()=>getNotifications());
  useEffect(()=>{ const sync=()=>setItems(getNotifications()); window.addEventListener('lifehub:data',sync); return()=>window.removeEventListener('lifehub:data',sync); },[]);
  if(!open) return null;
  return <div className="notification-modal show"><div className="notification-box"><div className="notification-header"><div><p className="panel-label">Activity</p><h3>Notification Center</h3></div><button className="modal-close" onClick={onClose}>×</button></div><div className="notification-list">{items.length?items.map((n,i)=><div className="notification-item" key={i}><h4>{n.message}</h4><p>{n.time || n.createdAt}</p></div>):<div className="empty-notification"><h4>No notifications yet</h4><p>Your LIFEHUB activity will appear here.</p></div>}</div><button className="secondary-btn full-btn" onClick={()=>{clearNotifications(); setItems([]);}}>Clear Notifications</button></div></div>;
}

export function CharacterBuilder({onDone}){
  const [character,setCharacter] = useState(()=>getCharacter());
  const [profile,setProfile] = useState(()=>getProfile());
  const update = (key,value)=>setCharacter(prev=>({...prev,[key]:value}));
  const submit = (e)=>{ e.preventDefault(); saveCharacterAndProfile(character, { role:profile.role || 'Explorer' }); onDone?.(); };
  return <form className="dashboard-character-builder show" onSubmit={submit}>
    <p className="panel-label">Create Character</p>
    <h3>Build your LIFEHUB avatar.</h3>
    <p className="builder-note">Choose a look that represents your productivity journey.</p>
    <div className="dashboard-character-builder-grid">
      <div className="character-builder-preview-large"><Avatar size="medium" character={character}/></div>
      <div className="character-builder-fields">
        <label>Character Name<input value={character.name} onChange={e=>update('name',e.target.value)} placeholder="Character name" /></label>
        <label>Role<input value={profile.role} onChange={e=>setProfile({...profile,role:e.target.value})} placeholder="Role" /></label>
        <label>Skin Tone<select value={character.skin} onChange={e=>update('skin',e.target.value)}><option value="fair">Fair Skin</option><option value="warm">Warm Skin</option><option value="deep">Deep Skin</option><option value="night-skin">Night Skin</option><option value="aurora-skin">Aurora Skin</option></select></label>
        <label>Hair Color<select value={character.hair} onChange={e=>update('hair',e.target.value)}><option value="navy">Navy Hair</option><option value="mint">Mint Hair</option><option value="dark">Dark Hair</option></select></label>
        <label>Outfit<select value={character.outfit} onChange={e=>update('outfit',e.target.value)}><option value="starter-hoodie">Starter Hoodie</option><option value="mint-hoodie">Mint Hoodie</option><option value="mint-jacket">Mint Jacket</option><option value="night-coat">Night Coat</option></select></label>
        <label>Equipment<select value={character.equipment} onChange={e=>update('equipment',e.target.value)}><option value="none">No Equipment</option><option value="focus-headset">Focus Headset</option><option value="eco-backpack">Eco Backpack</option></select></label>
        <label>Accessory<select value={character.accessory} onChange={e=>update('accessory',e.target.value)}><option value="none">No Accessory</option><option value="solar-watch">Solar Watch</option></select></label>
        <div className="character-builder-actions"><button className="primary-btn full-btn" type="submit">Save Character</button></div>
      </div>
    </div>
  </form>;
}

export function CharacterPromptModal(){
  const [show,setShow] = useState(()=> localStorage.getItem(LIFEHUB_KEYS.promptSeen) !== 'true');
  const [builder,setBuilder] = useState(false);
  if(!show) return null;
  return <div className="character-startup-modal show"><div className="character-startup-box">
    <button className="character-modal-close" onClick={()=>{localStorage.setItem(LIFEHUB_KEYS.promptSeen,'true'); setShow(false);}}>×</button>
    {!builder ? <div className="character-startup-intro"><p className="panel-label">Welcome to LIFEHUB</p><h3>Choose your character setup.</h3><p>Continue as Jake or create a new character before starting your dashboard.</p><div className="character-startup-preview"><Avatar size="medium"/><div><h4>Jake</h4><span>Level 1 Explorer • Starter Hoodie</span></div></div><div className="character-startup-actions"><button className="primary-btn" onClick={()=>{localStorage.setItem(LIFEHUB_KEYS.promptSeen,'true'); setShow(false);}}>Continue as Jake</button><button className="secondary-btn" onClick={()=>setBuilder(true)}>Create New Character</button></div></div> : <CharacterBuilder onDone={()=>setShow(false)}/>}  
  </div></div>;
}

export function ProfileSplit({open,onClose,onNewQuest,onReset}){
  const profile=getProfile(), game=getGamification(), character=getCharacter();
  const xpBase=(game.level-1)*150, xpNow=game.xp-xpBase, pct=Math.min(100,(xpNow/150)*100);
  return <><div className={`profile-split-backdrop ${open?'show':''}`} onClick={onClose}></div><aside className={`profile-split-panel ${open?'show':''}`} aria-hidden={!open}><div className="profile-split-top"><div><p className="panel-label">Profile</p><h3>Quick Character</h3></div><button className="modal-close" onClick={onClose}>×</button></div><div className="profile-split-avatar"><Avatar size="medium" character={character}/></div><div className="profile-split-info"><h2>{profile.name}</h2><p>Level {game.level} {profile.role}</p><div className="profile-split-xp"><div className="profile-split-xp-top"><span>EXP</span><strong>{xpNow} / 150 XP</strong></div><div className="profile-split-xp-bar"><i style={{width:`${pct}%`}}></i></div></div><div className="profile-split-stats"><div><strong>{game.coins}</strong><span>Coins</span></div><div><strong>{game.ecoPoints}</strong><span>Eco</span></div><div><strong>{game.focusSessions}</strong><span>Focus</span></div></div></div><Link to="/profile" className="primary-btn full-btn profile-split-view">View Profile</Link><div className="profile-split-actions"><button className="secondary-btn full-btn" onClick={onNewQuest}>+ New Quest</button></div><div className="profile-split-danger"><button className="danger-btn full-btn" onClick={onReset}>Reset Demo</button></div><p className="builder-note">Loadout: {labelFromId(character.outfit)} • {labelFromId(character.equipment)}</p></aside></>;
}

export function ConfirmResetModal({open,onClose}){
  if(!open) return null;
  return <div className="reset-modal show"><div className="reset-modal-box"><div className="reset-icon">⚠️</div><h3>Reset LIFEHUB Progress?</h3><p>This will remove all saved quests, XP, streaks, eco points, and achievements from this browser.</p><div className="reset-actions"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="danger-btn" onClick={()=>{resetLifehubData(); localStorage.removeItem(LIFEHUB_KEYS.promptSeen); onClose();}}>Yes, Reset</button></div></div></div>;
}
