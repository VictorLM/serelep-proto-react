import React, {
  ReactElement, SyntheticEvent, useEffect, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteCustomer } from '../../api/deleteCustomer';
import { getCustomers } from '../../api/getCustomers';
import { Customer } from '../../types/customer.type';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

export const Customers: React.FC = (): ReactElement => {
  const [customers, setCustomers] = useState<Customer[]>();
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('DESC');

  async function getInitialCustomers(): Promise<void> {
    setLoadingCustomers(true);
    setSearch('');
    setOrderBy('DESC');
    const foundCustomers = await getCustomers({});
    setCustomers(foundCustomers);
    setLoadingCustomers(false);
  }

  async function getCustomersWithFilters(e?: SyntheticEvent): Promise<void> {
    if (e) e.preventDefault();
    // VALIDANDO FORM
    if (search) {
      if (search.length < 1 || search.length > 50) {
        toast.error('Pesquisa inválida');
        return;
      }
    }

    if (orderBy !== 'ASC' && orderBy !== 'DESC') {
      toast.error('Ordenar inválido');
      return;
    }

    setLoadingCustomers(true);
    const query = {
      orderBy,
      search,
    };
    const foundCustomers = await getCustomers(query);
    setCustomers(foundCustomers);
    setLoadingCustomers(false);
  }

  async function handleDelete(id: string): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir este Cliente?');
    if (confirmation) {
      await deleteCustomer(id);
      toast.success('Cliente excluído com sucesso');
      await getInitialCustomers();
    }
  }

  async function handleOnChangeSelect(orderByChangedValue: string): Promise<void> {
    setOrderBy(orderByChangedValue);
    await getCustomersWithFilters();
  }

  useEffect(() => {
    (async () => {
      await getInitialCustomers();
    })();
  }, []);

  return (
    <section className="main-section">
      <div className="card card-light">

        <TopBar
          title="Clientes"
          subtitle="Aqui estão todos os seus clientes cadastrados"
          addButton
        />

        {loadingCustomers ? <Loader />
          : (
            <div>

              <div className="filters">

                <select
                  name="orderby"
                  value={orderBy}
                  onChange={(e) => handleOnChangeSelect(e.target.value)}
                >
                  <option value="DESC">Nome A-Z</option>
                  <option value="ASC">Nome Z-A</option>
                </select>

                <form onSubmit={(e) => getCustomersWithFilters(e)}>
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

              <table className="model-list" cellSpacing="0">
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
                        <td className="link-view">
                          <Link to={`/clientes/${customer.id}`}>
                            {customer.name}
                          </Link>
                        </td>
                        <td>{customer.doc}</td>
                        <td>{customer.contact}</td>
                        <td>{customer.email}</td>
                        <td>
                          <Link to={`/clientes/${customer.id}/editar`}>
                            <img src="/images/edit.png" alt="Editar" />
                          </Link>
                          <button type="button" className="delete-btn" onClick={() => handleDelete(customer.id)}>
                            <img src="/images/delete.png" alt="Excluir" />
                          </button>
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

                </tbody>
              </table>

            </div>
          )}

      </div>
      <Footer />
    </section>
  );
};
