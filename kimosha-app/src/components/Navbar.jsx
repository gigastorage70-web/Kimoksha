'use client';

import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <a href="#" className="brand-logo">
          <span>kimosha</span>
          <span className="dot">telco</span>
          <span className="tag">GLOBAL HUB</span>
        </a>
        <ul className="nav-links">
          <li><a href="#services">Routes & Services</a></li>
          <li><a href="#network">Network Map</a></li>
          <li><a href="#specs">Carrier Specs</a></li>
          <li><a href="#contact">Interconnect NOC</a></li>
        </ul>
        <a href="#contact" className="btn btn-primary">Connect NOC</a>
      </div>
    </header>
  );
}
