import React from 'react';

function ONama() {
  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <img
          src="/mjestoSalona.png"
          alt="O nama"
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        />
      </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '1100px',
            margin: '40px auto',
            gap: '40px',
            alignItems: 'start',
          }}
        >

        <div
          style={{
            flex: '1',
            fontSize: '18px',
            lineHeight: '2',
            color: '#200',
          }}
        >
          
          <p>---------------------</p>
          <p><strong>Dezen-Ze</strong></p>
          <p><strong>Vlasnik: Muhamed Isaković</strong></p>
          <p><strong>Kontakt: 061/408-768</strong></p>
          <p><strong>Adresa: Štrosmajerova 4, Zenica</strong></p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <strong>Društveni mediji:</strong>
            <a
              href="https://www.facebook.com/dezenzenica"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/fblogo.jpg"
                alt="Facebook"
                style={{
                  width: '30px',
                  height: '30px',
                  objectFit: 'contain',
                  borderRadius: '5px',
                }}
              />
            </a>
          </p>
          <p>---------------------</p>
        </div>

        <div
          style={{
            width: '3px',
            background: '#c40000',
            margin: '0 20px',
            height: '275px',
            alignSelf: 'center',
            borderRadius: '2px',
          }}
        />

        <div
          style={{
            flex: '2',
            lineHeight: '1.7',
            color: '#333',
          }}
        >
          <h1 style={{ color: '#c40000', marginBottom: '20px' }}>O Nama</h1>
          <p>
            Naš salon je otvorio vrata 2019. godine s jednostavnom idejom da stvorimo mjesto gdje ljudi mogu pronaći namještaj koji ne samo da izgleda lijepo, nego se u njemu zaista uživa. Od tada, "Dezen-Ze" je postao najdraže mjesto za sve one koji žele urediti svoj dom sa stilom, ali i osjećajem.

Kod nas ćete pronaći sve od udobnih ugaonih garnitura za porodična druženja, do praktičnih komada za svakodnevni život. Volimo kombinovati moderno sa klasičnim, i uvijek pazimo da svaki komad bude kvalitetan i dugotrajan.

Svaki dom je poseban, a mi smo tu da pomognemo da vaš bude baš onakav kakav ste zamislili topao, ugodan i pun karaktera.

Dobrodošli u "Dezen-Ze" osjećajte se kao kod kuće!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ONama;
