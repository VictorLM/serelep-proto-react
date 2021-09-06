import React, {
  ReactElement, SyntheticEvent, useEffect, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCustomers } from '../../api/getCustomers';
import { Customer } from '../../types/customer.type';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

import styles from './styles.module.scss';

export const Customers: React.FC = (): ReactElement => {
  const [customers, setCustomers] = useState<Customer[]>();
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('DESC');

  async function getInitialCustomers(): Promise<void> {
    setLoadingCustomers(true);
    setSearch('');
    const foundCustomers = await getCustomers({});
    setCustomers(foundCustomers);
    setLoadingCustomers(false);
  }

  async function getCustomersWithSearchQuery(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    // VALIDANDO FORM
    if (search.length < 1 || search.length > 50) {
      toast.error('Pesquisa inválida');
      return;
    }

    setLoadingCustomers(true);
    const foundCustomers = await getCustomers({ search });
    setCustomers(foundCustomers);
    setLoadingCustomers(false);
  }

  async function getCustomersWithOrderQuery(selectedOrderBy: string): Promise<void> {
    if (selectedOrderBy !== 'ASC' && selectedOrderBy !== 'DESC') {
      toast.error('Ordenar inválido');
      return;
    }
    setOrderBy(selectedOrderBy);
    setLoadingCustomers(true);
    const foundCustomers = await getCustomers({ orderBy });
    setCustomers(foundCustomers);
    setLoadingCustomers(false);
  }

  useEffect(() => {
    (async () => {
      await getInitialCustomers();
    })();
  }, []);

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title="Clientes"
          subtitle="Aqui estão todos os seus clientes cadastrados"
          addButton
        />

        {loadingCustomers ? <Loader />
          : (
            <div className={styles.customers}>

              <div className="filters">

                <select
                  name="orderby"
                  value={orderBy}
                  onChange={(e) => getCustomersWithOrderQuery(e.target.value)}
                >
                  <option value="DESC">Nome A-Z</option>
                  <option value="ASC">Nome Z-A</option>
                </select>

                <form onSubmit={(e) => getCustomersWithSearchQuery(e)}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Nome do Cliente"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="search-btn">
                    <img src="/images/search.png" alt="Pesquisar" />
                  </button>
                  <button type="button" className="update-btn" onClick={() => getInitialCustomers()}>
                    <img src="/images/update.png" alt="Atualizar" />
                  </button>
                </form>

              </div>

              <table cellSpacing="0">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF ou CNPJ</th>
                    <th>Responsável</th>
                    <th>Email</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>

                  {customers && customers?.length > 0 ? (

                    customers?.map((customer) => (

                      <tr key={customer.id}>
                        <td>{customer.name}</td>
                        <td>{customer.doc}</td>
                        <td>{customer.contact}</td>
                        <td>{customer.email}</td>
                        <td>
                          <Link to={`/clientes/${customer.id}/edit`}>
                            <img src="/images/edit.png" alt="Editar" />
                          </Link>
                          <Link to={`/clientes/${customer.id}/delete`}>
                            <img src="/images/delete.png" alt="Excluir" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="not-found-results">
                      <td colSpan={5}>
                        <h2>Nenhum cliente encontrado</h2>
                      </td>
                    </tr>
                  )}

                  {/* id: string;
                  name: string;
                  email: string;
                  contact: string;
                  doc: string;
                  disabled: string;
                  createdAt: string; */}

                </tbody>
              </table>

            </div>
          )}

      </div>
      <Footer />
    </section>
  );
};
