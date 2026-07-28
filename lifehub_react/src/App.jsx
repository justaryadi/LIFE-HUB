import React from 'react';
import Landing from './pages/Landing.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Quest from './pages/Quest.jsx';
import Habit from './pages/Habit.jsx';
import Pomodoro from './pages/Pomodoro.jsx';
import Eco from './pages/Eco.jsx';
import Achievement from './pages/Achievement.jsx';
import Profile from './pages/Profile.jsx';
import Legal from './pages/Legal.jsx';
import { usePersistentStyles, useRoute, useTheme } from './utils/hooks.js';
import { RewardToast } from './components/common.jsx';

function normalize(route){return route.replace(/\/pages\//,'/').replace(/\.html$/,'').replace(/\/index$/,'/') || '/'}
export default function App(){
  usePersistentStyles();
  const route = normalize(useRoute());
  const themeTools = useTheme(route);
  let Page;
  if(route==='/' || route==='/index.html') Page=<Landing/>;
  else if(route==='/onboarding') Page=<Onboarding/>;
  else if(route==='/dashboard') Page=<Dashboard theme={themeTools.theme} toggleTheme={themeTools.toggleTheme}/>;
  else if(route==='/quest') Page=<Quest/>;
  else if(route==='/habit') Page=<Habit/>;
  else if(route==='/pomodoro') Page=<Pomodoro/>;
  else if(route==='/eco') Page=<Eco/>;
  else if(route==='/achievement') Page=<Achievement/>;
  else if(route==='/profile') Page=<Profile/>;
  else if(route==='/privacy') Page=<Legal type="privacy"/>;
  else if(route==='/terms') Page=<Legal type="terms"/>;
  else if(route==='/about') Page=<Legal type="about"/>;
  else Page=<Landing/>;
  return <>{Page}<RewardToast/></>;
}
