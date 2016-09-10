import React from 'react';
import { Header, Footer } from 'COMPONENT';

import store from 'STORE';

export default function({ children, location }) {
  let states = store.getState();
  return (
    <div>
      <Header location={location} user={states.user} />
      <section className="container-body"> {children} </section>
      <Footer app={states.app} />
    </div>
  );
};
