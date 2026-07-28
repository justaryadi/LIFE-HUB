export const LIFEHUB_KEYS = {
  tasks: 'lifehubTasks', habits: 'lifehubHabits', eco: 'lifehubEcoQuests',
  gamification: 'lifehubGamification', profile: 'lifehubProfile', pomodoro: 'lifehubPomodoroSettings',
  character: 'lifehubCharacter', shop: 'lifehubShop', notifications: 'lifehubNotifications',
  recommendedProgram: 'lifehubRecommendedProgram', theme: 'lifehubTheme', promptSeen: 'lifehubCharacterPromptSeen'
};

export const defaultProfile = {
  name: 'Jake', role: 'Explorer', bio: 'Building better routines through focused days.',
  mainGoal: 'Stay consistent with study, focus, and personal growth.', focusStyle: 'Calm Focus',
  favoriteTime: 'Morning', location: 'Indonesia'
};

export const defaultGamification = {
  xp: 0, level: 1, streak: 0, ecoPoints: 0, focusSessions: 0, coins: 0,
  badges: [], purchasedItems: [], equipped: { skin: 'warm', outfit: 'starter-hoodie', equipment: 'none', accessory: 'none' }
};
export const defaultPomodoroSettings = { focusMinutes: 25, breakMinutes: 5, longBreakMinutes: 15 };
export const defaultCharacter = { name: 'Jake', base: 'explorer', skin: 'warm', hair: 'navy', outfit: 'starter-hoodie', equipment: 'none', accessory: 'none', mood: 'calm' };

export const defaultShopItems = [
  { id:'starter-hoodie', name:'Starter Hoodie', type:'outfit', price:0, owned:true, description:'Your first daily explorer fit.' },
  { id:'mint-hoodie', name:'Mint Hoodie', type:'outfit', price:80, owned:true, description:'Default LIFEHUB starter outfit.' },
  { id:'mint-jacket', name:'Mint Jacket', type:'outfit', price:120, owned:false, description:'Fresh mint jacket for consistent routines.' },
  { id:'night-coat', name:'Night Coat', type:'outfit', price:180, owned:false, description:'Dark premium coat for late-night focus.' },
  { id:'focus-headset', name:'Focus Headset', type:'equipment', price:160, owned:false, description:'Equipment for deep work sessions.' },
  { id:'eco-backpack', name:'Eco Backpack', type:'equipment', price:190, owned:false, description:'A green backpack for eco side quests.' },
  { id:'solar-watch', name:'Solar Watch', type:'accessory', price:140, owned:false, description:'Accessory for time-aware adventurers.' },
  { id:'night-skin', name:'Night Skin', type:'skin', price:240, owned:false, description:'A cool night-mode character skin.' },
  { id:'aurora-skin', name:'Aurora Skin', type:'skin', price:300, owned:false, description:'A rare glowing aurora skin.' }
];

export function readJSON(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch{ return fallback; }
}
export function writeJSON(key, value){ localStorage.setItem(key, JSON.stringify(value)); emitChange(); }
export function emitChange(){ window.dispatchEvent(new Event('lifehub:data')); }
export function notify(message){
  const notifications = readJSON(LIFEHUB_KEYS.notifications, []);
  notifications.unshift({ message, time:new Date().toLocaleString(), createdAt:new Date().toISOString(), read:false });
  localStorage.setItem(LIFEHUB_KEYS.notifications, JSON.stringify(notifications.slice(0, 20)));
  emitChange();
}
export function getNotifications(){ return readJSON(LIFEHUB_KEYS.notifications, []); }
export function clearNotifications(){ writeJSON(LIFEHUB_KEYS.notifications, []); }

export function calculateLevel(xp){ return Math.floor((Number(xp)||0)/150)+1; }
export function getGamification(){
  const stored = readJSON(LIFEHUB_KEYS.gamification, defaultGamification);
  const xp = Number(stored.xp)||0;
  return { ...defaultGamification, ...stored, xp, level: Number(stored.level)||calculateLevel(xp), coins:Number(stored.coins)||0, ecoPoints:Number(stored.ecoPoints)||0, focusSessions:Number(stored.focusSessions)||0 };
}
export function saveGamification(game){ writeJSON(LIFEHUB_KEYS.gamification, { ...game, level: calculateLevel(game.xp) }); }
export function addReward({xp=0, coins=0, ecoPoints=0, focusSessions=0}={}){
  const game = getGamification();
  game.xp += Number(xp)||0; game.coins += Number(coins)||0; game.ecoPoints += Number(ecoPoints)||0; game.focusSessions += Number(focusSessions)||0; game.level = calculateLevel(game.xp);
  saveGamification(game);
  if(xp || coins || ecoPoints) notify(`Reward earned: +${xp} XP, +${coins} coins${ecoPoints ? `, +${ecoPoints} eco points` : ''}.`);
  window.dispatchEvent(new CustomEvent('lifehub:reward', { detail:{xp,coins,ecoPoints,focusSessions} }));
  return game;
}
export function spendCoins(amount){ const game = getGamification(); if(game.coins < amount) return false; game.coins -= amount; saveGamification(game); return true; }

export function getTasks(){ return readJSON(LIFEHUB_KEYS.tasks, []).map(t=>({title:t.title||'Untitled Quest', category:t.category||'Personal', priority:t.priority||'Medium', dueDate:t.dueDate||'', completed:Boolean(t.completed)})); }
export function saveTasks(tasks){ writeJSON(LIFEHUB_KEYS.tasks, tasks); }
export function addTask(task){ const tasks=getTasks(); tasks.unshift({title:task.title||'Untitled Quest', category:task.category||'Personal', priority:task.priority||'Medium', dueDate:task.dueDate||'', completed:false}); saveTasks(tasks); notify('New quest added.'); }
export function updateTask(index, patch){ const tasks=getTasks(); if(!tasks[index]) return; tasks[index]={...tasks[index],...patch}; saveTasks(tasks); notify('Quest updated.'); }
export function deleteTask(index){ const tasks=getTasks(); tasks.splice(index,1); saveTasks(tasks); notify('Quest deleted.'); }
export function toggleTask(index){ const tasks=getTasks(); if(!tasks[index]) return; const was=tasks[index].completed; tasks[index].completed=!was; saveTasks(tasks); if(!was) addReward({xp:30, coins:15}); }

export function getHabits(){ return readJSON(LIFEHUB_KEYS.habits, []).map(h=>({title:h.title||'Untitled Habit', description:h.description||'', category:h.category||'Lifestyle', target:h.target||'Daily', completed:Boolean(h.completed)})); }
export function saveHabits(habits){ writeJSON(LIFEHUB_KEYS.habits, habits); }
export function addHabit(habit){ const habits=getHabits(); habits.unshift({title:habit.title||'Untitled Habit', description:habit.description||'', category:habit.category||'Lifestyle', target:habit.target||'Daily', completed:false}); saveHabits(habits); notify('New habit added.'); }
export function updateHabit(index, patch){ const habits=getHabits(); if(!habits[index]) return; habits[index]={...habits[index],...patch}; saveHabits(habits); notify('Habit updated.'); }
export function deleteHabit(index){ const habits=getHabits(); habits.splice(index,1); saveHabits(habits); notify('Habit deleted.'); }
export function toggleHabit(index){ const habits=getHabits(); if(!habits[index]) return; const was=habits[index].completed; habits[index].completed=!was; saveHabits(habits); if(!was) addReward({xp:20, coins:10}); }

export function getEcoQuests(){ return readJSON(LIFEHUB_KEYS.eco, []).map(e=>({title:e.title||'Untitled Eco Quest', description:e.description||'', points:Number(e.points)||10, completed:Boolean(e.completed), claimed:Boolean(e.claimed)})); }
export function saveEcoQuests(items){ writeJSON(LIFEHUB_KEYS.eco, items); }
export function addEcoQuest(quest){ const items=getEcoQuests(); items.unshift({title:quest.title||'Untitled Eco Quest', description:quest.description||'', points:Number(quest.points)||10, completed:false, claimed:false}); saveEcoQuests(items); notify('Eco quest added.'); }
export function updateEcoQuest(index, patch){ const items=getEcoQuests(); if(!items[index]) return; items[index]={...items[index],...patch, points:Number(patch.points)||items[index].points}; saveEcoQuests(items); notify('Eco quest updated.'); }
export function deleteEcoQuest(index){ const items=getEcoQuests(); items.splice(index,1); saveEcoQuests(items); notify('Eco quest deleted.'); }
export function claimEcoQuest(index){ const items=getEcoQuests(); if(!items[index] || items[index].claimed) return; items[index].claimed=true; items[index].completed=true; const pts=Number(items[index].points)||10; saveEcoQuests(items); addReward({xp:25, coins:12, ecoPoints:pts}); }

export function getPomodoroSettings(){ return { ...defaultPomodoroSettings, ...readJSON(LIFEHUB_KEYS.pomodoro, defaultPomodoroSettings) }; }
export function updatePomodoroSettings(settings){ writeJSON(LIFEHUB_KEYS.pomodoro, { ...getPomodoroSettings(), focusMinutes:Number(settings.focusMinutes)||25, breakMinutes:Number(settings.breakMinutes)||5, longBreakMinutes:Number(settings.longBreakMinutes)||15 }); notify('Pomodoro settings updated.'); }
export function completeFocusSession(){ addReward({ xp:35, coins:18, focusSessions:1 }); }

export function getProfile(){ return { ...defaultProfile, ...readJSON(LIFEHUB_KEYS.profile, defaultProfile) }; }
export function updateProfile(profile){ writeJSON(LIFEHUB_KEYS.profile, { ...getProfile(), ...profile }); notify('Profile updated.'); }
export function getCharacter(){ return { ...defaultCharacter, ...readJSON(LIFEHUB_KEYS.character, defaultCharacter) }; }
export function saveCharacter(character){ writeJSON(LIFEHUB_KEYS.character, { ...getCharacter(), ...character }); }
export function saveCharacterAndProfile(character, profilePatch={}){ saveCharacter(character); updateProfile({ name: character.name || 'Jake', role: profilePatch.role || getProfile().role || 'Explorer', ...profilePatch }); localStorage.setItem(LIFEHUB_KEYS.promptSeen, 'true'); emitChange(); }
export function getShopItems(){ return readJSON(LIFEHUB_KEYS.shop, defaultShopItems); }
export function saveShopItems(items){ writeJSON(LIFEHUB_KEYS.shop, items); }
export function buyShopItem(itemId){ const items=getShopItems(); const item=items.find(x=>x.id===itemId); if(!item||item.owned) return false; if(!spendCoins(item.price)){ notify('Not enough coins.'); return false; } item.owned=true; saveShopItems(items); notify(`${item.name} purchased.`); return true; }
export function equipItem(itemId){ const items=getShopItems(); const item=items.find(x=>x.id===itemId); if(!item||!item.owned) return false; const character=getCharacter(); if(item.type==='skin') character.skin=item.id; if(item.type==='outfit') character.outfit=item.id; if(item.type==='equipment') character.equipment=item.id; if(item.type==='accessory') character.accessory=item.id; saveCharacter(character); notify(`${item.name} equipped.`); return true; }
export function labelFromId(value){
  const labels={none:'No equipment', default:'Default', warm:'Warm Skin', fair:'Fair Skin', deep:'Deep Skin', navy:'Navy Hair', mint:'Mint Hair', dark:'Dark Hair', 'starter-hoodie':'Starter Hoodie','mint-hoodie':'Mint Hoodie','mint-jacket':'Mint Jacket','night-coat':'Night Coat','focus-headset':'Focus Headset','eco-backpack':'Eco Backpack','solar-watch':'Solar Watch','night-skin':'Night Skin','aurora-skin':'Aurora Skin'};
  return labels[value] || String(value||'None').replaceAll('-',' ').replace(/\b\w/g,c=>c.toUpperCase());
}
export function getRecommended(){ return readJSON(LIFEHUB_KEYS.recommendedProgram, { name:'Balanced Life Program', description:'A balanced system for quests, habits, focus, and progress.', pills:['Quest','Habit','Focus','Achievement'] }); }
export function saveRecommended(program){ writeJSON(LIFEHUB_KEYS.recommendedProgram, program); localStorage.removeItem(LIFEHUB_KEYS.promptSeen); }
export function getSummary(){
  const tasks=getTasks(), habits=getHabits(), ecoQuests=getEcoQuests(), game=getGamification();
  return { tasks, habits, ecoQuests, gamification:game, profile:getProfile(), character:getCharacter(), totalTasks:tasks.length, completedTasks:tasks.filter(x=>x.completed).length, totalHabits:habits.length, completedHabits:habits.filter(x=>x.completed).length, totalEco:ecoQuests.length, claimedEco:ecoQuests.filter(x=>x.claimed).length, xp:game.xp, level:game.level, coins:game.coins, ecoPoints:game.ecoPoints, focusSessions:game.focusSessions };
}
export function resetLifehubData(){ Object.values(LIFEHUB_KEYS).forEach(k=>localStorage.removeItem(k)); emitChange(); }

export function unlockableBadges(){ const g=getGamification(); return [ {id:'Starter', icon:'🌱', unlocked:g.xp>=25}, {id:'Focus', icon:'⏱️', unlocked:g.focusSessions>=1}, {id:'Eco', icon:'🌎', unlocked:g.ecoPoints>=50}, {id:'Collector', icon:'🛍️', unlocked:getShopItems().some(i=>i.owned&&!['starter-hoodie','mint-hoodie'].includes(i.id))} ]; }
