import React from 'react';
import { Header, Footer } from 'COMPONENT';

import store from 'STORE';

export default function({ children, location }) {
  let states = store.getState();
  return (
    <div>
      <section className="container-body"> {children} </section>
    </div>
  );
};

// <Header location={location} user={states.user} />
// <Footer app={states.app} />
