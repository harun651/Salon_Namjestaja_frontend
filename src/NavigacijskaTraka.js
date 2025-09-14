import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavigacijskaTraka({ user, onLogout }) {
  const [vidljivo, postaviVidljivost] = useState(true);
  const prethodnoSkrolovanje = useRef(0);
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const efekatSkrolovanje = () => {
      const trenutnoSkrolovanje = window.scrollY;
      postaviVidljivost(
        trenutnoSkrolovanje < prethodnoSkrolovanje.current || trenutnoSkrolovanje < 100
      );
      prethodnoSkrolovanje.current = trenutnoSkrolovanje;
    };
    window.addEventListener('scroll', efekatSkrolovanje);
    return () => window.removeEventListener('scroll', efekatSkrolovanje);
  }, []);

  const Odjava_ = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <nav
      style={{
        padding: '15px 30px',
        background: 'rgba(196, 0, 0, 0.90)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.80)',
        transition: 'transform 0.3s ease',
        transform: vidljivo ? 'translateY(0)' : 'translateY(-100%)',
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px',
        backdropFilter: 'blur(4px)',
      }}
    >
      {!isMobile && (
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0, 0, 0, 1)',
            }}
          >
            <img src="/logoDzeneZe.png" alt="logoDzeneZe" style={{ height: '40px' }} />
          </div>
        </Link>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <StyledLink to="/">Početna</StyledLink>
        <StyledLink to="/namjestaj">Namještaj</StyledLink>
        <StyledLink to="/ONama">O Nama</StyledLink>

        <div style={{ height: '25px', width: '1px', background: '#000', margin: '0 10px' }} />

        {!user ? (
          <>
            <StyledLink to="/login">Prijava</StyledLink>
            <StyledLink to="/registracija">Registracija</StyledLink>
          </>
        ) : (
          <button
            onClick={Odjava_}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#000',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#c40000')}
            onMouseLeave={(e) => (e.target.style.color = '#000')}
          >
            Odjava
          </button>
        )}
      </div>
    </nav>
  );
}

function StyledLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        position: 'relative',
        color: '#000',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '16px',
        paddingBottom: '4px',
        transition: 'color 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.color = '#c40000')}
      onMouseLeave={(e) => (e.target.style.color = '#000')}
    >
      {children}
    </Link>
  );
}

export default NavigacijskaTraka;
