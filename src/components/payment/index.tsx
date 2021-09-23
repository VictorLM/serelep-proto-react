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

import styles from './styles.module.scss';
import { deletePayment, getPaymentByID } from '../../api/payments';
import { Payment } from '../../types/payment.type';

type PaymentParams = {
  id: string;
};

export const SinglePayment: React.FC = (): ReactElement => {
  const [payment, setPayment] = useState<Payment>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<PaymentParams>();

  async function handleDelete(): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir este Pagamento?');
    if (confirmation) {
      await deletePayment(id);
      toast.success('Pagamento excluído com sucesso');
      history.push('/pagamentos');
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (!id) return;
      const foundPayment = await getPaymentByID(id);

      if (!foundPayment) {
        toast.error('Erro ao carregar as informações do Pagamento');
        setLoading(false);
        history.push('/pagamentos');
      } else {
        setPayment(foundPayment);
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title={`Pgto. ${payment?.id}` || ''}
          subtitle="Aqui estão todas as informações deste Pagamento"
          addButton={false}
        />

        <div className="card card-white w-50">

          {loading ? <Loader />
            : (
              <>
                <table className="single-model-list" cellSpacing="10">
                  <tbody>
                    <tr>
                      <td>Job:</td>
                      <td className="info link-view">
                        <Link to={`/jobs/${payment?.job?.id}`}>
                          {payment?.job?.name}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>Valor:</td>
                      <td className="info">{`${payment?.value.toFixed(2).replace('.', ',')}`}</td>
                    </tr>
                    <tr>
                      <td>Vencimento:</td>
                      <td className="info">{payment?.dueDate.toLocaleString('pt-BR', { dateStyle: 'short' })}</td>
                    </tr>
                    <tr>
                      <td>Status:</td>
                      <td className="info">
                        {payment?.payed ? (
                          <span className="green">&#11044; Pago</span>
                        ) : (
                          <span className="yellow">&#11044; Em aberto</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Criado em:</td>
                      <td className="info">{payment?.createdAt.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>ID:</td>
                      <td className="info">{payment?.id}</td>
                    </tr>
                    {payment?.notes && (
                    <>
                      <tr>
                        <td colSpan={2}>Anotações:</td>
                      </tr>
                      <tr>
                        <td className="info" colSpan={2}>{payment?.notes}</td>
                      </tr>
                    </>
                    )}
                  </tbody>
                </table>

                <div className="single-model-actions">
                  <Link to={`/pagamentos/${payment?.id}/editar`}>
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
