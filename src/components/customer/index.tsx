import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import history from '../../history/history';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';
import { getCustomerByID } from '../../api/getCustomerByID';

import styles from './styles.module.scss';
import { Customer } from '../../types/customer.type';
import { deleteCustomer } from '../../api/deleteCustomer';

type CustomerParams = {
  id: string;
};

export const SingleCustomer: React.FC = (): ReactElement => {
  const [customer, setCustomer] = useState<Customer>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<CustomerParams>();

  async function handleDelete(): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir este Cliente?');
    if (confirmation) {
      await deleteCustomer(id);
      toast.success('Cliente excluído com sucesso');
      history.push('/clientes');
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (!id) return;
      const foundCustomer = await getCustomerByID(id);

      if (!foundCustomer) {
        toast.error('Erro ao carregar as informações do Cliente');
        setLoading(false);
        history.push('/clientes');
      } else {
        setCustomer(foundCustomer);
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title={customer?.name || ''}
          subtitle="Aqui estão todas as informações deste Cliente"
          addButton={false}
        />

        <div className="card card-white w-50">

          {loading ? <Loader />
            : (
              <>
                <table className="single-model-list" cellSpacing="10">
                  <tbody>
                    <tr>
                      <td>CPF / CNPJ:</td>
                      <td className="info">{customer?.doc}</td>
                    </tr>
                    <tr>
                      <td>Responsável:</td>
                      <td className="info">{customer?.contact}</td>
                    </tr>
                    <tr>
                      <td>Email:</td>
                      <td className="info">{customer?.email}</td>
                    </tr>
                    <tr>
                      <td>Criado em:</td>
                      <td className="info">{customer?.createdAt.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>ID:</td>
                      <td className="info">{customer?.id}</td>
                    </tr>
                    {customer?.notes && (
                    <>
                      <tr>
                        <td colSpan={2}>Anotações:</td>
                      </tr>
                      <tr>
                        <td className="info" colSpan={2}>{customer?.notes}</td>
                      </tr>
                    </>
                    )}
                  </tbody>
                </table>

                <div className="single-model-actions">
                  <Link to={`/clientes/${customer?.id}/editar`}>
                    <button className="edit-btn-gr" type="button">
                      <img src="/images/edit.png" alt="Editar" />
                      Editar
                    </button>
                  </Link>
                  <button type="button" className="delete-btn-gr" onClick={() => handleDelete()}>
                    <img src="/images/delete.png" alt="Excluir" />
                    Excluir
                  </button>
                </div>

              </>
            )}

        </div>

      </div>
      <Footer />
    </section>
  );
};
