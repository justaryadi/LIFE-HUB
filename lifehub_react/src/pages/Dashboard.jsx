import React,{useMemo,useState} from 'react';
import { useLifeHub,usePageStyles } from '../utils/hooks.js';
import { FeatureNavbar, Icon, Link, Avatar, NotificationModal, ProfileSplit, CharacterPromptModal, ConfirmResetModal } from '../components/common.jsx';
import { addTask,updateTask,toggleTask,deleteTask,toggleHabit,claimEcoQuest,getNotifications } from '../utils/core.js';

function greeting(name){const h=new Date().getHours();return `${h<12?'Good Morning':h<18?'Good Afternoon':'Good Evening'}, ${name}`}
function dueStatus(task){
  if(!task.dueDate) return {text:'No due date', className:'neutral'};
  const today=new Date(); const due=new Date(task.dueDate); today.setHours(0,0,0,0); due.setHours(0,0,0,0);
  if(+due===+today) return {text:'Today', className:'today'};
  if(due<today && !task.completed) return {text:'Overdue', className:'overdue'};
  return {text:'Upcoming', className:'upcoming'};
}
function priorityRank(priority){return priority==='High'?3:priority==='Medium'?2:1}
function QuestModal({open,onClose,editTask,onSave}){
  const blank={title:'',category:'Personal',priority:'Medium',dueDate:''};
  const [form,setForm]=useState(blank);
  React.useEffect(()=>{setForm(editTask?.task || blank)},[editTask?.index,open]);
  if(!open)return null;
  const editing=editTask?.index!==undefined && editTask?.index!==null;
  return <div className="modal show"><div className="modal-card"><button className="modal-close" onClick={onClose}><Icon name="x"/></button><h3>{editing?'Edit Quest':'Create New Quest'}</h3><p>{editing?'Update your quest details and keep the overview consistent.':'Add a new task to your daily LIFEHUB journey.'}</p><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Quest title"/><div className="quest-form-grid"><div className="quest-form-field"><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Personal','Study','Frontend Development','Documentation','Design Research','Version Control','Eco Quest'].map(x=><option key={x}>{x}</option>)}</select></div><div className="quest-form-field"><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></div><div className="quest-form-field"><label>Due Date</label><input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div></div><button className="primary-btn full-btn" onClick={()=>{if(!form.title.trim())return; onSave(form); setForm(blank);}}> {editing?'Save Changes':'Add Quest'} </button></div></div>
}
function SearchResultModal({open,onClose,items,onToggle,onDelete}){
  if(!open) return null;
  return <div className="search-result-modal show" onClick={(e)=>{if(e.target.className?.includes?.('search-result-modal')) onClose();}}><div className="search-result-box"><div className="search-result-header"><div><p className="panel-label">Search Result</p><h3>{items.length?`${items.length} Quest Found`:'No Quest Found'}</h3></div><button className="modal-close" onClick={onClose}>×</button></div><div className="search-result-content">{items.length?items.map(({task,index})=><div className="search-result-card" key={index}><div><h4>{task.title}</h4><div className="task-meta"><p>{task.category}</p><span className={`priority-tag ${(task.priority||'Medium').toLowerCase()}`}>{task.priority}</span><span className={`due-tag ${dueStatus(task).className}`}>{dueStatus(task).text}</span></div></div><div className="search-result-actions"><button className="search-action-btn done" onClick={()=>onToggle(index)}>{task.completed?'Undone':'Done'}</button><button className="search-action-btn delete" onClick={()=>onDelete(index)}>Delete</button></div></div>):<div className="empty-task"><h4>No quest found</h4><p>No quest matches your keyword. Try another keyword or create a new quest.</p></div>}</div></div></div>
}

export default function Dashboard({theme,toggleTheme}){
  usePageStyles(['/css/dashboard.css','/css/gamification.css']);
  const s=useLifeHub();
  const [notif,setNotif]=useState(false);
  const [profilePanel,setProfilePanel]=useState(false);
  const [questModal,setQuestModal]=useState(false);
  const [editTask,setEditTask]=useState(null);
  const [reset,setReset]=useState(false);
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('all');
  const [sort,setSort]=useState('default');
  const [searchModal,setSearchModal]=useState(false);
  const notifications=getNotifications();
  const xpBase=(s.level-1)*150, xpNow=s.xp-xpBase, pct=Math.min(100,xpNow/150*100);
  const high=s.tasks.filter(t=>t.priority==='High').length;
  const overdue=s.tasks.filter(t=>dueStatus(t).className==='overdue').length;
  const active=s.tasks.filter(t=>!t.completed).length;
  const remainingHabits=s.habits.filter(h=>!h.completed).length;
  const sortedFilteredTasks=useMemo(()=>{
    const keyword=search.toLowerCase().trim();
    const rows=s.tasks.map((task,index)=>({task,index})).filter(({task})=>{
      const matchKeyword=!keyword || task.title.toLowerCase().includes(keyword) || (task.category||'').toLowerCase().includes(keyword) || (task.priority||'').toLowerCase().includes(keyword);
      const matchFilter=filter==='all' || (filter==='active'&&!task.completed) || (filter==='completed'&&task.completed) || (filter==='high'&&task.priority==='High');
      return matchKeyword && matchFilter;
    });
    rows.sort((a,b)=>{
      if(sort==='priority') return priorityRank(b.task.priority)-priorityRank(a.task.priority);
      if(sort==='dueDate'){
        if(!a.task.dueDate && !b.task.dueDate) return 0;
        if(!a.task.dueDate) return 1;
        if(!b.task.dueDate) return -1;
        return new Date(a.task.dueDate)-new Date(b.task.dueDate);
      }
      if(sort==='completed') return Number(a.task.completed)-Number(b.task.completed);
      return a.index-b.index;
    });
    return rows;
  },[s.tasks,search,filter,sort]);
  const searchResults=useMemo(()=>{const keyword=search.toLowerCase().trim();if(!keyword)return [];return s.tasks.map((task,index)=>({task,index})).filter(({task})=>task.title.toLowerCase().includes(keyword)||(task.category||'').toLowerCase().includes(keyword)||(task.priority||'').toLowerCase().includes(keyword));},[s.tasks,search]);
  const openNewQuest=()=>{setEditTask(null);setQuestModal(true)};
  const openEditQuest=(index)=>{setEditTask({index,task:s.tasks[index]});setQuestModal(true)};
  const saveQuest=(form)=>{if(editTask?.index!==undefined&&editTask?.index!==null) updateTask(editTask.index,form); else addTask(form); setQuestModal(false); setEditTask(null)};
  return <>
    <FeatureNavbar active="dashboard"/>
    <div className="dashboard-layout dashboard-top-layout"><main className="main">
      <header className="topbar"><div><p className="eyebrow">Overview</p><h2>{greeting(s.profile.name)}</h2></div><div className="topbar-actions"><div className="search-box"><Icon name="search"/><input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&search.trim())setSearchModal(true)}} placeholder="Search your quest..."/></div><button className="circle-btn notification-btn" onClick={()=>setNotif(true)}><Icon name="bell"/><span className="notification-count">{notifications.length}</span></button><button className="dashboard-profile-trigger" onClick={()=>setProfilePanel(true)} aria-label="Open profile quick panel"><Avatar size="small" character={s.character}/></button></div></header>
      <section className="hero-card" id="dashboardSection"><div className="hero-content"><span className="tag">Today’s Pulse</span><h1>Build your rhythm.<br/>Grow your world.</h1><p>Manage your quests, habits, focus sessions, and eco goals in one calm and mindful workspace.</p><div className="hero-actions"><Link to="/pomodoro" className="primary-btn">Start Focus</Link><Link to="/achievement" className="secondary-btn">View Analytics</Link></div></div><section className="shortcut-grid"><Link to="/quest" className="shortcut-card"><Icon name="check-square"/><h3>Quest Manager</h3><p>Manage your daily quests, priority, deadline, and progress.</p></Link><Link to="/habit" className="shortcut-card"><Icon name="repeat"/><h3>Habit Tracker</h3><p>Track routines and build consistent daily habits.</p></Link><Link to="/pomodoro" className="shortcut-card"><Icon name="timer"/><h3>Pomodoro</h3><p>Start focused sessions and protect your deep work time.</p></Link><Link to="/eco" className="shortcut-card"><Icon name="leaf"/><h3>Eco Quest</h3><p>Complete small green missions and collect eco points.</p></Link><Link to="/achievement" className="shortcut-card"><Icon name="award"/><h3>Achievement</h3><p>See your XP, level, streak, shop, and unlocked badges.</p></Link></section><div className="nature-scene"><div className="cloud cloud-one"></div><div className="cloud cloud-two"></div><div className="mountain mountain-one"></div><div className="mountain mountain-two"></div><div className="tree tree-one"></div><div className="tree tree-two"></div><div className="tree tree-three"></div><div className="bush bush-one"></div><div className="bush bush-two"></div><div className={`sun ${theme==='dark'?'moon':''}`} onClick={toggleTheme} role="button" title="Toggle dark mode"></div></div></section>
      <section className="stats-grid"><div className="stat-card"><div><p>Level</p><h3>{s.level}</h3></div><Icon name="sparkles"/></div><div className="stat-card"><div><p>Total XP</p><h3>{s.xp}</h3></div><Icon name="zap"/></div><div className="stat-card"><div><p>Coins</p><h3>{s.coins}</h3></div><Icon name="coins"/></div><div className="stat-card"><div><p>Eco Points</p><h3>{s.ecoPoints}</h3></div><Icon name="leaf"/></div></section>
      <section className="week-row">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=><button className={`day ${i===0?'active':''}`} key={d}>{d}<br/><span>{10+i}</span></button>)}</section>
      <section className="content-grid"><div className="left-column"><div className="panel" id="questSection"><div className="panel-header"><div><p className="panel-label">Today</p><h3>Tasks</h3></div><Link to="/quest" className="overview-link-btn">Manage</Link></div><p className="progress-text"><span>{s.completedTasks}</span>/<span>{s.totalTasks}</span> done</p><div className="quest-filter">{[['all','All'],['active','Active'],['completed','Completed'],['high','High Priority']].map(([key,label])=><button key={key} className={`filter-btn ${filter===key?'active':''}`} onClick={()=>setFilter(key)}>{label}</button>)}</div><div className="quest-sort"><label>Sort by</label><select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Default</option><option value="priority">Priority</option><option value="dueDate">Due Date</option><option value="completed">Completed</option></select></div><div className="quest-overview"><div className="overview-card"><p>Active</p><h4>{active}</h4></div><div className="overview-card"><p>Completed</p><h4>{s.completedTasks}</h4></div><div className="overview-card"><p>High Priority</p><h4>{high}</h4></div><div className="overview-card danger"><p>Overdue</p><h4>{overdue}</h4></div></div><div className="task-list">{sortedFilteredTasks.length?sortedFilteredTasks.slice(0,6).map(({task,index})=>{const ds=dueStatus(task);return <div className="task-item" key={`${task.title}-${index}`}><input type="checkbox" className="task-check" checked={task.completed} onChange={()=>toggleTask(index)}/><span className="custom-check" onClick={()=>toggleTask(index)}></span><div><h4>{task.title}</h4><div className="task-meta"><p>{task.category||'General'}</p><span className={`priority-tag ${(task.priority||'Medium').toLowerCase()}`}>{task.priority}</span><span className={`due-tag ${ds.className}`}>{ds.text}</span></div></div><div className="task-actions"><button className="edit-task" type="button" title="Edit task" onClick={()=>openEditQuest(index)}>✎</button><button className="delete-task" type="button" title="Delete task" onClick={()=>deleteTask(index)}>×</button></div></div>}):<div className="empty-task"><h4>No quest found</h4><p>Try searching with another keyword, or create a new quest to keep your day moving.</p></div>}</div><div className="progress-bar"><div style={{width:`${s.totalTasks?s.completedTasks/s.totalTasks*100:0}%`}}></div></div></div>
      <div className="panel" id="habitSection"><div className="panel-header"><div><p className="panel-label">Consistency</p><h3>Habit Tracker</h3></div><Link to="/habit" className="overview-link-btn">View All</Link></div><div className="habit-list">{s.habits.length?s.habits.slice(0,3).map((h,i)=><div className={`habit-item ${h.completed?'completed':''}`} key={i}><div className="habit-left"><button className={`habit-toggle ${h.completed?'done':''}`} onClick={()=>toggleHabit(i)}></button><div><h4>{h.title}</h4><p>{h.category||h.target||'Lifestyle'}</p></div></div><span>{h.completed?'Done':'Active'}</span></div>):<div className="empty-state-mini"><h4>No habits yet</h4><p>Create habits from the Habit page.</p></div>}</div></div></div>
      <div className="right-column"><div className="panel pulse-panel"><div className="panel-header"><div><p className="panel-label">Insight</p><h3>Today’s Pulse</h3></div></div><div className="pulse-box"><p>{remainingHabits} habits left</p><h4>{remainingHabits>0?'Keep your streak alive today.':'All habits completed. Great rhythm.'}</h4></div><div className="pulse-box soft"><p>Focus Plan</p><h4>45 minutes deep work session.</h4></div></div><div className="panel pomodoro-panel" id="pomodoroSection"><div className="panel-header"><div><p className="panel-label">Focus</p><h3>Pomodoro Timer</h3></div><Link to="/pomodoro" className="overview-link-btn">Open</Link></div><div className="pomodoro-mode"><button className="mode-btn active">Focus</button><button className="mode-btn">Break</button></div><div className="pomodoro-circle"><div className="pomodoro-inner"><h2>25:00</h2><p>Ready to focus</p></div></div><div className="pomodoro-actions"><Link to="/pomodoro" className="primary-btn">Start</Link><Link to="/pomodoro" className="secondary-btn">Settings</Link></div></div><div className="panel" id="ecoSection"><div className="panel-header"><div><p className="panel-label">Sustainability</p><h3>Eco Quest</h3></div><Link to="/eco" className="overview-link-btn">View All</Link></div><div className="eco-list">{s.ecoQuests.length?s.ecoQuests.slice(0,3).map((q,i)=><div className="eco-item" key={i}><div><h4>{q.title}</h4><p>+{q.points} Eco Points</p></div><button className="badge done eco-complete" disabled={q.claimed} onClick={()=>claimEcoQuest(i)}>{q.claimed?'Claimed':'Claim'}</button></div>):<div className="empty-state-mini"><h4>No eco quests yet</h4><p>Create eco quests from the Eco page.</p></div>}</div></div><div className="panel achievement-panel" id="achievementSection"><div className="panel-header"><div><p className="panel-label">Progression</p><h3>Achievement</h3></div><Link to="/achievement" className="overview-link-btn">Shop</Link></div><div className="level-box"><div><p>Current Level</p><h2>{s.level}</h2></div><div className="level-icon">🌿</div></div><div className="xp-progress"><div className="xp-info"><span>XP Progress</span><span>{xpNow} / 150 XP</span></div><div className="xp-bar"><div style={{width:`${pct}%`}}></div></div></div><div className="badge-list"><div className={`badge-card ${s.xp>=25?'unlocked':'locked'}`}><span>🌱</span><p>Starter</p></div><div className={`badge-card ${s.focusSessions>=1?'unlocked':'locked'}`}><span>⏱️</span><p>Focus</p></div><div className={`badge-card ${s.ecoPoints>=50?'unlocked':'locked'}`}><span>🌎</span><p>Eco</p></div></div></div><div className="panel"><div className="panel-header"><div><p className="panel-label">Weekly</p><h3>Progress</h3></div></div><div className="mini-chart">{[45,68,52,80,65,72,88].map((h,i)=><div key={i} style={{height:`${h}%`}}></div>)}</div></div></div></section>
    </main></div>
    <NotificationModal open={notif} onClose={()=>setNotif(false)}/>
    <ProfileSplit open={profilePanel} onClose={()=>setProfilePanel(false)} onNewQuest={()=>{setProfilePanel(false);openNewQuest()}} onReset={()=>{setProfilePanel(false);setReset(true)}}/>
    <QuestModal open={questModal} editTask={editTask} onClose={()=>{setQuestModal(false);setEditTask(null)}} onSave={saveQuest}/>
    <ConfirmResetModal open={reset} onClose={()=>setReset(false)}/>
    <SearchResultModal open={searchModal} onClose={()=>setSearchModal(false)} items={searchResults} onToggle={toggleTask} onDelete={deleteTask}/>
    <CharacterPromptModal/>
  </>
}
