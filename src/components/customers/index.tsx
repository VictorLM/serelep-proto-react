import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteCustomer, getCustomers } from '../../api/customer';
import { Customer } from '../../types/customer.type';
import { BasicFilters } from '../../types/filters.type';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

export const Customers: React.FC = (): ReactElement => {
  const [customers, setCustomers] = useState<Customer[]>();
  const [loading, setLoading] = useState(true);
  // Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [filters, setFilters] = useState<BasicFilters>({
    search: '',
    orderBy: 'ASC',
  });

  function cleanFilters(): void {
    setSearchFilter('');
    setFilters({
      search: '',
      orderBy: 'ASC',
    });
  }

  async function getInitialProps(): Promise<void> {
    setLoading(true);
    cleanFilters();
    const foundCustomers = await getCustomers({});
    setCustomers(foundCustomers);
    setLoading(false);
  }

  async function getCustomersWithFilters(): Promise<void> {
    // VALIDANDO FORM
    if (filters.search) {
      if (filters.search.length < 1 || filters.search.length > 50) {
        toast.error('Pesquisa inválida');
        return;
      }
    }

    if (filters.orderBy !== 'ASC' && filters.orderBy !== 'DESC') {
      toast.error('Ordenar inválido');
      return;
    }

    const query = {
      ...filters,
      search: searchFilter,
    };

    setLoading(true);
    const foundCustomers = await getCustomers(query);
    setCustomers(foundCustomers);
    setLoading(false);
  }

  async function handleDelete(id: string): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir este Cliente?');
    if (confirmation) {
      await deleteCustomer(id);
      toast.success('Cliente excluído com sucesso');
      await getInitialProps();
    }
  }

  function handleSetFilters(key: string, value: string): void {
    setFilters(
      {
        ...filters,
        [key]: value,
      },
    );
  }

  useEffect(() => {
    (async () => {
      await getInitialProps();
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      await getCustomersWithFilters();
    })();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <section className="main-section">
      <div className="card card-light">

        <TopBar
          title="Clientes"
          subtitle="Aqui estão todos os seus clientes cadastrados"
          addButton
        />

        {loading ? <Loader />
          : (
            <div>

              <div className="filters">

                <select
                  name="orderby"
                  value={filters.orderBy}
                  onChange={(e) => handleSetFilters('orderBy', e.target.value)}
                >
                  <option disabled>Ordenar</option>
                  <option value="ASC">Nome A-Z</option>
                  <option value="DESC">Nome Z-A</option>
                </select>

                <form>
                  <input
                    type="text"
                    name="search"
                    placeholder="Nome do Cliente"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  <button type="button" className="search-btn" onClick={() => handleSetFilters('search', searchFilter)}>
                    <img src="/images/search.png" alt="Pesquisar" />
                  </button>
                  <button type="button" className="update-btn" onClick={() => getInitialProps()}>
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
