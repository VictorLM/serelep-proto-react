import React, {
  ReactElement, SyntheticEvent, useState,
} from 'react';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import history from '../../history/history';
import { createCustomer } from '../../api/customer';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

import styles from './styles.module.scss';

export const NewCustomerForm: React.FC = (): ReactElement => {
  const [name, setName] = useState('');
  const [doc, setDoc] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  function cleanForm(): void {
    setName('');
    setDoc('');
    setEmail('');
    setContact('');
    setNotes('');
  }

  async function handleCreateCustomer(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    // VALIDANDO FORM
    let formErrors = false;
    if (name.length < 3 || name.length > 50) {
      formErrors = true;
      toast.error('Nome deve ter entre 3 e 50 caracteres');
      return;
    }

    if (doc.length < 11 || doc.length > 14) {
      formErrors = true;
      toast.error('Nome deve ter entre 11 e 14 caracteres');
      return;
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail inválido.');
    }

    if (contact.length < 3 || contact.length > 50) {
      formErrors = true;
      toast.error('Responsável deve ter entre 3 e 50 caracteres');
    }

    if (notes) {
      if (notes.length < 3 || notes.length > 255) {
        formErrors = true;
        toast.error('Anotações devem ter entre 3 e 255 caracteres');
      }
    }

    if (!formErrors) {
      setLoading(true);
      const newCustomer = {
        name, doc, email, contact, notes,
      };
      const result = await createCustomer(newCustomer);
      setLoading(false);
      if (result) {
        toast.success('Cliente cadastrado com sucesso');
        cleanForm();
        history.push('/clientes');
      }
    }
  }

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title="Novo Cliente"
          subtitle="Cadastre um novo Cliente"
          addButton={false}
        />

        <div className={`card card-white w-50 ${styles.card_white}`}>

          {loading ? <Loader />
            : (

              <form className="form-inline" onSubmit={(e) => handleCreateCustomer(e)}>

                <input
                  type="text"
                  name="name"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="text"
                  name="doc"
                  placeholder="CPF ou CNPJ"
                  value={doc}
                  onChange={(e) => setDoc(e.target.value)}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="text"
                  name="contact"
                  placeholder="Responsável"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />

                <textarea
                  name="notes"
                  placeholder="Anotações"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <button type="submit" className="create-btn">
                  Criar Cliente
                </button>
              </form>

            )}

        </div>

      </div>
      <Footer />
    </section>
  );
};
