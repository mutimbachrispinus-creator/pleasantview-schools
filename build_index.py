import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pleasantview Schools | Seeking the Highest</title>
  <meta name="description" content="Pleasantview Schools - A premier group of Christian-ethos day and boarding schools offering Competency Based Curriculum (CBC) and 8.4.4 in Githunguri, Kiambu County." />
  
  <!-- Google Fonts: M PLUS 2 matching St Andrew's Turi -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@300;400;500;600;700;800&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet" />
  
  <!-- Font Awesome 6 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <style>
    :root {
      --primary-navy: #05286b;
      --dark-navy: #0a1e43;
      --medium-blue: #335390;
      --light-blue: #7c98b3;
      --soft-bg: #ebeef4;
      --gold-accent: #e0a82e;
      --gold-dark: #c59124;
      --text-dark: #222222;
      --text-muted: rgba(68, 68, 68, 0.75);
      --font-main: 'M PLUS 2', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-serif: 'Cinzel', Georgia, serif;
      --wrapper-max: calc(1600px + 6vw);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font-main);
      color: var(--text-dark);
      background-color: #ffffff;
      line-height: 1.6;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    a { color: inherit; text-decoration: none; transition: all 0.3s ease; }
    img { max-width: 100%; height: auto; display: block; }
    button, input, select, textarea { font-family: inherit; }

    .wrapper {
      max-width: var(--wrapper-max);
      margin: 0 auto;
      padding: 0 4vw;
      width: 100%;
    }

    /* TYPOGRAPHY */
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-main);
      font-weight: 700;
      line-height: 1.15;
      color: var(--primary-navy);
    }
    h1 { font-size: clamp(38px, 4.2vw, 76px); }
    h2 { font-size: clamp(30px, 3.2vw, 56px); }
    h3 { font-size: clamp(24px, 2.4vw, 42px); }
    h4 { font-size: clamp(19px, 1.6vw, 28px); font-weight: 600; }
    h5 { font-size: clamp(14px, 1.1vw, 17px); font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--medium-blue); }

    /* BUTTONS */
    .btn, .button {
      border: 2px solid var(--primary-navy);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px 36px;
      text-align: center;
      text-transform: uppercase;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 1px;
      transition: all 0.35s ease;
      background: transparent;
    }
    .button-primary {
      background: #ffffff;
      color: var(--primary-navy);
      border-color: #ffffff;
    }
    .button-primary:hover {
      background: var(--primary-navy);
      color: #ffffff;
      border-color: var(--primary-navy);
    }
    .button-secondary {
      background: var(--primary-navy);
      color: #ffffff;
      border-color: var(--primary-navy);
    }
    .button-secondary:hover {
      background: #ffffff;
      color: var(--primary-navy);
    }
    .button-tertiary {
      background: var(--soft-bg);
      color: var(--primary-navy);
      border-color: var(--soft-bg);
    }
    .button-tertiary:hover {
      background: var(--primary-navy);
      color: #ffffff;
      border-color: var(--primary-navy);
    }
    .button-gold {
      background: var(--gold-accent);
      color: #000000;
      border-color: var(--gold-accent);
    }
    .button-gold:hover {
      background: var(--gold-dark);
      color: #ffffff;
      border-color: var(--gold-dark);
    }

    /* TOP & MAIN NAVIGATION */
    nav.main-nav {
      background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 75%, transparent 100%);
      padding: 18px 0;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 100;
      transition: all 0.4s ease-in-out;
    }
    nav.main-nav.scrolled {
      position: fixed;
      background: var(--dark-navy);
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      padding: 12px 0;
    }

    nav.main-nav .wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 16px;
      color: #ffffff;
      text-decoration: none;
    }
    .brand-crest {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold-accent), var(--gold-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      border: 2px solid rgba(255,255,255,0.8);
      font-size: 28px;
      color: var(--primary-navy);
      font-weight: 800;
    }
    .brand-text h1 {
      font-family: var(--font-serif);
      font-size: clamp(20px, 1.8vw, 26px);
      letter-spacing: 2px;
      color: #ffffff;
      line-height: 1;
      margin: 0;
    }
    .brand-text small {
      display: block;
      font-family: var(--font-main);
      font-size: 11px;
      letter-spacing: 2px;
      color: var(--gold-accent);
      text-transform: uppercase;
      font-weight: 600;
      margin-top: 4px;
    }

    .nav-column {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    /* TOP NAV (META) */
    .top-nav {
      display: flex;
      align-items: center;
      gap: 18px;
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
    }
    .top-nav ul {
      display: flex;
      list-style: none;
      align-items: center;
      gap: 12px;
    }
    .top-nav ul li {
      position: relative;
    }
    .top-nav ul li:not(:last-child):after {
      content: "|";
      color: rgba(255,255,255,0.4);
      margin-left: 12px;
    }
    .top-nav a:hover { color: var(--gold-accent); }

    .search-toggle-btn {
      cursor: pointer;
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.15);
      padding: 5px 14px;
      border-radius: 4px;
      font-size: 13px;
      transition: background 0.3s;
    }
    .search-toggle-btn:hover {
      background: var(--medium-blue);
      color: #ffffff;
    }

    /* BOTTOM NAV (MAIN MENU) */
    .bottom-nav ul {
      display: flex;
      list-style: none;
      align-items: center;
    }
    .bottom-nav ul li {
      position: relative;
      padding: 8px 0;
    }
    .bottom-nav ul li:not(:last-child):after {
      content: "|";
      color: rgba(255,255,255,0.4);
      font-weight: 300;
      padding: 0 14px;
    }
    .bottom-nav ul li > a {
      color: #ffffff;
      font-size: clamp(14px, 1.05vw, 17px);
      font-weight: 700;
      text-transform: capitalize;
      letter-spacing: 0.5px;
    }
    .bottom-nav ul li > a:hover {
      color: var(--gold-accent);
    }

    /* DROPDOWNS */
    .bottom-nav .sub-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--dark-navy);
      min-width: 240px;
      padding: 12px 0;
      list-style: none;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      border-top: 3px solid var(--gold-accent);
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s ease;
      display: block;
    }
    .bottom-nav ul li:hover .sub-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .bottom-nav .sub-menu li {
      padding: 0;
      display: block;
    }
    .bottom-nav .sub-menu li:after { display: none !important; }
    .bottom-nav .sub-menu li a {
      display: block;
      padding: 10px 20px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
    }
    .bottom-nav .sub-menu li a:hover {
      background: var(--medium-blue);
      color: var(--gold-accent);
      padding-left: 26px;
    }

    /* MOBILE BURGER */
    .mobile-burger {
      display: none;
      background: var(--medium-blue);
      color: #ffffff;
      border: 0;
      font-size: 26px;
      padding: 8px 14px;
      border-radius: 4px;
      cursor: pointer;
    }

    /* HERO SECTION */
    .hero {
      position: relative;
      height: 85vh;
      min-height: 580px;
      background: var(--dark-navy);
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    .hero-bg-slider {
      position: absolute;
      inset: 0;
      z-index: 1;
    }
    .hero-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out;
      transform: scale(1.04);
    }
    .hero-slide.active {
      opacity: 1;
      transform: scale(1);
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(5,40,107,0.55) 0%, rgba(10,30,67,0.85) 100%);
      z-index: 2;
    }

    /* HERO ROTATED BUTTONS (Exact St Andrew's Turi Match!) */
    .hero-buttons {
      position: absolute;
      right: 0;
      top: 50%;
      transform: rotate(270deg) translateX(50%);
      transform-origin: right bottom;
      z-index: 25;
      display: flex;
      gap: 4px;
    }
    .hero-button {
      color: #ffffff;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 1.5px;
      padding: 12px 22px 16px;
      text-transform: uppercase;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      box-shadow: -2px -2px 10px rgba(0,0,0,0.2);
    }
    .hero-button i { font-size: 14px; }
    .hero-button.light-blue { background-color: var(--medium-blue); }
    .hero-button.light-blue:hover { background-color: var(--primary-navy); }
    .hero-button.dark-blue { background-color: var(--primary-navy); }
    .hero-button.dark-blue:hover { background-color: #031a46; }

    /* HERO CONTENT */
    .hero-content {
      position: relative;
      z-index: 10;
      color: #ffffff;
      max-width: 900px;
      padding-top: 80px;
    }
    .hero-content h5 {
      color: var(--gold-accent);
      margin-bottom: 16px;
      display: inline-block;
      border-bottom: 2px solid var(--gold-accent);
      padding-bottom: 4px;
    }
    .hero-content h1 {
      color: #ffffff;
      margin-bottom: 24px;
      text-transform: uppercase;
      font-size: clamp(34px, 4.2vw, 68px);
      text-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    .hero-content p {
      font-size: clamp(17px, 1.35vw, 22px);
      margin-bottom: 36px;
      line-height: 1.6;
      color: rgba(255,255,255,0.92);
      max-width: 760px;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    /* TEXT INTRO COMPONENT */
    .text-component {
      padding: clamp(60px, 6vw, 100px) 0;
      text-align: center;
      background: #ffffff;
    }
    .text-component .lead-badge {
      display: inline-block;
      color: var(--medium-blue);
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      font-size: 13px;
      margin-bottom: 12px;
    }
    .text-component h2 {
      text-transform: uppercase;
      margin-bottom: 20px;
      letter-spacing: 1px;
    }
    .gold-divider {
      width: 70px;
      height: 4px;
      background: var(--gold-accent);
      margin: 0 auto 30px;
    }
    .text-component p.lead {
      font-size: clamp(18px, 1.35vw, 23px);
      color: #333333;
      max-width: 980px;
      margin: 0 auto 24px;
      line-height: 1.7;
    }
    .text-component p.body-text {
      font-size: 16px;
      color: var(--text-muted);
      max-width: 860px;
      margin: 0 auto;
      line-height: 1.8;
    }

    /* SIGNPOSTING (OUR SCHOOLS CARDS) */
    section.signposting {
      background: var(--soft-bg);
      padding: clamp(60px, 6vw, 100px) 0;
    }
    section.signposting .section-header {
      text-align: center;
      margin-bottom: 50px;
    }
    section.signposting .section-header h3 {
      text-transform: uppercase;
      margin-top: 10px;
    }
    .signposts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 45px;
    }
    .signpost-card {
      aspect-ratio: 16 / 11;
      position: relative;
      background-size: cover;
      background-position: center;
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: all 0.4s ease;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 30px 25px;
      color: #ffffff;
      text-decoration: none;
    }
    .signpost-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 35px rgba(5,40,107,0.25);
    }
    .signpost-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(5,40,107,0.92) 100%);
      transition: background 0.4s ease;
    }
    .signpost-card:hover .signpost-overlay {
      background: linear-gradient(180deg, rgba(5,40,107,0.4) 0%, rgba(5,40,107,0.96) 100%);
    }
    .signpost-card > * { position: relative; z-index: 2; }
    .signpost-category {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold-accent);
      margin-bottom: 6px;
    }
    .signpost-title {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 6px;
      line-height: 1.2;
    }
    .signpost-level {
      font-size: 13px;
      color: rgba(255,255,255,0.8);
      margin-bottom: 14px;
    }
    .signpost-stats-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(4px);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      width: fit-content;
      margin-bottom: 12px;
    }
    .signpost-link-text {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--gold-accent);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .signpost-link-text i { transition: transform 0.3s; }
    .signpost-card:hover .signpost-link-text i { transform: translateX(6px); }

    .signposting-bottom-link {
      text-align: center;
    }

    /* SLIDESHOW (VISION, MISSION, VALUES) */
    section.slideshow-section {
      position: relative;
      min-height: 520px;
      background: var(--dark-navy);
      display: flex;
      align-items: center;
      color: #ffffff;
      overflow: hidden;
    }
    .vmv-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 6vw;
    }
    .vmv-slide.active { opacity: 1; }
    .vmv-overlay {
      position: absolute;
      inset: 0;
      background: rgba(5, 40, 107, 0.82);
    }
    .vmv-content {
      position: relative;
      z-index: 2;
      max-width: 900px;
    }
    .vmv-content h5 {
      color: var(--gold-accent);
      margin-bottom: 15px;
    }
    .vmv-content h2 {
      color: #ffffff;
      font-size: clamp(32px, 3.8vw, 56px);
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    .vmv-content h4 {
      color: rgba(255,255,255,0.95);
      font-size: clamp(20px, 1.8vw, 30px);
      font-weight: 300;
      line-height: 1.5;
    }
    .vmv-tabs {
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      gap: 15px;
    }
    .vmv-tab-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.4);
      color: #ffffff;
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 20px;
      transition: all 0.3s;
    }
    .vmv-tab-btn.active, .vmv-tab-btn:hover {
      background: var(--gold-accent);
      color: #000000;
      border-color: var(--gold-accent);
    }

    /* REALISTIC POPULATION & STATS COUNTERS */
    .stats-bar-section {
      background: var(--primary-navy);
      color: #ffffff;
      padding: 50px 0;
      border-top: 4px solid var(--gold-accent);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 30px;
      text-align: center;
    }
    .stat-item b {
      display: block;
      font-size: clamp(36px, 3.5vw, 54px);
      font-weight: 800;
      color: var(--gold-accent);
      line-height: 1;
      margin-bottom: 8px;
    }
    .stat-item span {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255,255,255,0.9);
    }

    /* NEWS & EVENTS (Exact Turi Split Layout) */
    section.news-posts-section {
      padding: clamp(60px, 6vw, 100px) 0;
      background: #ffffff;
    }
    .news-split-container {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 40px;
      align-items: start;
    }
    .news-static-box {
      background: var(--soft-bg);
      padding: 40px 30px;
      border-radius: 4px;
      border-left: 5px solid var(--primary-navy);
    }
    .news-static-box h5 {
      color: var(--medium-blue);
      margin-bottom: 10px;
    }
    .news-static-box h3 {
      font-size: 32px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .news-static-box .line {
      width: 50px;
      height: 3px;
      background: var(--gold-accent);
      margin-bottom: 25px;
    }
    .news-static-box p {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 30px;
      line-height: 1.6;
    }

    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }
    .single-news-item {
      border: 1px solid var(--soft-bg);
      border-radius: 4px;
      overflow: hidden;
      background: #ffffff;
      transition: all 0.35s ease;
      display: flex;
      flex-direction: column;
    }
    .single-news-item:hover {
      box-shadow: 0 12px 30px rgba(0,0,0,0.08);
      transform: translateY(-5px);
    }
    .single-news-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    .single-news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .single-news-item:hover .single-news-image img {
      transform: scale(1.08);
    }
    .news-arrow-badge {
      position: absolute;
      bottom: 12px;
      right: 12px;
      width: 38px;
      height: 38px;
      background: var(--primary-navy);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.3s;
    }
    .single-news-item:hover .news-arrow-badge {
      background: var(--gold-accent);
      color: #000000;
    }
    .single-news-content {
      padding: 24px 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .single-news-content h6 {
      color: var(--medium-blue);
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .single-news-content h4 {
      font-size: 18px;
      margin-bottom: 10px;
      line-height: 1.35;
      color: var(--primary-navy);
    }
    .single-news-content p.excerpt {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 15px;
      flex: 1;
    }
    .news-date {
      font-size: 12px;
      color: #888888;
      font-weight: 500;
    }

    /* PARENTS TESTIMONIALS (From Netlify Content) */
    section.testimonials-section {
      background: var(--soft-bg);
      padding: clamp(60px, 6vw, 100px) 0;
    }
    .testimonials-header {
      text-align: center;
      margin-bottom: 50px;
    }
    .testimonials-header h3 {
      text-transform: uppercase;
      margin-top: 8px;
    }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    .testimonial-card {
      background: #ffffff;
      padding: 35px 30px;
      border-radius: 4px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
      border-top: 4px solid var(--primary-navy);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .quote-icon {
      font-size: 32px;
      color: var(--gold-accent);
      margin-bottom: 16px;
    }
    .testimonial-text {
      font-size: 16px;
      font-style: italic;
      color: #444444;
      line-height: 1.7;
      margin-bottom: 25px;
    }
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .author-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--medium-blue);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
    }
    .author-info h4 {
      font-size: 16px;
      margin-bottom: 2px;
      color: var(--primary-navy);
    }
    .author-info span {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* FACILITIES SPOTLIGHT (BOARDING & TRANSPORT) */
    section.facilities-spotlight {
      padding: clamp(60px, 6vw, 100px) 0;
      background: #ffffff;
    }
    .spotlight-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .spotlight-box {
      position: relative;
      min-height: 360px;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      padding: 40px 35px;
      color: #ffffff;
      background-size: cover;
      background-position: center;
    }
    .spotlight-box .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(5,40,107,0.3) 0%, rgba(10,30,67,0.92) 100%);
    }
    .spotlight-box-content {
      position: relative;
      z-index: 2;
    }
    .spotlight-box-content h3 {
      color: #ffffff;
      margin-bottom: 12px;
    }
    .spotlight-box-content p {
      font-size: 15px;
      color: rgba(255,255,255,0.9);
      margin-bottom: 20px;
      line-height: 1.6;
    }

    /* FOOTER (Exact St Andrew's Turi Styling) */
    footer {
      background: var(--soft-bg);
      padding: 70px 0 50px;
      color: #444444;
      border-top: 1px solid #d5dae2;
    }
    footer .wrapper {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr 120px;
      gap: 40px;
    }
    .footer-col h5.column-title {
      color: var(--primary-navy);
      margin-bottom: 20px;
      font-size: 15px;
      text-transform: uppercase;
    }
    .footer-col p {
      font-size: 14.5px;
      line-height: 1.7;
      margin-bottom: 15px;
      color: rgba(68, 68, 68, 0.85);
    }
    .footer-col ul {
      list-style: none;
    }
    .footer-col ul li {
      margin-bottom: 10px;
    }
    .footer-col ul li a {
      color: rgba(68, 68, 68, 0.85);
      font-size: 14px;
      font-weight: 500;
    }
    .footer-col ul li a:hover {
      color: var(--medium-blue);
      padding-left: 4px;
    }
    .footer-socials {
      display: flex;
      gap: 12px;
      margin-top: 18px;
    }
    .footer-socials a {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      background: var(--primary-navy);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.3s;
    }
    .footer-socials a:hover {
      background: var(--gold-accent);
      color: #000000;
      transform: translateY(-3px);
    }
    .top-scroll-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--medium-blue);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      gap: 8px;
    }
    .top-scroll-btn i {
      font-size: 36px;
      animation: bounceArrow 1.6s infinite ease-in-out;
    }
    @keyframes bounceArrow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    /* COPYRIGHT BAR */
    .copyright-bar {
      background: var(--dark-navy);
      color: rgba(255,255,255,0.75);
      padding: 20px 0;
      font-size: 13px;
    }
    .copyright-bar .wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    .copyright-links {
      display: flex;
      gap: 20px;
      list-style: none;
    }
    .copyright-links a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
    }
    .copyright-links a:hover {
      color: var(--gold-accent);
    }

    /* SEARCH MODAL (Exact St Andrew's Turi Match) */
    .search-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10,30,67,0.96);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(8px);
    }
    .search-modal-backdrop.open { display: flex; }
    .search-modal-box {
      width: 100%;
      max-width: 800px;
      color: #ffffff;
      position: relative;
    }
    .search-close-btn {
      position: absolute;
      top: -50px;
      right: 0;
      background: none;
      border: 0;
      color: #ffffff;
      font-size: 36px;
      cursor: pointer;
    }
    .search-modal-box h2 {
      color: #ffffff;
      margin-bottom: 25px;
      text-align: center;
      font-size: clamp(28px, 3.2vw, 48px);
    }
    .search-input-wrap {
      display: flex;
      gap: 10px;
      border-bottom: 2px solid var(--gold-accent);
      padding-bottom: 12px;
      margin-bottom: 30px;
    }
    .search-input-wrap input {
      flex: 1;
      background: transparent;
      border: 0;
      font-size: 24px;
      color: #ffffff;
      outline: none;
    }
    .search-input-wrap input::placeholder { color: rgba(255,255,255,0.4); }
    .search-results-list {
      max-height: 400px;
      overflow-y: auto;
      list-style: none;
    }
    .search-results-list li a {
      display: block;
      padding: 14px 20px;
      background: rgba(255,255,255,0.08);
      margin-bottom: 8px;
      border-radius: 4px;
      color: #ffffff;
      font-weight: 600;
    }
    .search-results-list li a:hover {
      background: var(--medium-blue);
      color: var(--gold-accent);
      padding-left: 28px;
    }

    /* SUB-PAGES & TEMPLATES */
    .subpage-hero {
      position: relative;
      height: 45vh;
      min-height: 340px;
      background: var(--dark-navy);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #ffffff;
      background-size: cover;
      background-position: center;
    }
    .subpage-hero .overlay {
      position: absolute;
      inset: 0;
      background: rgba(5,40,107,0.85);
    }
    .subpage-hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      padding: 0 4vw;
    }
    .subpage-hero h1 {
      color: #ffffff;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    .subpage-hero p {
      font-size: 18px;
      color: rgba(255,255,255,0.9);
    }

    .school-subbar {
      background: var(--primary-navy);
      color: #ffffff;
      padding: 14px 0;
      border-bottom: 3px solid var(--gold-accent);
    }
    .school-subbar .wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    .school-subbar h4 {
      color: #ffffff;
      margin: 0;
      font-size: 18px;
    }
    .school-subbar-links {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      list-style: none;
    }
    .school-subbar-links a {
      color: rgba(255,255,255,0.85);
      font-size: 13.5px;
      font-weight: 600;
    }
    .school-subbar-links a:hover {
      color: var(--gold-accent);
    }

    .subpage-body {
      padding: 60px 0;
      background: #ffffff;
    }

    /* FORMS */
    .custom-form {
      display: grid;
      gap: 16px;
      max-width: 650px;
      background: var(--soft-bg);
      padding: 40px;
      border-radius: 4px;
      border-left: 5px solid var(--primary-navy);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--primary-navy);
    }
    .custom-form input, .custom-form select, .custom-form textarea {
      padding: 14px 18px;
      border: 1px solid #c2c9d6;
      border-radius: 4px;
      font-size: 15px;
      background: #ffffff;
      outline: none;
    }
    .custom-form input:focus, .custom-form select:focus, .custom-form textarea:focus {
      border-color: var(--primary-navy);
      box-shadow: 0 0 0 3px rgba(5,40,107,0.15);
    }

    /* ADMIN PANEL MODAL / SECTION */
    .admin-panel-container {
      background: #ffffff;
      border-radius: 6px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      padding: 40px;
      margin: 40px auto;
      max-width: 1100px;
    }
    .admin-badge {
      display: inline-block;
      background: var(--primary-navy);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .admin-tabs {
      display: flex;
      gap: 10px;
      border-bottom: 2px solid var(--soft-bg);
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    .admin-tab {
      padding: 12px 24px;
      background: var(--soft-bg);
      border: 0;
      font-weight: 700;
      font-size: 14px;
      color: var(--primary-navy);
      cursor: pointer;
      border-radius: 4px 4px 0 0;
    }
    .admin-tab.active {
      background: var(--primary-navy);
      color: #ffffff;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .admin-table th, .admin-table td {
      padding: 12px 15px;
      border: 1px solid #dde2ec;
      text-align: left;
      font-size: 14px;
    }
    .admin-table th {
      background: var(--soft-bg);
      font-weight: 700;
      color: var(--primary-navy);
    }

    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 1080px) {
      .bottom-nav { display: none; }
      .mobile-burger { display: block; }
      .hero-buttons { display: none; }
      .news-split-container { grid-template-columns: 1fr; }
      footer .wrapper { grid-template-columns: 1fr 1fr; }
      .spotlight-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .top-nav ul { display: none; }
      footer .wrapper { grid-template-columns: 1fr; }
      .custom-form { padding: 25px; }
    }
  </style>
</head>
<body>

  <!-- SEARCH MODAL -->
  <div id="searchModal" class="search-modal-backdrop">
    <div class="search-modal-box">
      <button class="search-close-btn" onclick="toggleSearch(false)">&times;</button>
      <h2>What are you looking for?</h2>
      <div class="search-input-wrap">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 24px; color: var(--gold-accent); margin-top: 4px;"></i>
        <input type="text" id="searchInput" placeholder="Search schools, admissions, news, academics..." oninput="handleSearch(this.value)" />
      </div>
      <ul id="searchResults" class="search-results-list">
        <!-- Live search results pop here -->
      </ul>
    </div>
  </div>

  <!-- MAIN NAVIGATION -->
  <nav class="main-nav" id="mainNav">
    <div class="wrapper">
      <!-- LOGO -->
      <a href="#/" class="brand-logo">
        <div class="brand-crest">PV</div>
        <div class="brand-text">
          <h1>PLEASANTVIEW</h1>
          <small>Seeking the Highest &bull; Est. 1998</small>
        </div>
      </a>

      <!-- NAV MENU -->
      <div class="nav-column">
        <!-- TOP NAV -->
        <div class="top-nav">
          <ul>
            <li><a href="tel:+254711689913"><i class="fa-solid fa-phone"></i> 0711 689 913</a></li>
            <li><a href="mailto:info@pleasantview.sc.ke"><i class="fa-solid fa-envelope"></i> info@pleasantview.sc.ke</a></li>
            <li><span><i class="fa-solid fa-location-dot"></i> Githunguri, Kiambu</span></li>
            <li><a href="#/visit">Campus Tour</a></li>
            <li><a href="#/admin" style="color: var(--gold-accent);"><i class="fa-solid fa-user-shield"></i> Admin Portal</a></li>
          </ul>
          <div class="search-toggle-btn" onclick="toggleSearch(true)">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>Search</span>
          </div>
          <button class="mobile-burger" onclick="toggleMobileMenu()">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>

        <!-- BOTTOM NAV -->
        <div class="bottom-nav" id="desktopMenu">
          <ul>
            <li><a href="#/">Home</a></li>
            <li>
              <a href="#/about">About Us</a>
              <ul class="sub-menu">
                <li><a href="#/about">About Pleasantview</a></li>
                <li><a href="#/about#vision">Vision, Mission & Values</a></li>
                <li><a href="#/about#legacy">24-Year Academic Legacy</a></li>
                <li><a href="#/about#christian">Christian Ethos</a></li>
                <li><a href="#/about#leadership">Board & Leadership</a></li>
              </ul>
            </li>
            <li>
              <a href="#/schools">Our Schools</a>
              <ul class="sub-menu" id="navSchoolsDropdown">
                <!-- Dynamically populated from schools state -->
              </ul>
            </li>
            <li>
              <a href="#/academics">Academic Excellence</a>
              <ul class="sub-menu">
                <li><a href="#/academics">Competency Based Curriculum (CBC)</a></li>
                <li><a href="#/academics#kcpe">KCPE 390+ Mean Legacy</a></li>
                <li><a href="#/academics#highschool">Girls' High School B+ Feat</a></li>
                <li><a href="#/academics#stem">STEM & Robotics Laboratories</a></li>
              </ul>
            </li>
            <li>
              <a href="#/school-life">School Life</a>
              <ul class="sub-menu">
                <li><a href="#/school-life#boarding">Boarding Life (Grade 4+)</a></li>
                <li><a href="#/school-life#transport">School Transport Fleet</a></li>
                <li><a href="#/school-life#sports">Sports & Athletic Champions</a></li>
                <li><a href="#/school-life#arts">Music, Drama & Talents</a></li>
              </ul>
            </li>
            <li>
              <a href="#/visit">Admissions</a>
              <ul class="sub-menu">
                <li><a href="#/visit">Book a Campus Visit</a></li>
                <li><a href="#/contact">Apply for Admission</a></li>
                <li><a href="#/visit#intake">2026/2027 Intakes</a></li>
              </ul>
            </li>
            <li><a href="#/news">News & Events</a></li>
            <li><a href="#/contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- DYNAMIC VIEW CONTAINER -->
  <main id="appRoot"></main>

  <!-- FOOTER -->
  <footer>
    <div class="wrapper">
      <div class="footer-col logo">
        <a href="#/" class="brand-logo" style="color: var(--primary-navy);">
          <div class="brand-crest">PV</div>
          <div class="brand-text">
            <h1 style="color: var(--primary-navy);">PLEASANTVIEW</h1>
            <small style="color: var(--gold-dark);">A Tradition of Excellence</small>
          </div>
        </a>
        <p style="margin-top: 18px;">
          A leading Christian-ethos group of day and boarding schools offering Competency Based Curriculum (CBC) and 8.4.4. Founded in 1998 in Githunguri, Komothai Subcounty, Kiambu County.
        </p>
        <div class="footer-socials">
          <a href="https://facebook.com" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://twitter.com" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://youtube.com" target="_blank"><i class="fa-brands fa-youtube"></i></a>
          <a href="https://instagram.com" target="_blank"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>

      <div class="footer-col contact">
        <h5 class="column-title">Contact Us</h5>
        <p>
          Pleasantview Schools Main Campus<br />
          Githunguri, Komothai Subcounty<br />
          P.O. Box, Kiambu County, Kenya<br /><br />
          <strong>Admissions Desk:</strong><br />
          +254 (0) 711 689 913<br />
          +254 (0) 700 000 000<br /><br />
          <strong>Email:</strong><br />
          info@pleasantview.sc.ke
        </p>
      </div>

      <div class="footer-col links">
        <h5 class="column-title">Quick Links</h5>
        <ul>
          <li><a href="#/">Home</a></li>
          <li><a href="#/about">About Our 24-Year History</a></li>
          <li><a href="#/schools">Our Schools & Divisions</a></li>
          <li><a href="#/academics">CBC & Academic Excellence</a></li>
          <li><a href="#/visit">Book a Campus Visit</a></li>
          <li><a href="#/contact">Admissions & Transport</a></li>
          <li><a href="#/news">Latest News & Notices</a></li>
          <li><a href="#/admin">Admin Management Portal</a></li>
        </ul>
      </div>

      <div class="footer-col top">
        <div class="top-scroll-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
          <i class="fa-solid fa-arrow-up-long"></i>
          <span>Top</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- COPYRIGHT -->
  <div class="copyright-bar">
    <div class="wrapper">
      <div class="copy">
        &copy; 2026 Pleasantview Schools. All Rights Reserved. &ldquo;Our Aim is Victory&rdquo;
      </div>
      <ul class="copyright-links">
        <li><a href="#/about#privacy">Privacy Policy</a></li>
        <li><a href="#/about#terms">Data Protection Policy</a></li>
        <li><a href="#/admin">Staff Portal</a></li>
      </ul>
    </div>
  </div>

  <!-- APPLICATION SCRIPT WITH REAL DATA AND ADMIN STATE -->
  <script>
    // CORE GLOBAL DATA (From Netlify Content + Realistic Admin Values)
    const DEFAULT_CONFIG = {
      group: {
        name: "PLEASANTVIEW SCHOOLS",
        motto: "Our Aim is Victory",
        founded: "1998 (24+ Years of Excellence)",
        learners: "1,700+",
        boarders: "600+",
        teachers: "100% TSC Certified",
        ratio: "1:20",
        kcpe_mean: "390+",
        phone: "+254 711 689 913",
        email: "info@pleasantview.sc.ke",
        location: "Githunguri, Komothai Subcounty, Kiambu County",
        welcome: "Welcome to Pleasantview Schools, an exceptional Christian-ethos family of day and boarding institutions dedicated to nurturing holistic, confident, and visionary global leaders through Kenya's Competency Based Curriculum (CBC) and 8.4.4 system.",
        vision: "Develop and fully exploit the academic potential of learners.",
        mission: "Equip learners with relevant skills and attitudes that will enable them face future challenges.",
        values: "Courage, Integrity, Compassion, Discipline and Academic Excellence."
      },
      schools: [
        {
          id: 1,
          slug: "pleasantview-senior",
          name: "Pleasantview Senior School",
          category: "SENIOR SCHOOL",
          level: "Grades 10 – 12 (Form 1 – 4)",
          tagline: "Pathways to a purposeful future",
          color: "#05286b",
          image: "images/girls_high_school3.webp",
          learners: "450 Students",
          boarders: "450 Boarders",
          ratio: "1:15",
          founded: "2016",
          about: "Solidifying values and attitudes formed at primary school alongside advanced knowledge and skills acquisition. Our Senior School offers STEM, Social Sciences, and Arts & Sports Science pathways with a sterling record of achieving top university entry grades (mean grade B+ in KCSE).",
          mission: "To prepare future-ready leaders equipped with academic distinction, technical problem-solving acumen, and sound ethical character.",
          vision: "A premier national benchmark in holistic senior secondary excellence."
        },
        {
          id: 2,
          slug: "pleasantview-jss",
          name: "Pleasantview Junior Secondary",
          category: "JUNIOR SECONDARY (JSS)",
          level: "Grades 7 – 9",
          tagline: "Discovering talents and academic pathways",
          color: "#335390",
          image: "images/banner_1_a.webp",
          learners: "500 Students",
          boarders: "200 Boarders",
          ratio: "1:20",
          founded: "2023",
          about: "Pioneering Kenya's Competency Based Curriculum (CBC) with state-of-the-art Pre-Technical, Integrated Science, Computer Science, and Agriculture laboratories, preparing learners seamlessly for senior pathways and national KJSEA assessments.",
          mission: "To ignite inquiry, technological literacy, and moral courage during the formative adolescent years.",
          vision: "A hub of innovative discovery and talent cultivation."
        },
        {
          id: 3,
          slug: "pleasantview-primary",
          name: "Pleasantview Primary School",
          category: "PRIMARY SCHOOL",
          level: "Grades 1 – 6 (CBC)",
          tagline: "Building solid foundations in knowledge and character",
          color: "#0b5d3b",
          image: "images/primary_school_1.webp",
          learners: "1,000 Pupils",
          boarders: "250 Boarders (From Gr. 4)",
          ratio: "1:22",
          founded: "1998",
          about: "First stage of formal education that offers sound mastery in reading, writing, mathematics, science, and the arts. Our KCPE classes have historically maintained an extraordinary mean score exceeding 390/500, ranking consistently among the top 10 schools in Kiambu County.",
          mission: "To instill foundational literacy, critical thinking, Christian values, and lifelong love for learning.",
          vision: "To nurture confident, well-rounded achievers."
        },
        {
          id: 4,
          slug: "pleasantview-early-learning",
          name: "Pleasantview Early Learning Centre",
          category: "EARLY LEARNING",
          level: "Playgroup, PP1 & PP2 (Crèche)",
          tagline: "Where learning begins with joy and wonder",
          color: "#7c98b3",
          image: "images/early_learning_1.webp",
          learners: "250 Pupils",
          boarders: "Day Scholars",
          ratio: "1:12",
          founded: "1998",
          about: "An Early Childhood Development programme that lays solid foundations for social and intellectual literacy through purposeful play, creative arts, linguistic discovery, and affectionate Christian care.",
          mission: "To provide a safe, joyful environment where curiosity blossoms.",
          vision: "Inspiring young minds toward bright horizons."
        }
      ],
      news: [
        {
          id: 1,
          slug: "2026-national-exams-results",
          category: "Academic Distinction",
          title: "2026 National Examinations: Exceptional Performance Across All Campuses",
          date: "October 28, 2026",
          image: "images/banner_2_a.webp",
          excerpt: "Pleasantview Schools congratulates our senior and primary scholars for continuing our 24-year tradition of scholastic excellence, recording top ranks nationally.",
          body: "We celebrate our candidates for their stellar achievements in both the CBC assessments and national examinations. With mean performance once again demonstrating our mastery of learner-centred education, over 90% of our high school graduates have secured direct admission into top university degree programs."
        },
        {
          id: 2,
          slug: "admissions-2026-2027",
          category: "Admissions Notice",
          title: "Admissions Open: Playgroup, Grade 1, Junior Secondary (JSS) & Senior School",
          date: "October 15, 2026",
          image: "images/banner_4_a.webp",
          excerpt: "Interviews and campus assessments are now underway for new applicants across Day and Boarding programs. Limited vacancies available.",
          body: "Parents seeking a premier academic, moral, and co-curricular foundation for their children are invited to book a visit. Our admissions office is conducting guided campus tours every Tuesday and Thursday."
        },
        {
          id: 3,
          slug: "robotics-science-lab-launch",
          category: "Innovation & STEM",
          title: "New High-Tech Science & Digital Robotics Hub Unveiled for JSS and Senior School",
          date: "September 22, 2026",
          image: "images/gallery_10.webp",
          excerpt: "Fostering practical technical competencies with ultra-modern computer suites, 3D printing, and physics/chemistry research stations.",
          body: "In keeping with our Competency Based Curriculum commitment, Pleasantview Schools has commissioned a state-of-the-art STEM innovation complex to equip learners with real-world technological and problem-solving capabilities."
        }
      ],
      testimonials: [
        {
          name: "Caroline Mburu",
          role: "Lawyer & Pleasantview Parent",
          quote: "This school is good and I am very happy with it. They have all the modern facilities that pupils need and demonstrate deep pastoral responsibility for every child's growth."
        },
        {
          name: "Wilson Solonka",
          role: "Civil Engineer & Parent",
          quote: "The final processed product from Pleasantview Schools is Pretty Pleasant. My niece and nephew are already there and their academic confidence and discipline are outstanding."
        },
        {
          name: "Samuel Karonjo",
          role: "Businessman & Parent",
          quote: "My son went through Pleasantview from early primary all the way through, and I am immensely proud of the institution. I highly recommend it to any parent seeking true excellence."
        }
      ],
      visits: [],
      enquiries: []
    };

    // LOAD STORED STATE OR DEFAULT
    function getStoredData() {
      try {
        const d = localStorage.getItem('pleasantview_data');
        return d ? JSON.parse(d) : DEFAULT_CONFIG;
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    function saveStoredData(data) {
      try {
        localStorage.setItem('pleasantview_data', JSON.stringify(data));
      } catch (e) {}
    }

    let DATA = getStoredData();

    // POPULATE NAVBAR DROPDOWN
    function updateNavSchools() {
      const drop = document.getElementById('navSchoolsDropdown');
      if (drop) {
        drop.innerHTML = DATA.schools.map(s => `
          <li><a href="#/s/${s.slug}">${s.name} (${s.category})</a></li>
        `).join('');
      }
    }

    // SEARCH MODAL CONTROLS
    function toggleSearch(show) {
      const m = document.getElementById('searchModal');
      m.className = show ? 'search-modal-backdrop open' : 'search-modal-backdrop';
      if (show) {
        setTimeout(() => document.getElementById('searchInput').focus(), 100);
        handleSearch('');
      }
    }
    function handleSearch(q) {
      const query = q.toLowerCase().trim();
      const res = document.getElementById('searchResults');
      let items = [
        { title: 'Home - Pleasantview Schools', link: '#/' },
        { title: 'About Us & 24-Year Academic History', link: '#/about' },
        { title: 'Vision, Mission & Core Values', link: '#/about#vision' },
        { title: 'Competency Based Curriculum (CBC) & 8.4.4', link: '#/academics' },
        { title: 'Book a Campus Visit & Tour', link: '#/visit' },
        { title: 'Contact Admissions & School Transport', link: '#/contact' },
        { title: 'Staff & Admin Management Portal', link: '#/admin' }
      ];
      DATA.schools.forEach(s => {
        items.push({ title: `${s.name} (${s.category})`, link: `#/s/${s.slug}` });
      });
      DATA.news.forEach(n => {
        items.push({ title: `News: ${n.title}`, link: `#/news/${n.slug}` });
      });

      const filtered = query ? items.filter(i => i.title.toLowerCase().includes(query)) : items;
      res.innerHTML = filtered.map(i => `
        <li><a href="${i.link}" onclick="toggleSearch(false)"><i class="fa-solid fa-chevron-right" style="margin-right: 8px; font-size: 11px;"></i> ${i.title}</a></li>
      `).join('');
    }

    // SCROLL LISTENER FOR STICKY NAV
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('mainNav');
      if (window.scrollY > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });

    // MOBILE BURGER MENU
    function toggleMobileMenu() {
      const menu = document.getElementById('desktopMenu');
      if (menu.style.display === 'block') menu.style.display = 'none';
      else {
        menu.style.display = 'block';
        menu.style.position = 'absolute';
        menu.style.top = '100%';
        menu.style.left = '0';
        menu.style.right = '0';
        menu.style.background = 'var(--dark-navy)';
        menu.style.padding = '20px 5%';
      }
    }

    // HERO SLIDER TIMING
    let currentHeroSlide = 0;
    function initHeroSlider() {
      const slides = document.querySelectorAll('.hero-slide');
      if (!slides.length) return;
      setInterval(() => {
        slides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % slides.length;
        slides[currentHeroSlide].classList.add('active');
      }, 5500);
    }

    // VMV SLIDESHOW SWITCHER
    let currentVmvSlide = 0;
    function switchVmvSlide(idx) {
      currentVmvSlide = idx;
      document.querySelectorAll('.vmv-slide').forEach((s, i) => {
        s.classList.toggle('active', i === idx);
      });
      document.querySelectorAll('.vmv-tab-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });
    }

    // VIEW ROUTING
    function renderApp() {
      updateNavSchools();
      const hash = location.hash.replace(/^#\/?/, '') || '';
      const parts = hash.split('/').filter(Boolean);
      const root = document.getElementById('appRoot');

      if (!parts.length) {
        // HOME PAGE (EXACT ST ANDREW'S TURI RESEMBLANCE)
        root.innerHTML = renderHomePage();
        initHeroSlider();
      } else if (parts[0] === 'about') {
        root.innerHTML = renderAboutPage();
      } else if (parts[0] === 'schools') {
        root.innerHTML = renderSchoolsListPage();
      } else if (parts[0] === 's' && parts[1]) {
        const school = DATA.schools.find(s => s.slug === parts[1]);
        if (!school) root.innerHTML = renderNotFound();
        else root.innerHTML = renderSchoolPage(school, parts[2] || '');
      } else if (parts[0] === 'academics') {
        root.innerHTML = renderAcademicsPage();
      } else if (parts[0] === 'school-life') {
        root.innerHTML = renderSchoolLifePage();
      } else if (parts[0] === 'news' && parts[1]) {
        const item = DATA.news.find(n => n.slug === parts[1]);
        root.innerHTML = item ? renderNewsDetailPage(item) : renderNotFound();
      } else if (parts[0] === 'news') {
        root.innerHTML = renderNewsListPage();
      } else if (parts[0] === 'visit') {
        root.innerHTML = renderVisitPage();
      } else if (parts[0] === 'contact') {
        root.innerHTML = renderContactPage();
      } else if (parts[0] === 'admin') {
        root.innerHTML = renderAdminPortal();
      } else {
        root.innerHTML = renderNotFound();
      }

      window.scrollTo(0, 0);
    }

    // HOME PAGE TEMPLATE
    function renderHomePage() {
      const g = DATA.group;
      return `
        <!-- HERO (Matching St Andrew's Turi) -->
        <header class="hero">
          <div class="hero-bg-slider">
            <div class="hero-slide active" style="background-image: url('images/banner_1_a.webp');"></div>
            <div class="hero-slide" style="background-image: url('images/banner_2_a.webp');"></div>
            <div class="hero-slide" style="background-image: url('images/banner_3_a.webp');"></div>
          </div>
          <div class="hero-overlay"></div>

          <!-- ROTATED HERO SIDE BUTTONS (EXACT TURI STYLING) -->
          <div class="hero-buttons">
            <a class="hero-button light-blue" href="#/contact">
              <i class="fa-brands fa-wpforms"></i> Contact
            </a>
            <a class="hero-button dark-blue" href="#/visit">
              <i class="fa-solid fa-location-dot"></i> Visit
            </a>
          </div>

          <div class="wrapper">
            <div class="hero-content">
              <h5>${g.motto} &bull; SINCE 1998</h5>
              <h1>WELCOME TO<br />PLEASANTVIEW SCHOOLS</h1>
              <p>${g.welcome}</p>
              <div class="hero-actions">
                <a href="#/schools" class="button button-primary">Explore Our Schools</a>
                <a href="#/visit" class="button button-gold">Book a Campus Tour</a>
              </div>
            </div>
          </div>
        </header>

        <!-- TEXT INTRODUCTION (PLEASANTVIEW – SEEKING THE HIGHEST) -->
        <section class="text-component">
          <div class="wrapper">
            <span class="lead-badge">24 YEARS OF ACADEMIC DISTINCTION</span>
            <h2>PLEASANTVIEW SCHOOLS &ndash; SEEKING THE HIGHEST</h2>
            <div class="gold-divider"></div>
            <p class="lead">
              Pleasant View Schools is a premier Christian-ethos private academic institution based in Githunguri, Komothai Subcounty, Kiambu County. We provide a quality lifelong education process whose aim is to build successful, disciplined, and visionary individuals inside and outside the classroom.
            </p>
            <p class="body-text">
              Since inception in 1998, our KCPE classes have consistently maintained a distinguished mean score exceeding 390/500, ranking proudly among the top 10 schools in Kiambu County. Following this extraordinary record, our Girls' High School and modern Junior Secondary School (JSS) continue to set benchmarks in academic competence, technical innovation, and moral integrity.
            </p>
          </div>
        </section>

        <!-- SIGNPOSTING (CHOOSE YOUR SCHOOL - TURI CARDS) -->
        <section class="signposting" id="schoolsSection">
          <div class="wrapper">
            <div class="section-header">
              <h5>OUR ACADEMIC DIVISIONS</h5>
              <h3>Choose Your School</h3>
              <div class="gold-divider"></div>
            </div>

            <div class="signposts-grid">
              ${DATA.schools.map(s => `
                <a class="signpost-card" href="#/s/${s.slug}" style="background-image: url('${s.image}');">
                  <div class="signpost-overlay"></div>
                  <span class="signpost-category">${s.category}</span>
                  <div class="signpost-title">${s.name}</div>
                  <div class="signpost-level">${s.level}</div>
                  <div class="signpost-stats-pill"><i class="fa-solid fa-users"></i> ${s.learners}</div>
                  <div class="signpost-link-text">Explore Campus <i class="fa-solid fa-arrow-right-long"></i></div>
                </a>
              `).join('')}
            </div>

            <div class="signposting-bottom-link">
              <a href="#/about" class="button button-tertiary">Why Pleasantview Schools</a>
            </div>
          </div>
        </section>

        <!-- SLIDESHOW (VISION, MISSION, VALUES) -->
        <section class="slideshow-section">
          <div class="vmv-slide active" style="background-image: url('images/banner_4_a.webp');">
            <div class="vmv-overlay"></div>
            <div class="vmv-content">
              <h5>OUR GUIDING PRINCIPLE</h5>
              <h2>Our Vision</h2>
              <h4>${g.vision}</h4>
            </div>
          </div>

          <div class="vmv-slide" style="background-image: url('images/gallery_10.webp');">
            <div class="vmv-overlay"></div>
            <div class="vmv-content">
              <h5>TRANSFORMING TOMORROW</h5>
              <h2>Our Mission</h2>
              <h4>${g.mission}</h4>
            </div>
          </div>

          <div class="vmv-slide" style="background-image: url('images/gallery_8.webp');">
            <div class="vmv-overlay"></div>
            <div class="vmv-content">
              <h5>CHARACTER & EXCELLENCE</h5>
              <h2>Our Core Values</h2>
              <h4>${g.values} &mdash; <em>&ldquo;${g.motto}&rdquo;</em></h4>
            </div>
          </div>

          <div class="vmv-tabs">
            <button class="vmv-tab-btn active" onclick="switchVmvSlide(0)">Vision</button>
            <button class="vmv-tab-btn" onclick="switchVmvSlide(1)">Mission</button>
            <button class="vmv-tab-btn" onclick="switchVmvSlide(2)">Core Values</button>
          </div>
        </section>

        <!-- REALISTIC POPULATION & INSTITUTIONAL STATISTICS (PULLED FROM CONFIG) -->
        <section class="stats-bar-section">
          <div class="wrapper">
            <div class="stats-grid">
              <div class="stat-item">
                <b>${g.learners}</b>
                <span>Registered Learners</span>
              </div>
              <div class="stat-item">
                <b>${g.boarders}</b>
                <span>Boarding Scholars (Gr. 4+)</span>
              </div>
              <div class="stat-item">
                <b>${g.teachers}</b>
                <span>TSC Certified Faculty</span>
              </div>
              <div class="stat-item">
                <b>${g.ratio}</b>
                <span>Learner : Teacher Ratio</span>
              </div>
              <div class="stat-item">
                <b>${g.kcpe_mean}</b>
                <span>Historic KCPE Mean Score</span>
              </div>
              <div class="stat-item">
                <b>24+</b>
                <span>Years of Excellence</span>
              </div>
            </div>
          </div>
        </section>

        <!-- NEWS POSTS (TURI SPLIT SLIDER LAYOUT) -->
        <section class="news-posts-section">
          <div class="wrapper">
            <div class="news-split-container">
              <div class="news-static-box">
                <h5>WHAT'S HAPPENING</h5>
                <h3>Latest News</h3>
                <div class="line"></div>
                <p>Stay informed with updates on examinations, co-curricular highlights, academic symposiums, and admissions across all Pleasantview campuses.</p>
                <a class="button button-secondary" href="#/news">All News & Updates</a>
              </div>

              <div class="news-grid">
                ${DATA.news.slice(0, 3).map(n => `
                  <div class="single-news-item">
                    <a class="single-news-image" href="#/news/${n.slug}">
                      <img src="${n.image}" alt="${n.title}" />
                      <div class="news-arrow-badge"><i class="fa-solid fa-arrow-right-long"></i></div>
                    </a>
                    <div class="single-news-content">
                      <h6>${n.category}</h6>
                      <h4><a href="#/news/${n.slug}">${n.title}</a></h4>
                      <p class="excerpt">${n.excerpt}</p>
                      <span class="news-date"><i class="fa-regular fa-calendar"></i> ${n.date}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- TESTIMONIALS (FROM NETLIFY CONTENT) -->
        <section class="testimonials-section">
          <div class="wrapper">
            <div class="testimonials-header">
              <h5>TESTIMONIALS & TRUST</h5>
              <h3>What Parents Say About Pleasantview</h3>
              <div class="gold-divider"></div>
            </div>

            <div class="testimonials-grid">
              ${DATA.testimonials.map(t => `
                <div class="testimonial-card">
                  <div>
                    <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
                    <p class="testimonial-text">&ldquo;${t.quote}&rdquo;</p>
                  </div>
                  <div class="testimonial-author">
                    <div class="author-avatar">${t.name.charAt(0)}</div>
                    <div class="author-info">
                      <h4>${t.name}</h4>
                      <span>${t.role}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- CAMPUS LIFE: TRANSPORT & BOARDING -->
        <section class="facilities-spotlight">
          <div class="wrapper">
            <div class="spotlight-grid">
              <div class="spotlight-box" style="background-image: url('images/gallery_7.webp');">
                <div class="overlay"></div>
                <div class="spotlight-box-content">
                  <h5>SAFE & RELIABLE COMMUTE</h5>
                  <h3>Taking School Transport?</h3>
                  <p>Our comprehensive fleet of modern, monitored school buses serves Githunguri, Ruiru, Kiambu, and nearby areas, ensuring timely, safe transit under caring staff supervision.</p>
                  <a href="#/contact" class="button button-gold">Enquire Transport Routes</a>
                </div>
              </div>

              <div class="spotlight-box" style="background-image: url('images/gallery_2.webp');">
                <div class="overlay"></div>
                <div class="spotlight-box-content">
                  <h5>PASTORAL CARE & COMMUNITY</h5>
                  <h3>Boarding Life from Grade 4</h3>
                  <p>A warm, secure home-away-from-home fostering independent study, Christian discipleship, healthy nutrition, and lifelong peer friendships in modern dormitories.</p>
                  <a href="#/visit" class="button button-primary">Tour Our Boarding</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // ABOUT PAGE
    function renderAboutPage() {
      const g = DATA.group;
      return `
        <div class="subpage-hero" style="background-image: url('images/banner_3_a.webp');">
          <div class="overlay"></div>
          <div class="subpage-hero-content">
            <h5>OUR HERITAGE & VISION</h5>
            <h1>About Pleasantview Schools</h1>
            <p>24 Years of Holistic Character, Academic Eminence, and Christian Ethos</p>
          </div>
        </div>

        <section class="subpage-body">
          <div class="wrapper">
            <div style="max-width: 960px; margin: 0 auto;">
              <span class="lead-badge">OUR FOUNDATION</span>
              <h2>A Legacy of Educational Eminence</h2>
              <div class="gold-divider" style="margin-left: 0;"></div>
              
              <p style="font-size: 18px; line-height: 1.8; margin-bottom: 25px; color: #333;">
                Founded in 1998, Pleasant View Schools has grown from a visionary primary institution into one of the most respected private Christian-ethos school networks in Kenya. Situated amidst the scenic, peaceful highlands of Githunguri, Komothai Subcounty, Kiambu County, our campuses provide a serene sanctuary where learners thrive intellectually, spiritually, and socially.
              </p>

              <h3 id="vision" style="margin-top: 40px; margin-bottom: 15px;">Vision, Mission & Core Values</h3>
              <div style="background: var(--soft-bg); padding: 30px; border-radius: 4px; border-left: 4px solid var(--primary-navy); margin-bottom: 30px;">
                <p style="margin-bottom: 12px;"><strong>Our Vision:</strong> ${g.vision}</p>
                <p style="margin-bottom: 12px;"><strong>Our Mission:</strong> ${g.mission}</p>
                <p style="margin-bottom: 12px;"><strong>Core Values:</strong> ${g.values}</p>
                <p><strong>Institutional Motto:</strong> &ldquo;${g.motto}&rdquo;</p>
              </div>

              <h3 id="legacy" style="margin-top: 40px; margin-bottom: 15px;">24 Years of Continuous Distinction</h3>
              <p style="line-height: 1.8; margin-bottom: 20px; color: #444;">
                Since our inaugural KCPE graduating class, Pleasantview has consistently maintained mean scores exceeding 390 out of 500 points, positioning us permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic mean grade of B+ in their maiden KCSE examinations.
              </p>

              <div style="text-align: center; margin-top: 50px;">
                <a href="#/visit" class="button button-secondary">Book a Guided Campus Tour</a>
                <a href="#/contact" class="button button-gold" style="margin-left: 15px;">Contact Admissions</a>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // SCHOOLS OVERVIEW PAGE
    function renderSchoolsListPage() {
      return `
        <div class="subpage-hero" style="background-image: url('images/banner_1_a.webp');">
          <div class="overlay"></div>
          <div class="subpage-hero-content">
            <h5>ACADEMIC EXCELLENCE ACROSS ALL AGES</h5>
            <h1>Our Group of Schools</h1>
            <p>From Early Childhood through Senior Secondary Graduation</p>
          </div>
        </div>

        <section class="subpage-body">
          <div class="wrapper">
            <div class="signposts-grid">
              ${DATA.schools.map(s => `
                <a class="signpost-card" href="#/s/${s.slug}" style="background-image: url('${s.image}'); min-height: 380px;">
                  <div class="signpost-overlay"></div>
                  <span class="signpost-category">${s.category}</span>
                  <div class="signpost-title">${s.name}</div>
                  <div class="signpost-level">${s.level}</div>
                  <div class="signpost-stats-pill"><i class="fa-solid fa-users"></i> ${s.learners} &bull; ${s.boarders}</div>
                  <p style="font-size: 13.5px; color: rgba(255,255,255,0.85); margin-bottom: 15px; line-height: 1.5;">${s.about.slice(0, 140)}...</p>
                  <div class="signpost-link-text">Visit School Portal <i class="fa-solid fa-arrow-right-long"></i></div>
                </a>
              `).join('')}
            </div>
          </div>
        </section>
      `;
    }

    // INDIVIDUAL SCHOOL PAGE (/s/:slug)
    function renderSchoolPage(s, sub) {
      return `
        <div class="subpage-hero" style="background-image: url('${s.image}');">
          <div class="overlay" style="background: rgba(5,40,107,0.88);"></div>
          <div class="subpage-hero-content">
            <h5>${s.category} &bull; PLEASANTVIEW SCHOOLS</h5>
            <h1>${s.name}</h1>
            <p>${s.tagline}</p>
          </div>
        </div>

        <!-- SCHOOL SUBBAR -->
        <div class="school-subbar" style="background-color: ${s.color};">
          <div class="wrapper">
            <h4>${s.name}</h4>
            <ul class="school-subbar-links">
              <li><a href="#/s/${s.slug}">Overview</a></li>
              <li><a href="#/academics">Academics (CBE)</a></li>
              <li><a href="#/news">Campus News</a></li>
              <li><a href="#/visit">Book a Visit</a></li>
              <li><a href="#/contact">Admissions</a></li>
            </ul>
          </div>
        </div>

        <!-- STATS BAR -->
        <section class="stats-bar-section" style="background: var(--dark-navy);">
          <div class="wrapper">
            <div class="stats-grid">
              <div class="stat-item">
                <b>${s.learners}</b>
                <span>Enrolled Population</span>
              </div>
              <div class="stat-item">
                <b>${s.boarders}</b>
                <span>Boarding Capacity</span>
              </div>
              <div class="stat-item">
                <b>${s.ratio}</b>
                <span>Learner : Teacher Ratio</span>
              </div>
              <div class="stat-item">
                <b>${s.founded}</b>
                <span>Established Year</span>
              </div>
            </div>
          </div>
        </section>

        <section class="subpage-body">
          <div class="wrapper">
            <div style="max-width: 960px; margin: 0 auto;">
              <span class="lead-badge">WELCOME TO ${s.category}</span>
              <h2>Nurturing Excellence in ${s.name}</h2>
              <div class="gold-divider" style="margin-left: 0;"></div>
              
              <p style="font-size: 18px; line-height: 1.8; margin-bottom: 25px; color: #333;">
                ${s.about}
              </p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 35px 0;">
                <div style="background: var(--soft-bg); padding: 25px; border-radius: 4px; border-left: 4px solid ${s.color};">
                  <h4 style="margin-bottom: 10px;">Division Vision</h4>
                  <p style="font-size: 14.5px; color: #555;">${s.vision}</p>
                </div>
                <div style="background: var(--soft-bg); padding: 25px; border-radius: 4px; border-left: 4px solid var(--gold-accent);">
                  <h4 style="margin-bottom: 10px;">Division Mission</h4>
                  <p style="font-size: 14.5px; color: #555;">${s.mission}</p>
                </div>
              </div>

              <div style="text-align: center; margin-top: 50px;">
                <a href="#/visit" class="button button-secondary">Schedule a Visit to ${s.name}</a>
                <a href="#/contact" class="button button-gold" style="margin-left: 15px;">Apply for Admission</a>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // ACADEMICS PAGE
    function renderAcademicsPage() {
      return `
        <div class="subpage-hero" style="background-image: url('images/banner_2_a.webp');">
          <div class="overlay"></div>
          <div class="subpage-hero-content">
            <h5>CURRICULUM & METHODOLOGY</h5>
            <h1>Academic Excellence</h1>
            <p>Competency Based Curriculum (CBC) & 8.4.4 Integrated Standards</p>
          </div>
        </div>

        <section class="subpage-body">
          <div class="wrapper">
            <div style="max-width: 960px; margin: 0 auto;">
              <span class="lead-badge">CURRICULUM FRAMEWORK</span>
              <h2>Empowering Competent, Confident Innovators</h2>
              <div class="gold-divider" style="margin-left: 0;"></div>

              <p style="font-size: 18px; line-height: 1.8; margin-bottom: 25px;">
                At Pleasantview Schools, we believe education must not only assess what learners know, but cultivate what they can creatively apply. Under the Competency Based Curriculum (CBC), learners develop essential real-world competencies:
              </p>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin: 30px 0;">
                <div style="background: var(--soft-bg); padding: 20px; border-radius: 4px;">
                  <h4><i class="fa-solid fa-lightbulb" style="color: var(--gold-accent); margin-right: 8px;"></i> Critical Thinking</h4>
                  <p style="font-size: 14px; color: #555; margin-top: 6px;">Developing analytical reasoning, hypothesis testing, and investigative discernment.</p>
                </div>
                <div style="background: var(--soft-bg); padding: 20px; border-radius: 4px;">
                  <h4><i class="fa-solid fa-microchip" style="color: var(--medium-blue); margin-right: 8px;"></i> Digital Literacy</h4>
                  <p style="font-size: 14px; color: #555; margin-top: 6px;">Coding, robotics, computer applications, and multimedia expression.</p>
                </div>
                <div style="background: var(--soft-bg); padding: 20px; border-radius: 4px;">
                  <h4><i class="fa-solid fa-users" style="color: var(--primary-navy); margin-right: 8px;"></i> Collaboration</h4>
                  <p style="font-size: 14px; color: #555; margin-top: 6px;">Fostering interpersonal teamwork, empathetic communication, and mutual accountability.</p>
                </div>
                <div style="background: var(--soft-bg); padding: 20px; border-radius: 4px;">
                  <h4><i class="fa-solid fa-shield-heart" style="color: var(--gold-dark); margin-right: 8px;"></i> Moral Integrity</h4>
                  <p style="font-size: 14px; color: #555; margin-top: 6px;">Christian discipleship, servant leadership, and social responsibility.</p>
                </div>
              </div>

              <div style="text-align: center; margin-top: 40px;">
                <a href="#/visit" class="button button-secondary">Enquire for 2026/2027 Admissions</a>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // SCHOOL LIFE PAGE
    function renderSchoolLifePage() {
      return `
        <div class="subpage-hero" style="background-image: url('images/gallery_10.webp');">
          <div class="overlay"></div>
          <div class="subpage-hero-content">
            <h5>HOLISTIC GROWTH BEYOND CLASSROOMS</h5>
            <h1>Campus Life at Pleasantview</h1>
            <p>Boarding, Sports, Transport, and Performing Arts</p>
          </div>
        </div>

        <section class="subpage-body">
          <div class="wrapper">
            <div style="max-width: 960px; margin: 0 auto;">
              <span class="lead-badge">LIFE AT PLEASANTVIEW</span>
              <h2>Flourishing in Mind, Body, and Spirit</h2>
              <div class="gold-divider" style="margin-left: 0;"></div>

              <div style="margin-bottom: 40px;">
                <h3 id="boarding" style="margin-bottom: 12px;">Boarding Community (Grade 4 & Upwards)</h3>
                <p style="line-height: 1.8; color: #444;">
                  Our boarding village offers a serene, nurturing environment supervised 24/7 by dedicated resident houseparents and nurses. Structured prep times, balanced wholesome meals, weekend chapel, and organized sports make our boarders feel completely supported and cherished.
                </p>
              </div>

              <div style="margin-bottom: 40px;">
                <h3 id="transport" style="margin-bottom: 12px;">Modern School Transport Fleet</h3>
                <p style="line-height: 1.8; color: #444;">
                  We maintain a dedicated fleet of GPS-tracked, speed-governed school buses with trained bus wardens. Serving Kiambu, Githunguri, Ruiru, and neighboring estates, parents enjoy total peace of mind for their children's daily transit.
                </p>
              </div>

              <div style="text-align: center; margin-top: 40px;">
                <a href="#/visit" class="button button-secondary">Book a Tour of Our Facilities</a>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // NEWS LIST
    function renderNewsListPage() {
      return `
        <div class="subpage-hero" style="background-image: url('images/banner_3_a.webp');">
          <div class="overlay"></div>
          <div class="subpage-hero-content">
            <h5>STAY INFORMED</h5>
            <h1>News & Campus Happenings</h1>
            <p>Stories, achievements, and announcements from all our schools</p>
          </div>
        </div>

        <section class="subpage-body">
          <div class="wrapper">
            <div class="news-grid">
              ${DATA.news.map(n => `
                <div class="single-news-item">
                  <a class="single-news-image" href="#/news/${n.slug}">
                    <img src="${n.image}" alt="${n.title}" />
                    <div class="news-arrow-badge"><i class="fa-solid fa-arrow-right-long"></i></div>
                  </a>
                  <div class="single-news-content">
                    <h6>${n.category}</h6>
                    <h4><a href="#/news/${n.slug}">${n.title}</a></h4>
                    <p class="excerpt">${n.excerpt}</p>
                    <span class="news-date"><i class="fa-regular fa-calendar"></i> ${n.date}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
    }

    // NEWS DETAIL
    function renderNewsDetailPage(item) {
      return `
        <div class="subpage-hero" style="background-image: url('${item.image}');">
          <div class="overlay"></div>
          <div class="subpage-hero-content">
            <h5>${item.category}</h5>
            <h1>${item.title}</h1>
            <p><i class="fa-regular fa-calendar"></i> Published: ${item.date}</p>
          </div>
        </div>

        <section class="subpage-body">
          <div class="wrapper">
            <div style="max-width: 850px; margin: 0 auto;">
              <p style="font-size: 20px; font-weight: 500; line-height: 1.6; margin-bottom: 25px; color: var(--primary-navy);">
                ${item.excerpt}
              </p>
              <div style="line-height: 1.8; color: #333; font-size: 16px;">
                <p>${item.body}</p>
              </div>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <a href="#/news" class="button button-tertiary">&larr; Back to All News</a>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // VISIT BOOKING PAGE
    function renderVisitPage() {
      return `
        <div class="subpage-hero" style="background-image: url('images/banner_4_a.webp');">
          <div class="overlay"></div>
          <div class="subpage-hero-content">
            <h5>DISCOVER PLEASANTVIEW IN PERSON</h5>
            <h1>Book a Campus Visit</h1>
            <p>Experience our vibrant classrooms, labs, boarding facilities, and grounds</p>
          </div>
        </div>

        <section class="subpage-body">
          <div class="wrapper">
            <div style="max-width: 700px; margin: 0 auto;">
              <div class="custom-form" id="visitFormContainer">
                <h3>Schedule Your Visit</h3>
                <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                  Please provide your contact information and select your preferred school campus. Our Admissions Coordinator will confirm your booking via phone and email.
                </p>

                <form onsubmit="handleVisitSubmit(event)">
                  <div class="form-group">
                    <label>Parent / Guardian Name *</label>
                    <input type="text" id="v_name" required placeholder="Full Name" />
                  </div>
                  <div class="form-group">
                    <label>Phone Number (+254...) *</label>
                    <input type="tel" id="v_phone" required placeholder="0711 000 000" />
                  </div>
                  <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="v_email" placeholder="name@example.com" />
                  </div>
                  <div class="form-group">
                    <label>Campus / School Division *</label>
                    <select id="v_school" required>
                      ${DATA.schools.map(s => `<option value="${s.name}">${s.name} (${s.category})</option>`).join('')}
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Preferred Visit Date *</label>
                    <input type="date" id="v_date" required />
                  </div>
                  <div class="form-group">
                    <label>Number of Guests (Family Members)</label>
                    <input type="number" id="v_guests" value="2" min="1" max="8" />
                  </div>
                  <button type="submit" class="button button-secondary" style="margin-top: 10px;">Confirm Visit Booking</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    function handleVisitSubmit(e) {
      e.preventDefault();
      const booking = {
        name: document.getElementById('v_name').value,
        phone: document.getElementById('v_phone').value,
        email: document.getElementById('v_email').value,
        school: document.getElementById('v_school').value,
        date: document.getElementById('v_date').value,
        guests: document.getElementById('v_guests').value,
        submitted: new Date().toLocaleDateString()
      };
      DATA.visits.push(booking);
      saveStoredData(DATA);
      document.getElementById('visitFormContainer').innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <i class="fa-solid fa-circle-check" style="font-size: 56px; color: var(--gold-accent); margin-bottom: 20px;"></i>
          <h3>Thank You, ${booking.name}!</h3>
          <p style="font-size: 16px; margin: 15px 0;">Your campus visit for <strong>${booking.school}</strong> on <strong>${booking.date}</strong> has been received.</p>
          <p style="font-size: 14px; color: #666;">Our Admissions Office will call you on ${booking.phone} to finalize the arrangements.</p>
          <a href="#/" class="button button-primary" style="margin-top: 20px;">Return to Home</a>
        </div>
      `;
    }

    // CONTACT PAGE
    function renderContactPage() {
      const g = DATA.group;
      return `
        <div class="subpage-hero" style="background-image: url('images/banner_1_a.webp');">
          <div class="overlay"></div>
          <div class="subpage-hero-content">
            <h5>GET IN TOUCH</h5>
            <h1>Contact Pleasantview Schools</h1>
            <p>Our admissions and administration teams are here to assist you</p>
          </div>
        </div>

        <section class="subpage-body">
          <div class="wrapper">
            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 50px;">
              <div>
                <span class="lead-badge">LOCATIONS & INQUIRIES</span>
                <h2>We Would Love to Hear from You</h2>
                <div class="gold-divider" style="margin-left: 0;"></div>

                <div style="margin-bottom: 25px;">
                  <h4><i class="fa-solid fa-location-dot" style="color: var(--gold-accent); margin-right: 10px;"></i> Campus Address</h4>
                  <p style="color: #555; margin-top: 5px;">${g.location}</p>
                </div>

                <div style="margin-bottom: 25px;">
                  <h4><i class="fa-solid fa-phone" style="color: var(--medium-blue); margin-right: 10px;"></i> Direct Telephone</h4>
                  <p style="color: #555; margin-top: 5px;">Main Desk: ${g.phone}<br />Admissions: +254 (0) 700 000 000</p>
                </div>

                <div style="margin-bottom: 25px;">
                  <h4><i class="fa-solid fa-envelope" style="color: var(--primary-navy); margin-right: 10px;"></i> Email Address</h4>
                  <p style="color: #555; margin-top: 5px;">${g.email}</p>
                </div>

                <div style="background: var(--soft-bg); padding: 20px; border-radius: 4px; margin-top: 30px;">
                  <h4>School Transport & Boarding Enquiries</h4>
                  <p style="font-size: 13.5px; color: #555; margin-top: 6px;">
                    For transport route details, pick-up points, or boarding requirements, indicate your child's expected grade level in the message form.
                  </p>
                </div>
              </div>

              <div class="custom-form" id="contactFormContainer">
                <h3>Send Us an Enquiry</h3>
                <form onsubmit="handleContactSubmit(event)">
                  <div class="form-group">
                    <label>Your Name *</label>
                    <input type="text" id="c_name" required placeholder="Full Name" />
                  </div>
                  <div class="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" id="c_phone" required placeholder="0711 000 000" />
                  </div>
                  <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="c_email" placeholder="email@example.com" />
                  </div>
                  <div class="form-group">
                    <label>Interested School / Division</label>
                    <select id="c_school">
                      <option value="General Enquiry">All Schools (Group Inquiries)</option>
                      ${DATA.schools.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Your Message / Questions *</label>
                    <textarea id="c_message" rows="5" required placeholder="How can we assist you with admissions or curriculum?"></textarea>
                  </div>
                  <button type="submit" class="button button-secondary" style="margin-top: 10px;">Submit Message</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    function handleContactSubmit(e) {
      e.preventDefault();
      const msg = {
        name: document.getElementById('c_name').value,
        phone: document.getElementById('c_phone').value,
        email: document.getElementById('c_email').value,
        school: document.getElementById('c_school').value,
        message: document.getElementById('c_message').value,
        submitted: new Date().toLocaleDateString()
      };
      DATA.enquiries.push(msg);
      saveStoredData(DATA);
      document.getElementById('contactFormContainer').innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <i class="fa-solid fa-envelope-circle-check" style="font-size: 56px; color: var(--primary-navy); margin-bottom: 20px;"></i>
          <h3>Thank You, ${msg.name}!</h3>
          <p style="font-size: 15px; margin: 15px 0;">Your enquiry regarding <strong>${msg.school}</strong> has been dispatched to Admissions.</p>
          <p style="font-size: 13.5px; color: #666;">We will respond swiftly via SMS and email.</p>
        </div>
      `;
    }

    // ADMIN MANAGEMENT PORTAL (Setting Schools, Categories, Populations)
    function renderAdminPortal() {
      const g = DATA.group;
      return `
        <div class="subpage-hero" style="background: var(--dark-navy); height: 30vh; min-height: 240px;">
          <div class="subpage-hero-content">
            <div class="admin-badge"><i class="fa-solid fa-lock"></i> CENTRAL ADMINISTRATIVE CONSOLE</div>
            <h1>Staff & School Management</h1>
            <p>Configure schools, categories, populations, and institution content</p>
          </div>
        </div>

        <section class="subpage-body" style="background: #f4f6fa;">
          <div class="wrapper">
            <div class="admin-panel-container">
              <div class="admin-tabs">
                <button class="admin-tab active" onclick="showAdminTab('tabSchools')">Manage Schools & Categories</button>
                <button class="admin-tab" onclick="showAdminTab('tabPopulations')">Population & Realistic Data</button>
                <button class="admin-tab" onclick="showAdminTab('tabVision')">Vision, Mission & Motto</button>
                <button class="admin-tab" onclick="showAdminTab('tabVisits')">Visits & Enquiries (${DATA.visits.length + DATA.enquiries.length})</button>
              </div>

              <!-- TAB 1: SCHOOLS & CATEGORIES -->
              <div id="tabSchools" class="admin-tab-content">
                <h3 style="margin-bottom: 10px;">Registered Academic Divisions & Schools</h3>
                <p style="color: #666; margin-bottom: 20px; font-size: 14px;">The admin can add new schools, configure names, and assign categories (e.g. SENIOR SCHOOL, primary, JSS, early learning).</p>

                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Level / Grades</th>
                      <th>Population</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${DATA.schools.map((s, idx) => `
                      <tr>
                        <td><strong>${s.name}</strong><br /><small style="color: #888;">/s/${s.slug}</small></td>
                        <td><span style="background: var(--soft-bg); padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; color: ${s.color};">${s.category}</span></td>
                        <td>${s.level}</td>
                        <td>${s.learners}</td>
                        <td>
                          <button onclick="deleteSchool(${s.id})" style="background: #d9534f; color: #fff; border: 0; padding: 6px 12px; border-radius: 3px; cursor: pointer;">Delete</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

                <div style="margin-top: 35px; background: var(--soft-bg); padding: 25px; border-radius: 4px;">
                  <h4 style="margin-bottom: 15px;">Add New School or Academic Division</h4>
                  <form onsubmit="handleAddSchool(event)" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                    <input type="text" id="new_school_name" required placeholder="School Name (e.g. Pleasantview High)" style="padding: 10px; border: 1px solid #ccc;" />
                    <input type="text" id="new_school_cat" required placeholder="Category (e.g. SENIOR SCHOOL, Primary, JSS)" style="padding: 10px; border: 1px solid #ccc;" />
                    <input type="text" id="new_school_level" required placeholder="Level (e.g. Grades 10 – 12)" style="padding: 10px; border: 1px solid #ccc;" />
                    <input type="text" id="new_school_learners" placeholder="Population (e.g. 450 Students)" style="padding: 10px; border: 1px solid #ccc;" />
                    <input type="text" id="new_school_boarders" placeholder="Boarders (e.g. 200 Boarders)" style="padding: 10px; border: 1px solid #ccc;" />
                    <input type="color" id="new_school_color" value="#05286b" style="height: 44px; width: 100%; border: 1px solid #ccc;" />
                    <button type="submit" class="button button-secondary" style="grid-column: 1 / -1;">+ Add School to Group</button>
                  </form>
                </div>
              </div>

              <!-- TAB 2: POPULATIONS & REALISTIC DATA -->
              <div id="tabPopulations" class="admin-tab-content" style="display: none;">
                <h3 style="margin-bottom: 10px;">Institutional Population Metrics</h3>
                <p style="color: #666; margin-bottom: 25px; font-size: 14px;">Set and adjust realistic population counters shown on the website and school portals.</p>

                <form onsubmit="handleSavePopulations(event)" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 700px;">
                  <div class="form-group">
                    <label>Total Registered Learners</label>
                    <input type="text" id="pop_learners" value="${g.learners}" />
                  </div>
                  <div class="form-group">
                    <label>Boarding Scholars (Gr. 4+)</label>
                    <input type="text" id="pop_boarders" value="${g.boarders}" />
                  </div>
                  <div class="form-group">
                    <label>TSC Certified Faculty</label>
                    <input type="text" id="pop_teachers" value="${g.teachers}" />
                  </div>
                  <div class="form-group">
                    <label>Learner-to-Teacher Ratio</label>
                    <input type="text" id="pop_ratio" value="${g.ratio}" />
                  </div>
                  <div class="form-group">
                    <label>Historic KCPE Mean Score</label>
                    <input type="text" id="pop_kcpe" value="${g.kcpe_mean}" />
                  </div>
                  <div class="form-group">
                    <label>Founded / Years of Excellence</label>
                    <input type="text" id="pop_founded" value="${g.founded}" />
                  </div>
                  <button type="submit" class="button button-secondary" style="grid-column: 1 / -1;">Save Population Statistics</button>
                </form>
              </div>

              <!-- TAB 3: VISION, MISSION & MOTTO -->
              <div id="tabVision" class="admin-tab-content" style="display: none;">
                <h3 style="margin-bottom: 10px;">Vision, Mission & Ethos</h3>
                <p style="color: #666; margin-bottom: 25px; font-size: 14px;">Edit the core institutional declarations displayed on the slideshow and about pages.</p>

                <form onsubmit="handleSaveVision(event)" style="display: grid; gap: 20px; max-width: 750px;">
                  <div class="form-group">
                    <label>Institutional Motto</label>
                    <input type="text" id="vis_motto" value="${g.motto}" />
                  </div>
                  <div class="form-group">
                    <label>Vision Statement</label>
                    <textarea id="vis_vision" rows="3">${g.vision}</textarea>
                  </div>
                  <div class="form-group">
                    <label>Mission Statement</label>
                    <textarea id="vis_mission" rows="3">${g.mission}</textarea>
                  </div>
                  <div class="form-group">
                    <label>Core Values</label>
                    <textarea id="vis_values" rows="2">${g.values}</textarea>
                  </div>
                  <button type="submit" class="button button-secondary">Update Statements</button>
                </form>
              </div>

              <!-- TAB 4: VISITS & ENQUIRIES -->
              <div id="tabVisits" class="admin-tab-content" style="display: none;">
                <h3 style="margin-bottom: 15px;">Campus Visit Bookings (${DATA.visits.length})</h3>
                ${!DATA.visits.length ? '<p style="color: #888;">No campus visits booked yet.</p>' : `
                  <table class="admin-table" style="margin-bottom: 30px;">
                    <thead><tr><th>Parent</th><th>Phone</th><th>School</th><th>Date</th><th>Guests</th></tr></thead>
                    <tbody>${DATA.visits.map(v => `<tr><td>${v.name}</td><td>${v.phone}</td><td>${v.school}</td><td>${v.date}</td><td>${v.guests}</td></tr>`).join('')}</tbody>
                  </table>
                `}

                <h3 style="margin-bottom: 15px;">Admissions & Contact Messages (${DATA.enquiries.length})</h3>
                ${!DATA.enquiries.length ? '<p style="color: #888;">No contact messages received yet.</p>' : `
                  <table class="admin-table">
                    <thead><tr><th>Name</th><th>Phone</th><th>School</th><th>Message</th></tr></thead>
                    <tbody>${DATA.enquiries.map(e => `<tr><td>${e.name}</td><td>${e.phone}</td><td>${e.school}</td><td>${e.message}</td></tr>`).join('')}</tbody>
                  </table>
                `}
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // ADMIN ACTIONS
    function showAdminTab(tabId) {
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
      document.getElementById(tabId).style.display = 'block';
      event.target.classList.add('active');
    }

    function handleAddSchool(e) {
      e.preventDefault();
      const name = document.getElementById('new_school_name').value.trim();
      const cat = document.getElementById('new_school_cat').value.trim();
      const level = document.getElementById('new_school_level').value.trim();
      const learners = document.getElementById('new_school_learners').value.trim() || '400 Students';
      const boarders = document.getElementById('new_school_boarders').value.trim() || '150 Boarders';
      const color = document.getElementById('new_school_color').value;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      DATA.schools.push({
        id: Date.now(),
        slug,
        name,
        category: cat.toUpperCase(),
        level,
        tagline: 'Excellence in ' + cat,
        color,
        image: 'images/banner_2_a.webp',
        learners,
        boarders,
        ratio: '1:20',
        founded: '2026',
        about: name + ' provides premier educational excellence under Kenya\'s Competency Based Curriculum.',
        mission: 'To prepare future leaders in ' + cat + '.',
        vision: 'Excellence in character and learning.'
      });

      saveStoredData(DATA);
      alert('School division & category added successfully!');
      renderApp();
    }

    function deleteSchool(id) {
      if (!confirm('Are you sure you want to remove this school?')) return;
      DATA.schools = DATA.schools.filter(s => s.id !== id);
      saveStoredData(DATA);
      renderApp();
    }

    function handleSavePopulations(e) {
      e.preventDefault();
      DATA.group.learners = document.getElementById('pop_learners').value;
      DATA.group.boarders = document.getElementById('pop_boarders').value;
      DATA.group.teachers = document.getElementById('pop_teachers').value;
      DATA.group.ratio = document.getElementById('pop_ratio').value;
      DATA.group.kcpe_mean = document.getElementById('pop_kcpe').value;
      DATA.group.founded = document.getElementById('pop_founded').value;
      saveStoredData(DATA);
      alert('Population data saved successfully! The live website stats are updated.');
      renderApp();
    }

    function handleSaveVision(e) {
      e.preventDefault();
      DATA.group.motto = document.getElementById('vis_motto').value;
      DATA.group.vision = document.getElementById('vis_vision').value;
      DATA.group.mission = document.getElementById('vis_mission').value;
      DATA.group.values = document.getElementById('vis_values').value;
      saveStoredData(DATA);
      alert('Vision, Mission and Ethos updated successfully!');
      renderApp();
    }

    // NOT FOUND TEMPLATE
    function renderNotFound() {
      return `
        <div class="subpage-hero" style="background: var(--dark-navy);">
          <div class="subpage-hero-content">
            <h1>Page Not Found</h1>
            <p>The requested campus or division page does not exist.</p>
            <a href="#/" class="button button-gold" style="margin-top: 20px;">Return to Homepage</a>
          </div>
        </div>
      `;
    }

    // INITIALIZE ROUTER
    window.addEventListener('hashchange', renderApp);
    window.addEventListener('DOMContentLoaded', renderApp);
    renderApp();
  </script>
</body>
</html>
"""

with open('/home/chrispinus/PLEASANT VIEW SCHOOLS/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Generated index.html successfully, size:", len(html_content))
