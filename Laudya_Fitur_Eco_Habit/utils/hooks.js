import { useEffect, useState } from 'react';
import { getSummary } from './core.js';

export function useRoute(){
  const normalize = () => {
    const p = window.location.pathname.replace(/\/$/, '') || '/';
    return p;
  };
  const [route, setRoute] = useState(normalize);
  useEffect(()=>{
    const onRoute = () => setRoute(normalize());
    window.addEventListener('popstate', onRoute);
    window.addEventListener('lifehub:route', onRoute);
    return () => { window.removeEventListener('popstate', onRoute); window.removeEventListener('lifehub:route', onRoute); };
  },[]);
  return route;
}

export function navigate(path){
  const target = path === '/index.html' ? '/' : path.replace(/\.html$/, '').replace('/pages/', '/');
  window.history.pushState({}, '', target);
  window.dispatchEvent(new Event('lifehub:route'));
  window.scrollTo({top:0, behavior:'instant'});
}

export function useLifeHub(){
  const [summary, setSummary] = useState(()=>getSummary());
  useEffect(()=>{
    const sync = () => setSummary(getSummary());
    window.addEventListener('lifehub:data', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('lifehub:data', sync); window.removeEventListener('storage', sync); };
  },[]);
  return summary;
}

export function usePageStyles(styles=[]){
  useEffect(()=>{
    document.querySelectorAll('link[data-lifehub-page-style]').forEach(el=>el.remove());
    styles.forEach(href=>{
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.lifehubPageStyle = 'true';
      document.head.appendChild(link);
    });
    return () => {
      document.querySelectorAll('link[data-lifehub-page-style]').forEach(el=>el.remove());
    };
  }, [styles.join('|')]);
}

export function usePersistentStyles(){
  useEffect(()=>{
    ['/css/gamification.css','/css/theme.css'].forEach(href=>{
      if(document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.lifehubPersistentStyle = 'true';
      document.head.appendChild(link);
    });
  }, []);
}

export function useTheme(route){
  const startup = route === '/' || route === '/onboarding';
  const [theme, setThemeState] = useState(()=> startup ? 'light' : (localStorage.getItem('lifehubTheme') || 'light'));
  useEffect(()=>{
    const next = startup ? 'light' : (localStorage.getItem('lifehubTheme') || 'light');
    if(startup) localStorage.setItem('lifehubTheme', 'light');
    setThemeState(next);
  }, [route, startup]);
  useEffect(()=>{
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('lifehub-dark', isDark);
    document.body.classList.toggle('lifehub-dark', isDark);
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.body.dataset.theme = isDark ? 'dark' : 'light';
  }, [theme]);
  const setTheme = (next) => { localStorage.setItem('lifehubTheme', next); setThemeState(next); };
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return { theme, setTheme, toggleTheme, isStartup: startup };
}
