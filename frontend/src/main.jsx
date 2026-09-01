import React,{useState,useEffect}from'react';import{createRoot}from'react-dom/client';import'./styles.css';
import LessonEngine from'./lessons/LessonEngine.jsx';
import {t as translate, ACHIEVEMENT_I18N} from'./i18n.js';

const API=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
const req=(p,o={})=>fetch(API+p,{...o,headers:{'Content-Type':'application/json',Authorization:localStorage.access?`Bearer ${localStorage.access}`:'',...(o.headers||{})}});

function useLang(){
  const [lang,setLangState]=useState(localStorage.lang==='ar'?'ar':'en');
  useEffect(()=>{
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  },[lang]);
  function setLang(l){
    localStorage.lang=l;
    setLangState(l);
    if(localStorage.access)req('/me/language',{method:'PUT',body:JSON.stringify({language:l})}).catch(()=>{});
  }
  return [lang,setLang];
}

function App(){
  const[lang,setLang]=useLang();
  const s=translate(lang);
  const[page,setPage]=useState('home'),[auth,setAuth]=useState(!!localStorage.access);
  const[form,setForm]=useState({name:'',email:'',password:''}),[msg,setMsg]=useState('');
  const[lessons,setLessons]=useState([]),[activeLessonId,setActiveLessonId]=useState(null);
  const[authView,setAuthView]=useState('signin'); // 'signin' | 'signup' | 'forgot' | 'reset' | 'verifying'
  const[resetToken,setResetToken]=useState(null);
  const[resetForm,setResetForm]=useState({email:'',newPassword:''});

  function refreshLessons(){if(auth)req(`/lessons?lang=${lang}`).then(r=>r.ok?r.json():[]).then(setLessons)}
  useEffect(refreshLessons,[auth,lang]);
  function exitLesson(){setActiveLessonId(null);refreshLessons();setPage('library')}

  // Handle ?verify=TOKEN and ?reset=TOKEN links from emails, once on load.
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const verifyToken=params.get('verify');
    const reset=params.get('reset');
    if(verifyToken){
      setAuthView('verifying');
      req('/auth/verify-email',{method:'POST',body:JSON.stringify({token:verifyToken})})
        .then(r=>r.json())
        .then(d=>{setMsg(d.verified?s.verified:s.verifyFailed);setAuthView('signin')});
      window.history.replaceState({},'',window.location.pathname);
    } else if(reset){
      setResetToken(reset);
      setAuthView('reset');
      window.history.replaceState({},'',window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  async function register(e){
    e.preventDefault();
    const r=await req('/auth/register',{method:'POST',body:JSON.stringify({...form,language:lang})});
    const d=await r.json();
    if(!r.ok)return setMsg(d.error);
    let m=s.checkEmailVerify;
    if(d.devVerificationUrl)m+=` (${s.devLinkPrefix} ${d.devVerificationUrl})`;
    setMsg(m);
    setAuthView('signin');
  }

  async function login(e){
    e.preventDefault();
    const r=await req('/auth/login',{method:'POST',body:JSON.stringify(form)}),d=await r.json();
    if(!r.ok)return setMsg(d.error);
    localStorage.access=d.accessToken;localStorage.refresh=d.refreshToken;
    if(d.user?.language)setLang(d.user.language);
    setAuth(true);setPage('library');
  }

  async function requestReset(e){
    e.preventDefault();
    const r=await req('/auth/request-password-reset',{method:'POST',body:JSON.stringify({email:resetForm.email})});
    const d=await r.json();
    let m=s.resetRequested;
    if(d.devResetUrl)m+=` (${s.devLinkPrefix} ${d.devResetUrl})`;
    setMsg(m);
    setAuthView('signin');
  }

  async function submitReset(e){
    e.preventDefault();
    const r=await req('/auth/reset-password',{method:'POST',body:JSON.stringify({token:resetToken,newPassword:resetForm.newPassword})});
    const d=await r.json();
    setMsg(r.ok&&d.reset?s.resetSuccess:s.resetFailed);
    setAuthView('signin');
    setResetToken(null);
  }

  const langBtn=<button type="button" className="secondary lang-toggle" onClick={()=>setLang(lang==='ar'?'en':'ar')}>{s.langToggle}</button>;

  if(!auth){
    return <main>
      <header><b>{s.appName}</b>{langBtn}</header>
      <h1>{s.appName}</h1><p>{s.tagline}</p>

      {authView==='verifying'&&<section className="card"><p>{s.verifying}</p></section>}

      {authView==='signup'&&<section className="card">
        <h2>{s.createAccount}</h2>
        <form onSubmit={register}>
          <input placeholder={s.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input placeholder={s.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <input type="password" placeholder={s.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <button>{s.createAccountBtn}</button>
        </form>
        <button type="button" className="secondary" onClick={()=>setAuthView('signin')}>{s.backToSignIn}</button>
      </section>}

      {authView==='signin'&&<section className="card">
        <h2>{s.signInHeading}</h2>
        <form onSubmit={login}>
          <input placeholder={s.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <input type="password" placeholder={s.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <button>{s.signInBtn}</button>
        </form>
        {msg&&<p>{msg}</p>}
        <div className="lesson-actions">
          <button type="button" className="secondary" onClick={()=>{setMsg('');setAuthView('signup')}}>{s.createAccount}</button>
          <button type="button" className="secondary" onClick={()=>{setMsg('');setAuthView('forgot')}}>{s.forgotPassword}</button>
        </div>
      </section>}

      {authView==='forgot'&&<section className="card">
        <h2>{s.requestResetHeading}</h2>
        <form onSubmit={requestReset}>
          <input placeholder={s.email} onChange={e=>setResetForm({...resetForm,email:e.target.value})}/>
          <button>{s.requestResetBtn}</button>
        </form>
        <button type="button" className="secondary" onClick={()=>setAuthView('signin')}>{s.backToSignIn}</button>
      </section>}

      {authView==='reset'&&<section className="card">
        <h2>{s.resetPasswordHeading}</h2>
        <form onSubmit={submitReset}>
          <input type="password" placeholder={s.newPassword} onChange={e=>setResetForm({...resetForm,newPassword:e.target.value})}/>
          <button>{s.resetPasswordBtn}</button>
        </form>
      </section>}
    </main>;
  }

  if(activeLessonId)return <main><LessonEngine lessonId={activeLessonId} lang={lang} req={req} onExit={exitLesson}/></main>;

  return <main>
    <header>
      <b>{s.appName}</b>
      <nav>
        {['home','library','achievements','certificate'].map(x=><button key={x} onClick={()=>setPage(x)}>{s.nav[x]}</button>)}
        {langBtn}
      </nav>
    </header>
    {page==='home'&&<section className="card"><h1>{s.welcomeBack}</h1><p>{s.connected}</p><h2>{s.pathway}</h2></section>}
    {page==='library'&&<section><h1>{s.library}</h1>{lessons.map(l=><article className="card" key={l.id}><b>{s.lessonLabel} {l.sortOrder}</b><h3>{l.title}</h3><p>{l.area}</p><button onClick={()=>setActiveLessonId(l.id)}>{s.startLesson}</button></article>)}</section>}
    {page==='achievements'&&<Achievements lang={lang} s={s}/>}
    {page==='certificate'&&<Certificate s={s}/>}
  </main>;
}

function Achievements({lang,s}){
  const[a,setA]=useState([]);
  useEffect(()=>{req('/achievements').then(r=>r.json()).then(setA)},[]);
  return <section><h1>{s.achievementsTitle}</h1>{a.map(x=>{
    const label=lang==='ar'?(ACHIEVEMENT_I18N[x.name]||x.name):x.name;
    return <article className="card" key={x.name}>{x.earned?'🏆':'🔒'} {label}</article>;
  })}</section>;
}

function Certificate({s}){
  const[code,setCode]=useState(''),[out,setOut]=useState(null);
  return <section className="card">
    <h1>{s.verifyCertTitle}</h1>
    <input value={code} onChange={e=>setCode(e.target.value)} placeholder={s.verificationCodePh}/>
    <button onClick={async()=>setOut(await (await req('/certificates/verify/'+code)).json())}>{s.verifyBtn}</button>
    {out&&<pre>{JSON.stringify(out,null,2)}</pre>}
  </section>;
}

createRoot(document.getElementById('root')).render(<App/>);
