'use client'

import { useEffect } from 'react'

export function StarlightLandingHero() {
  useEffect(() => {
    const appearEls = Array.from(document.querySelectorAll<HTMLElement>('.appear'))
    const heroPhoto = document.getElementById('heroPhoto')
    const burger = document.getElementById('burgerBtn')
    const backdrop = document.getElementById('menuBackdrop')

    const onAnimEnd = (el: HTMLElement) => () => el.classList.add('is-in')
    const animEndHandlers = appearEls.map((el) => {
      const handler = onAnimEnd(el)
      el.addEventListener('animationend', handler, { once: true })
      return { el, handler }
    })

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let anyRunning = false
        appearEls.forEach((el) => {
          const anims = el.getAnimations ? el.getAnimations() : []
          anims.forEach((a) => {
            if (a.playState === 'running' || a.playState === 'finished') anyRunning = true
          })
        })
        if (!anyRunning) {
          appearEls.forEach((el) => el.classList.add('is-in'))
          heroPhoto?.classList.add('is-in')
        }
      })
    })

    const video = heroPhoto?.querySelector('video') ?? null
    const onLoaded = () => heroPhoto?.classList.add('is-in')
    const onError = () => heroPhoto?.classList.add('is-in')
    if (video) {
      video.addEventListener('loadeddata', onLoaded)
      video.addEventListener('error', onError)
    } else {
      heroPhoto?.classList.add('is-in')
    }

    function closeMenu() {
      document.body.classList.remove('menu-open')
      burger?.setAttribute('aria-expanded', 'false')
      burger?.setAttribute('aria-label', 'Open menu')
    }
    function openMenu() {
      document.body.classList.add('menu-open')
      burger?.setAttribute('aria-expanded', 'true')
      burger?.setAttribute('aria-label', 'Close menu')
    }
    const onBurgerClick = () => {
      if (document.body.classList.contains('menu-open')) closeMenu()
      else openMenu()
    }
    burger?.addEventListener('click', onBurgerClick)
    backdrop?.addEventListener('click', closeMenu)

    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('#site-nav a'))
    navLinks.forEach((a) => a.addEventListener('click', closeMenu))

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKeydown)

    const onResize = () => {
      if (window.matchMedia('(min-width: 901px)').matches) closeMenu()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf1)
      animEndHandlers.forEach(({ el, handler }) => el.removeEventListener('animationend', handler))
      if (video) {
        video.removeEventListener('loadeddata', onLoaded)
        video.removeEventListener('error', onError)
      }
      burger?.removeEventListener('click', onBurgerClick)
      backdrop?.removeEventListener('click', closeMenu)
      navLinks.forEach((a) => a.removeEventListener('click', closeMenu))
      document.removeEventListener('keydown', onKeydown)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('menu-open')
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        html, body { background: #000000 !important; color: #ffffff; }

        @font-face {
          font-family: "Instrument Serif";
          font-style: italic;
          font-weight: 400;
          font-display: swap;
          src: url("https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6xu5EmyaHf6BLc4.woff2") format("woff2");
        }

        :root{
          --bg:#000000; --text:#ffffff; --muted:#9a9a9a; --stat:#d8d8d8;
          --border:rgba(255,255,255,0.16); --border-soft:rgba(255,255,255,0.12);

          --logo:15.5px; --logo-mark:22px; --nav:14px; --nav-h:40px;
          --btn:13.5px; --btn-h:40px; --hero-btn-h:42px;
          --h1:48px; --lede:15.5px; --badge:12.5px; --stat-size:13.5px;
          --header-y:22px; --header-x:40px; --stats-x:72px; --stats-y:36px;
          --hero-gap:85px; --copy-max:860px; --lede-max:470px;
        }

        html, body {
          background:#000000; background: var(--bg,#000000);
          color:#ffffff; color: var(--text,#ffffff);
        }

        .starlight-hero-root, .starlight-hero-root *, .starlight-hero-root *::before, .starlight-hero-root *::after{ box-sizing:border-box; }
        .starlight-hero-root{ margin:0; padding:0; }
        .starlight-hero-root a{ color:inherit; text-decoration:none; }
        .starlight-hero-root button{ font-family:inherit; border:none; background:none; }

        body{
          font-family: var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
          text-rendering:optimizeLegibility; overflow-x:hidden; position:relative;
        }

        /* ---- Layer stack ---- */
        .grain{
          position:fixed; inset:0; z-index:100; pointer-events:none;
          opacity:0.035; mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .bg-glow{
          position:fixed; inset:0; z-index:0; overflow:hidden; pointer-events:none;
        }
        .glow-orb{ position:absolute; border-radius:50%; filter:blur(70px); will-change:transform; }
        .glow-orb--a{
          width:620px; height:620px; top:-12%; left:-8%;
          background:radial-gradient(circle, rgba(168,85,247,0.38), transparent 70%);
          animation: float-glow 15s ease-in-out infinite;
        }
        .glow-orb--b{
          width:560px; height:560px; bottom:-14%; right:-6%;
          background:radial-gradient(circle, rgba(6,182,212,0.32), transparent 70%);
          animation: float-glow-reverse 18s ease-in-out infinite;
        }
        .glow-orb--c{
          width:420px; height:420px; top:38%; left:50%; transform:translateX(-50%);
          background:radial-gradient(circle, rgba(59,130,246,0.18), transparent 72%);
          animation: subtle-pulse 8s ease-in-out infinite;
        }
        @keyframes float-glow{
          0%,100%{ transform:translate(0,0) scale(1); opacity:0.3; }
          50%{ transform:translate(50px,-30px) scale(1.1); opacity:0.5; }
        }
        @keyframes float-glow-reverse{
          0%,100%{ transform:translate(0,0) scale(1); opacity:0.25; }
          50%{ transform:translate(-40px,40px) scale(1.15); opacity:0.4; }
        }
        @keyframes subtle-pulse{
          0%,100%{ opacity:0.2; transform:translateX(-50%) scale(1); }
          50%{ opacity:0.35; transform:translateX(-50%) scale(1.05); }
        }

        .hero-photo{
          position:fixed; inset:0; z-index:1; overflow:hidden; background:transparent;
          opacity:0;
        }
        .hero-photo video{
          position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
          opacity:0.55; mix-blend-mode:screen;
        }
        .hero-photo::after{
          content:""; position:absolute; inset:0;
          background:radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 62%, #000 100%);
        }
        .hero-photo.is-in{ opacity:1; transition:opacity 1.1s cubic-bezier(0.16,1,0.3,1); }

        .page{
          position:relative; z-index:2; display:grid;
          grid-template-rows:auto 1fr auto;
          min-height:100vh; min-height:100dvh;
        }

        /* ---- Header ---- */
        .header{
          display:grid; grid-template-columns:1fr auto 1fr; align-items:center;
          padding: var(--header-y) var(--header-x) 10px;
          z-index:50; position:relative;
        }
        .logo{
          display:inline-flex; align-items:center; gap:9px; justify-self:start;
          font-size: var(--logo); font-weight:600; letter-spacing:-0.03em; color:#fff;
        }
        .logo svg{ width: var(--logo-mark); height: var(--logo-mark); }
        .logo-suffix{ font-weight:400; }

        nav#site-nav{
          display:flex; align-items:center; gap:8px; justify-self:center;
        }
        .pill{
          height: var(--nav-h); padding:0 18px; border-radius:7px; overflow:hidden; position:relative;
          display:inline-flex; align-items:center;
          border:1px solid rgba(198,198,198,0.55);
          background:linear-gradient(105deg,#050505 0%,#2a2a2a 48%,#4a4a4a 100%);
          color:#f3f3f3; font-size: var(--nav); font-weight:400; letter-spacing:-0.01em; white-space:nowrap;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .pill::before{
          content:""; position:absolute; inset:0;
          background:linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.16) 50%, transparent 70%);
          transform:translateX(-120%);
          transition:transform 0.6s ease;
        }
        .pill:hover::before{ transform:translateX(120%); }
        .pill:hover{
          border-color:rgba(200,160,255,0.65);
          background:linear-gradient(105deg,#111 0%,rgba(168,85,247,0.35) 48%,rgba(6,182,212,0.4) 100%);
          box-shadow:0 0 18px rgba(168,85,247,0.28), 0 0 30px rgba(6,182,212,0.16);
        }

        .header-right{ justify-self:end; display:flex; align-items:center; gap:10px; }

        .burger{
          display:none; width:42px; height:42px; border-radius:6px;
          border:1px solid var(--border); background:rgba(8,8,8,0.55);
          z-index:60; place-items:center; cursor:pointer;
          flex-direction:column; gap:5px;
          transition:border-color 0.25s ease, background 0.25s ease;
        }
        .burger:hover{ border-color:rgba(255,255,255,0.32); background:rgba(255,255,255,0.05); }
        .burger span{
          width:16px; height:1.5px; border-radius:1px; background:#fff;
          transition:transform 0.25s ease, opacity 0.2s ease;
        }
        body.menu-open .burger span:nth-child(1){ transform:translateY(6.5px) rotate(45deg); }
        body.menu-open .burger span:nth-child(2){ opacity:0; }
        body.menu-open .burger span:nth-child(3){ transform:translateY(-6.5px) rotate(-45deg); }

        /* ---- Buttons ---- */
        .btn{
          position:relative; isolation:isolate; overflow:hidden;
          display:inline-flex; align-items:center; justify-content:center;
          height: var(--btn-h); padding:0 16px; border-radius:6px;
          font-size: var(--btn); font-weight:500; letter-spacing:-0.02em; line-height:1;
          white-space:nowrap; cursor:pointer;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, color 0.35s ease, filter 0.35s ease;
        }
        .btn::after{
          content:""; position:absolute; inset:0;
          background:linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.45) 48%, transparent 76%);
          transform:translateX(-130%);
          transition:transform 0.65s ease;
        }
        .btn:hover::after{ transform:translateX(130%); }

        .btn-solid{
          background:linear-gradient(180deg,#ffffff 0%,#e7e7e7 48%,#cfcfcf 100%);
          color:#111; border:1px solid #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .btn-solid:hover{
          background:linear-gradient(180deg,#fff 0%,#f7f0ff 42%,#e5d5f5 100%);
          border-color:#f2eaff;
          box-shadow: inset 0 1px 0 #fff, 0 0 22px rgba(168,85,247,0.35), 0 8px 18px rgba(6,182,212,0.14);
        }
        .hero .btn-solid:hover{
          box-shadow: inset 0 1px 0 #fff, 0 0 26px rgba(168,85,247,0.4), 0 8px 20px rgba(6,182,212,0.18);
        }

        .btn-ghost{
          background:linear-gradient(135deg, rgba(168,85,247,0.1), rgba(0,0,0,0.45) 50%, rgba(6,182,212,0.08));
          color:#fff; border:1px solid rgba(198,198,198,0.45);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .btn-ghost:hover{
          background:linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,0,0,0.35) 48%, rgba(6,182,212,0.18));
          border-color:rgba(200,170,255,0.75);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 0 20px rgba(168,85,247,0.24), 0 0 30px rgba(6,182,212,0.14);
        }

        .hero-actions .btn-ghost{
          background:linear-gradient(135deg, rgba(168,85,247,0.14), rgba(0,0,0,0.5) 46%, rgba(6,182,212,0.12));
          border:1px solid rgba(198,198,198,0.55);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        }
        .hero-actions .btn-ghost:hover{
          box-shadow: 0 0 24px rgba(168,85,247,0.3), 0 0 36px rgba(6,182,212,0.18);
          border-color:rgba(200,170,255,0.8);
        }
        .hero-actions .btn{ height: var(--hero-btn-h); padding:0 18px; }

        /* ---- Hero ---- */
        .hero{
          display:flex; align-items:flex-end; justify-content:center;
          padding: 8px 24px var(--hero-gap); min-height:0;
        }
        .hero-copy{
          position:relative; z-index:1; display:flex; flex-direction:column;
          align-items:center; text-align:center;
          max-width: var(--copy-max); width:100%;
        }

        .badge{
          display:inline-flex; align-items:center; gap:8px;
          margin-bottom:22px; padding:9px 15px; border:1px solid rgba(168,85,247,0.35); border-radius:5px;
          background:linear-gradient(90deg,rgba(168,85,247,0.22) 0%,#0a0a0a 52%,rgba(6,182,212,0.22) 100%);
          color:#f2f2f2; font-size: var(--badge); font-weight:400; letter-spacing:-0.01em;
          box-shadow: 0 0 20px rgba(168,85,247,0.1);
        }
        .badge-star{ width:18px; height:20px; filter: drop-shadow(0 0 3px rgba(255,255,255,0.45)); }

        .hero h1{
          font-family: var(--font-inter), system-ui, sans-serif;
          font-weight:500; font-size: var(--h1); letter-spacing:-0.045em; line-height:1.12;
          color:#fff; display:flex; flex-direction:column; align-items:center;
        }
        .headline-line{ display:block; overflow:hidden; padding:0.06em 0.15em 0.14em; }
        .hero h1 em{
          font-family:"Instrument Serif","Times New Roman",Times,serif;
          font-style:italic; font-weight:400; font-size:1.08em; letter-spacing:-0.03em;
          background:linear-gradient(135deg, #a855f7 0%, #06b6d4 50%, #3b82f6 100%);
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:#a855f7;
        }

        .lede{
          max-width: var(--lede-max); margin-top:18px; color:#9a9a9a;
          font-size: var(--lede); font-weight:400; line-height:1.55; letter-spacing:-0.015em;
        }

        .hero-actions{
          display:flex; flex-wrap:wrap; align-items:center; justify-content:center;
          gap:10px; margin-top:26px;
        }

        /* ---- Stats footer ---- */
        .stats{
          display:flex; align-items:center; justify-content:space-between; gap:24px;
          padding: 0 var(--stats-x) var(--stats-y);
          padding-bottom: max(var(--stats-y), env(safe-area-inset-bottom));
          color:#d8d8d8;
        }
        .stat{
          display:inline-flex; align-items:center; gap:14px;
          font-size: var(--stat-size); letter-spacing:-0.015em; white-space:nowrap;
        }
        .stat-icon{ width:20px; height:20px; color:#e8e8e8; flex-shrink:0; }
        .stat-icon-wide{ width:38px; height:21px; flex-shrink:0; }

        /* ---- Entrance motion ---- */
        .appear{
          opacity:1;
          animation-duration:1.05s; animation-fill-mode:both;
          animation-timing-function: cubic-bezier(0.16,1,0.3,1);
          animation-delay: var(--d, 0.08s);
        }
        .appear.is-in{ animation:none; opacity:1; transform:none; clip-path:none; filter:none; }

        .appear--scale{ animation-name:in-scale; }
        .appear--soft{ animation-name:in-soft; }
        .appear--mask{ animation-name:in-mask; }
        .appear--pop{ animation-name:in-pop; }
        .appear--btn{ animation-name:in-btn; }
        .appear--side{ animation-name:in-side; }
        .appear--stat{ animation-name:in-stat; }

        @keyframes in-scale{ from{ opacity:0; transform:scale(0.84);} to{ opacity:1; transform:scale(1);} }
        @keyframes in-soft{ from{ opacity:0; transform:translateY(14px);} to{ opacity:1; transform:translateY(0);} }
        @keyframes in-mask{ from{ opacity:0; transform:translateY(40%);} to{ opacity:1; transform:translateY(0);} }
        @keyframes in-pop{ 0%{ opacity:0; transform:scale(0.9);} 70%{ opacity:1; transform:scale(1.03);} 100%{ opacity:1; transform:scale(1);} }
        @keyframes in-btn{ from{ opacity:0; transform:translateY(18px) scale(0.94);} to{ opacity:1; transform:translateY(0) scale(1);} }
        @keyframes in-side{ from{ opacity:0; transform:translateX(22px);} to{ opacity:1; transform:translateX(0);} }
        @keyframes in-stat{ from{ opacity:0; transform:translateY(20px);} to{ opacity:1; transform:translateY(0);} }
        @keyframes in-star{ 0%{ transform:scale(0.2) rotate(-50deg);} 65%{ transform:scale(1.2) rotate(8deg);} 100%{ transform:scale(1) rotate(0deg);} }
        @keyframes in-em{ from{ opacity:0.35; filter:blur(4px);} to{ opacity:1; filter:blur(0);} }

        .badge-star{ animation: in-star 0.9s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
        .hero h1 em{ animation: in-em 1.2s cubic-bezier(0.16,1,0.3,1) 0.72s both; }

        .logo{ --d:0.08s; }
        #site-nav a:nth-child(1){ --d:0.16s; }
        #site-nav a:nth-child(2){ --d:0.28s; }
        #site-nav a:nth-child(3){ --d:0.40s; }
        #site-nav a:nth-child(4){ --d:0.52s; }
        .header-cta, .burger{ --d:0.34s; }
        .badge{ --d:0.22s; }
        .headline-line:nth-child(1){ --d:0.42s; }
        .headline-line:nth-child(2){ --d:0.62s; }
        .lede{ --d:0.82s; animation-duration:1.25s; }
        .hero-actions .btn-solid{ --d:0.96s; }
        .hero-actions .btn-ghost{ --d:1.10s; }
        .stat:nth-child(1){ --d:1.12s; }
        .stat:nth-child(2){ --d:1.28s; }
        .stat:nth-child(3){ --d:1.44s; }

        @media (prefers-reduced-motion: reduce){
          .starlight-hero-root *,.starlight-hero-root *::before,.starlight-hero-root *::after{ transition:none !important; animation:none !important; }
          .appear, .hero-photo, .hero h1 em, .badge-star{
            opacity:1; transform:none; clip-path:none; filter:none;
          }
        }

        /* ---- Mobile menu ---- */
        .menu-backdrop{
          display:none; position:fixed; inset:0; z-index:40;
          background:rgba(8,8,8,0.42); opacity:0; visibility:hidden;
          transition: opacity 0.28s ease, backdrop-filter 0.28s ease, visibility 0.28s ease;
        }
        body.menu-open .menu-backdrop{
          opacity:1; visibility:visible;
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
        }
        body.menu-open{ overflow:hidden; }

        /* ================= Responsive ================= */

        @media (min-width:901px){
          html, body{ height:100%; overflow:hidden; }
          .page{ height:100vh; height:100dvh; overflow:hidden; }
        }

        @media (min-width:1600px){
          :root{
            --logo:17px; --logo-mark:24px; --nav:15px; --nav-h:44px;
            --btn:15px; --btn-h:44px; --hero-btn-h:48px; --h1:64px; --lede:18px;
            --badge:13.5px; --stat-size:15px; --header-y:28px; --header-x:64px;
            --stats-x:96px; --stats-y:44px; --copy-max:980px; --lede-max:540px;
          }
          .pill{ padding:0 20px; }
          .badge{ margin-bottom:26px; }
          .lede{ margin-top:22px; }
          .hero-actions{ margin-top:30px; gap:12px; }
          .stat-icon{ width:22px; height:22px; }
          .stat-icon-wide{ width:45px; height:24px; }
        }

        @media (min-width:1920px){
          :root{
            --logo:18px; --logo-mark:26px; --nav:16px; --nav-h:48px;
            --btn:16px; --btn-h:48px; --hero-btn-h:52px; --h1:76px; --lede:20px;
            --badge:14.5px; --stat-size:16px; --header-y:32px; --header-x:80px;
            --stats-x:120px; --stats-y:52px; --copy-max:1120px; --lede-max:620px;
          }
          #site-nav{ gap:10px; }
          .pill{ padding:0 22px; }
          .btn{ padding:0 22px; }
          .badge{ padding:10px 15px; }
          .stat-icon-wide{ width:48px; height:26px; }
        }

        @media (min-width:2560px){
          :root{ --h1:88px; --lede:22px; --header-x:120px; --stats-x:160px; --copy-max:1280px; --lede-max:680px; }
        }

        @media (min-width:1280px) and (max-width:1599px){
          :root{ --h1:54px; --lede:16px; --header-x:48px; --stats-x:80px; --copy-max:900px; }
        }

        @media (min-width:901px) and (max-width:1279px){
          :root{
            --logo:15px; --nav:13px; --nav-h:36px; --btn:13px; --btn-h:38px;
            --hero-btn-h:40px; --h1:42px; --lede:15px; --badge:12px; --stat-size:12.5px;
            --header-y:16px; --header-x:28px; --stats-x:36px; --stats-y:28px;
            --hero-gap:64px; --copy-max:760px; --lede-max:440px;
          }
          .pill{ padding:0 14px; }
          .badge{ margin-bottom:16px; }
          .lede{ margin-top:14px; }
          .hero-actions{ margin-top:20px; }
        }

        @media (min-width:901px) and (max-height:850px){
          :root{ --header-y:14px; --stats-y:24px; --hero-gap:48px; --h1:40px; }
          .badge{ margin-bottom:12px; }
          .lede{ margin-top:12px; }
          .hero-actions{ margin-top:16px; }
        }

        @media (min-width:901px) and (max-height:720px){
          :root{ --h1:34px; --lede:14px; --hero-gap:32px; --stats-y:18px; --nav-h:30px; --btn-h:34px; --hero-btn-h:36px; }
          .badge{ margin-bottom:8px; }
        }

        @media (max-width:900px){
          html, body{ height:auto; overflow-y:auto; overflow-x:hidden; }
          .page{ height:auto; min-height:100vh; min-height:100dvh; overflow:visible; }

          .header{
            grid-template-columns:1fr auto auto; gap:8px;
            padding: max(var(--header-y), calc(env(safe-area-inset-top) + 10px)) 16px 10px;
          }
          .logo, .header-cta, .burger{ z-index:80; }
          #site-nav{ display:none; }
          .burger{ display:grid; }

          .menu-backdrop{ display:block; }
          body.menu-open #site-nav{
            display:flex; position:fixed; inset:0; z-index:45;
            flex-direction:column; align-items:stretch; justify-content:flex-start;
            background:transparent; gap:12px;
            padding: max(96px, calc(env(safe-area-inset-top) + 88px)) 22px 32px;
          }
          body.menu-open #site-nav a{
            width:100%; height:56px; font-size:19px; border-radius:10px; justify-content:center;
          }

          .hero{ padding:20px 20px 64px; align-items:flex-end; }
          .hero-copy{ max-width:100%; }
          .lede{ max-width:100%; }

          .stats{
            flex-direction:column; align-items:center; gap:16px;
          }
          .stat{ white-space:normal; text-align:center; }

          :root{
            --logo:16px; --btn:15px; --btn-h:46px; --hero-btn-h:48px; --h1:36px;
            --lede:16.5px; --badge:13.5px; --stat-size:15px;
            --header-x:16px; --stats-x:20px; --stats-y:28px; --hero-gap:36px;
          }
        }

        @media (max-width:560px){
          :root{ --h1:34px; --lede:16px; --header-x:16px; }
          .hero-actions{ flex-direction:column; align-items:stretch; }
          .hero-actions .btn{ width:100%; }
        }
      `}</style>

      <div className="starlight-hero-root">
        <div className="grain"></div>

        <div className="bg-glow" aria-hidden="true">
          <div className="glow-orb glow-orb--a"></div>
          <div className="glow-orb glow-orb--b"></div>
          <div className="glow-orb glow-orb--c"></div>
        </div>

        <div className="hero-photo appear" id="heroPhoto">
          <video autoPlay muted loop playsInline preload="auto">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="page">
          <div className="menu-backdrop" id="menuBackdrop"></div>

          <header className="header">
            <a href="#top" className="logo appear appear--scale" aria-label="Starlight AI">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <g transform="rotate(-30 12 12)">
                  <circle cx="7.3" cy="3.2" r="1.45" />
                  <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                  <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                  <circle cx="16.7" cy="20.8" r="1.45" />
                </g>
              </svg>
              Starlight<span className="logo-suffix">.ai</span>
            </a>

            <nav id="site-nav" aria-label="Primary">
              <a href="#benefits" className="pill appear appear--scale">Benefits</a>
              <a href="#how-it-works" className="pill appear appear--soft">How It Works</a>
              <a href="#faqs" className="pill appear appear--scale">FAQs</a>
              <a href="#pricing" className="pill appear appear--soft">Pricing</a>
            </nav>

            <div className="header-right">
              <a href="#start" className="btn btn-solid header-cta appear appear--scale">Start for Free</a>
              <button className="burger" id="burgerBtn" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">
                <span></span><span></span><span></span>
              </button>
            </div>
          </header>

          <main className="hero" id="top">
            <div className="hero-copy">
              <div className="badge appear appear--pop">
                <svg className="badge-star" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
                </svg>
                Operational AI Infrastructure
              </div>

              <h1>
                <span className="headline-line appear appear--mask">Train <em>AI agents</em> on your</span>
                <span className="headline-line appear appear--mask">workflows in minutes.</span>
              </h1>

              <p className="lede appear appear--soft">Deploy adaptive AI agents that learn, execute, and scale operational tasks across your business.</p>

              <div className="hero-actions">
                <a href="#start" className="btn btn-solid appear appear--btn">Start for Free</a>
                <a href="#demo" className="btn btn-ghost appear appear--side">See it in action</a>
              </div>
            </div>
          </main>

          <footer className="stats">
            <div className="stat appear appear--stat">
              <svg className="stat-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="statGradA" x1="3" y1="2" x2="14" y2="22">
                    <stop offset="0" stopColor="#a855f7" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#3a3a3a" stopOpacity="0.62" />
                  </linearGradient>
                  <linearGradient id="statGradB" x1="13" y1="2" x2="24" y2="22">
                    <stop offset="0" stopColor="#3a3a3a" stopOpacity="0.38" />
                    <stop offset="1" stopColor="#06b6d4" stopOpacity="0.65" />
                  </linearGradient>
                </defs>
                <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#statGradA)" />
                <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#statGradB)" />
                <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
              </svg>
              4.2M+ workflows automated
            </div>

            <div className="stat appear appear--stat">
              <svg className="stat-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
                <path d="M12 7.1v7.4" stroke="#111" strokeWidth="1.85" strokeLinecap="round" />
                <path d="M8.15 12.35L12 16.2l3.85-3.85" stroke="#111" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              92% reduction in manual operations
            </div>

            <div className="stat appear appear--stat">
              <svg className="stat-icon-wide" viewBox="0 0 40 22" fill="none" aria-hidden="true">
                <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
                <polygon points="5.4,5.2 8.4,3.4 7.6,7.4" fill="#2b2b2b" />
                <polygon points="15,5.2 12,3.4 12.8,7.4" fill="#2b2b2b" />
                <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
                <circle cx="8.5" cy="11.6" r="0.7" fill="#1a1a1a" />
                <circle cx="11.9" cy="11.6" r="0.7" fill="#1a1a1a" />

                <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
                <circle cx="17.6" cy="10" r="1.7" fill="#000" />
                <circle cx="22.8" cy="10" r="1.7" fill="#000" />
                <ellipse cx="20.2" cy="13" rx="1.1" ry="0.8" fill="#000" />
                <path d="M17 15.4c1 1.2 5.4 1.2 6.4 0" stroke="#111" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
                <text x="30.2" y="15.1" fontFamily="var(--font-inter), sans-serif" fontSize="12.5" fontWeight="700" fill="#fff" textAnchor="middle">e</text>
              </svg>
              180+ operational teams onboarded
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
