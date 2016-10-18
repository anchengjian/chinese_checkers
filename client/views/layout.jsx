import React from 'react';
import { Header, Footer } from 'COMPONENT';

export default function({ children, location }) {
  return (
    <div>
      <section className="container-body"> {children} </section>
    </div>
  );
};

// <Header location={location} user={states.user} />
// <Footer app={states.app} />
